
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationService } from 'src/database/reservation/reservation.service';
import { ReservationEntity } from 'src/database/reservation/reservation.entity';
import { AnnonceEntity } from 'src/database/annonce/annonce.entity';
import { ReserverDto } from './reserver.dto';
import {
  TypeReservation,
  determinerTypeReservation,
  necessiteVerificationChevauchement,
  necessiteDateUnique,
} from './reservation-type.util';
import { NotificationMetierService } from '../notification/notification-metier.service';
import { StatutReservationEntity } from 'src/database/statut_reservation/statut_reservation.entity';
import { HistoriqueStatutReservationEntity } from 'src/database/historique_statut_reservation/historique_statut_reservation.entity';

// ✅ Vérification des limites selon abonnement
import { AbonnementMetierService } from '../abonnement/abonnement-metier.service';

@Injectable()
export class ReservationMetierService {
  constructor(
    private readonly reservationService: ReservationService,

    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,

    @InjectRepository(AnnonceEntity)
    private readonly annonceRepository: Repository<AnnonceEntity>,

    private readonly notificationMetierService: NotificationMetierService,

    @InjectRepository(StatutReservationEntity)
    private readonly statutReservationRepository: Repository<StatutReservationEntity>,

    @InjectRepository(HistoriqueStatutReservationEntity)
    private readonly historiqueStatutRepository: Repository<HistoriqueStatutReservationEntity>,

    // ✅ Vérification abonnement
    private readonly abonnementMetierService: AbonnementMetierService,
  ) {}

  // ==========================================================================
  // HISTORIQUE STATUT
  // ==========================================================================

  private async _enregistrerHistoriqueStatut(
    reservationId: number,
    libelleStatut: string,
    idUsrConnecte: number,
    commentaire?: string,
  ) {
    try {
      const statut = await this.statutReservationRepository.findOne({
        where: { libelle: libelleStatut } as any,
      });

      if (!statut) {
        console.warn(
          `⚠️ Statut "${libelleStatut}" introuvable dans statutreservation_ssr — historique non créé.`,
        );
        return;
      }

      const historique = this.historiqueStatutRepository.create({
        dateChangement: new Date(),
        commentaire: commentaire ?? null,
        geler: 0,
        dateCreation: new Date(),
        idusrcreation: idUsrConnecte,
        statutReservation: statut,
        reservation: { id: reservationId } as any,
      });
      await this.historiqueStatutRepository.save(historique);
    } catch (error) {
      console.error('❌ Échec création historique statut réservation :', error);
    }
  }

  // ==========================================================================
  // RÉSERVER
  // ==========================================================================

  async reserver(dto: ReserverDto, idUsrConnecte: number) {
    // ✅ Vérifie la limite de réservations selon l'abonnement
    const limite = await this.abonnementMetierService.verifierLimiteReservations(
      idUsrConnecte,
    );

    if (!limite.peutReserver) {
      throw new ForbiddenException(
        limite.message ?? 'Limite de réservations atteinte.',
      );
    }

    const annonce = await this.annonceRepository.findOne({
      where: { id: dto.annonceId } as any,
      relations: ['sousCategorie', 'utilisateur'],
    });

    if (!annonce) {
      throw new NotFoundException('Annonce introuvable');
    }

    const nomSousCategorie: string = (annonce as any).sousCategorie?.nom ?? '';
    const type = determinerTypeReservation(nomSousCategorie);

    if (type === null) {
      throw new BadRequestException(
        "Cette sous-catégorie n'est pas reconnue pour la réservation.",
      );
    }

    const dateDebut = new Date(dto.dateDebut);
    let dateFin: Date;

    // ✅ CORRIGÉ : événementiel avec dateFin OPTIONNELLE (multi-jours)
    if (type === TypeReservation.EVENEMENT) {
      if (dto.dateFin) {
        dateFin = new Date(dto.dateFin);
        if (dateFin <= dateDebut) {
          throw new BadRequestException(
            'La date de fin doit être postérieure à la date de début',
          );
        }
      } else {
        // Événement d'1 jour
        dateFin = new Date(dto.dateDebut);
      }
    } else if (necessiteDateUnique(type)) {
      // Visite, Rendez-vous → date unique
      dateFin = new Date(dto.dateDebut);
    } else {
      // Séjour, Véhicule → dateFin obligatoire
      if (!dto.dateFin) {
        throw new BadRequestException(
          'La date de fin est obligatoire pour ce type de réservation',
        );
      }
      dateFin = new Date(dto.dateFin);
      if (dateFin <= dateDebut) {
        throw new BadRequestException(
          'La date de fin doit être postérieure à la date de début',
        );
      }
    }

    if (necessiteVerificationChevauchement(type)) {
      const chevauchement = await this._aUnChevauchement(
        dto.annonceId,
        dateDebut,
        dateFin,
      );
      if (chevauchement) {
        throw new BadRequestException(
          'Ces dates ne sont plus disponibles pour cette annonce — une autre réservation existe déjà sur cette période.',
        );
      }
    }

    const prixUnitaire = Number((annonce as any).prix ?? 0);
    const fraisVisite = Number(
      (annonce as any).frais_visite ?? (annonce as any).fraisVisite ?? 0,
    );
    const montantTotal = this._calculerMontant(
      type,
      prixUnitaire,
      dateDebut,
      dateFin,
      fraisVisite,
    );

    const description = dto.description
      ? dto.description.substring(0, 100)
      : null;

    const resultat: any = await this.reservationService.save({
      date_debut: dateDebut,
      date_fin: dateFin,
      montant_total: montantTotal,
      statut: 'en_attente',
      empty1: description,
      geler: 0,
      dateCreation: new Date(),
      idusrcreation: idUsrConnecte,
      annonce: { id: dto.annonceId },
      utilisateur: { id: idUsrConnecte },
    });

    await this._enregistrerHistoriqueStatut(
      resultat.id,
      'En attente',
      idUsrConnecte,
      'Réservation créée',
    );

    const proprietaireId = (annonce as any).utilisateur?.id;
    if (proprietaireId) {
      try {
        await this.notificationMetierService.creerNotification({
          idUsr: proprietaireId,
          titre: 'Nouvelle réservation reçue',
          message: `Une nouvelle demande de réservation a été faite sur votre annonce "${(annonce as any).titre}".`,
          type: 'reservation',
          referenceType: 'reservation',
          referenceId: resultat.id,
        });
      } catch (error) {
        console.error('❌ Échec notification propriétaire (réservation) :', error);
      }
    }

    return {
      etat: 'succes',
      message: this._messageConfirmation(type),
      data: {
        reservation: resultat,
        typeReservation: type,
      },
    };
  }

  // ==========================================================================
  // CHEVAUCHEMENT
  // ==========================================================================

  private async _aUnChevauchement(
    annonceId: number,
    dateDebut: Date,
    dateFin: Date,
  ): Promise<boolean> {
    const reservationsExistantes = await this.reservationRepository.find({
      where: { annonce: { id: annonceId } as any, geler: 0 },
      relations: ['annonce'],
    });

    return reservationsExistantes.some((res) => {
      if (res.statut === 'annulee' || res.statut === 'annulée') return false;
      return (
        new Date(res.date_debut) < dateFin && new Date(res.date_fin) > dateDebut
      );
    });
  }

  // ==========================================================================
  // CALCUL MONTANT
  // ==========================================================================

  // ✅ MODIFIÉ : événementiel = calcul multi-jours
  private _calculerMontant(
    type: TypeReservation,
    prixUnitaire: number,
    dateDebut: Date,
    dateFin: Date,
    fraisVisite: number,
  ): number {
    switch (type) {
      case TypeReservation.SEJOUR: {
        const nuits = this._nombreDeJours(dateDebut, dateFin);
        return nuits * prixUnitaire;
      }
      case TypeReservation.VEHICULE: {
        const jours = Math.max(1, this._nombreDeJours(dateDebut, dateFin));
        return jours * prixUnitaire;
      }
      case TypeReservation.EVENEMENT: {
        // ✅ Multi-jours : prix × nombre de jours (+1 inclusif)
        const jours = Math.max(
          1,
          Math.ceil(
            (dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24),
          ) + 1,
        );
        return jours * prixUnitaire;
      }
      case TypeReservation.VISITE:
        return fraisVisite;
      case TypeReservation.RENDEZ_VOUS:
        return prixUnitaire;
      default:
        return 0;
    }
  }

  private _nombreDeJours(debut: Date, fin: Date): number {
    const msParJour = 1000 * 60 * 60 * 24;
    return Math.max(1, Math.round((fin.getTime() - debut.getTime()) / msParJour));
  }

  private _messageConfirmation(type: TypeReservation): string {
    switch (type) {
      case TypeReservation.SEJOUR:
        return 'Séjour réservé avec succès';
      case TypeReservation.VEHICULE:
        return 'Location réservée avec succès';
      case TypeReservation.EVENEMENT:
        return 'Réservation de la salle/espace confirmée';
      case TypeReservation.VISITE:
        return 'Demande de visite envoyée avec succès';
      case TypeReservation.RENDEZ_VOUS:
        return 'Demande de rendez-vous envoyée avec succès';
      default:
        return 'Réservation enregistrée';
    }
  }

  // ==========================================================================
  // MES RÉSERVATIONS
  // ==========================================================================

  async mesReservations(idUsrConnecte: number) {
    try {
      const reservations = await this.reservationRepository.find({
        where: { utilisateur: { id: idUsrConnecte } as any },
        relations: [
          'annonce',
          'annonce.images',
          'annonce.utilisateur',
          'historiquesStatut',
          'historiquesStatut.statutReservation',
        ],
        order: { date_debut: 'DESC' } as any,
      });
      return {
        etat: 'succes',
        message: 'Réservations récupérées',
        data: reservations.map((r) => this._formaterReservation(r)),
      };
    } catch (error) {
      return this._erreurTechnique('mesReservations', error);
    }
  }

  // ==========================================================================
  // RÉSERVATIONS REÇUES
  // ==========================================================================

  async reservationsRecues(idUsrConnecte: number) {
    try {
      const reservations = await this.reservationRepository.find({
        where: { annonce: { utilisateur: { id: idUsrConnecte } as any } } as any,
        relations: [
          'annonce',
          'annonce.images',
          'annonce.utilisateur',
          'utilisateur',
          'historiquesStatut',
          'historiquesStatut.statutReservation',
        ],
        order: { date_debut: 'DESC' } as any,
      });
      return {
        etat: 'succes',
        message: 'Réservations reçues récupérées',
        data: reservations.map((r) => this._formaterReservation(r, true)),
      };
    } catch (error) {
      return this._erreurTechnique('reservationsRecues', error);
    }
  }

  // ==========================================================================
  // VALIDER / ANNULER (utilisateur)
  // ==========================================================================

  async validerReservation(id: number, idUsrConnecte: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id } as any,
      relations: ['annonce', 'annonce.utilisateur', 'utilisateur'],
    });

    if (!reservation) {
      throw new NotFoundException('Réservation introuvable');
    }

    const proprietaireId = (reservation as any).annonce?.utilisateur?.id;
    if (proprietaireId !== idUsrConnecte) {
      throw new ForbiddenException(
        "Vous n'êtes pas le propriétaire de cette annonce, vous ne pouvez pas valider cette réservation.",
      );
    }

    try {
      await this.reservationRepository.update({ id } as any, {
        statut: 'confirmee',
      });
      const resultat: any = { id, statut: 'confirmee' };

      await this._enregistrerHistoriqueStatut(
        id,
        'Confirmée',
        idUsrConnecte,
        'Validée par le propriétaire',
      );

      const clientId = (reservation as any).utilisateur?.id;
      const titreAnnonce = (reservation as any).annonce?.titre ?? 'votre annonce';
      if (clientId) {
        try {
          await this.notificationMetierService.creerNotification({
            idUsr: clientId,
            titre: 'Réservation validée',
            message: `Votre réservation pour "${titreAnnonce}" a été validée par le propriétaire.`,
            type: 'reservation',
            referenceType: 'reservation',
            referenceId: id,
          });
        } catch (error) {
          console.error('❌ Échec notification client (validation) :', error);
        }
      }

      return {
        etat: 'succes',
        message: 'Réservation validée avec succès',
        data: resultat,
      };
    } catch (error) {
      return this._erreurTechnique('validerReservation', error);
    }
  }

  async annulerReservation(id: number, idUsrConnecte: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id } as any,
      relations: ['utilisateur', 'annonce', 'annonce.utilisateur'],
    });

    if (!reservation) {
      throw new NotFoundException('Réservation introuvable');
    }

    const reservataireId = (reservation as any).utilisateur?.id;
    if (reservataireId !== idUsrConnecte) {
      throw new ForbiddenException(
        "Cette réservation n'est pas la vôtre, vous ne pouvez pas l'annuler.",
      );
    }

    try {
      await this.reservationRepository.update({ id } as any, {
        statut: 'annulee',
      });
      const resultat: any = { id, statut: 'annulee' };

      await this._enregistrerHistoriqueStatut(
        id,
        'Annulée',
        idUsrConnecte,
        'Annulée par le client',
      );

      const proprietaireId = (reservation as any).annonce?.utilisateur?.id;
      const titreAnnonce = (reservation as any).annonce?.titre ?? 'votre annonce';
      if (proprietaireId) {
        try {
          await this.notificationMetierService.creerNotification({
            idUsr: proprietaireId,
            titre: 'Réservation annulée',
            message: `Une réservation sur "${titreAnnonce}" a été annulée par le client.`,
            type: 'reservation',
            referenceType: 'reservation',
            referenceId: id,
          });
        } catch (error) {
          console.error('❌ Échec notification propriétaire (annulation) :', error);
        }
      }

      return {
        etat: 'succes',
        message: 'Réservation annulée avec succès',
        data: resultat,
      };
    } catch (error) {
      return this._erreurTechnique('annulerReservation', error);
    }
  }

  private _erreurTechnique(nomMethode: string, error: unknown) {
    const messageErreur = error instanceof Error ? error.message : String(error);
    console.error(`❌ ERREUR ${nomMethode}():`, messageErreur);
    return { etat: 'warning', message: `Erreur technique : ${messageErreur}`, data: null };
  }

  // ====================================================================
  // ADMIN
  // ====================================================================

  async listeReservationsAdmin() {
    try {
      const reservations = await this.reservationRepository.find({
        where: { geler: 0 } as any,
        relations: ['annonce', 'annonce.utilisateur', 'utilisateur'],
        order: { dateCreation: 'DESC' } as any,
      });

      return {
        etat: 'succes',
        message: 'Réservations récupérées',
        data: reservations.map((r) => this._formaterReservationAdmin(r)),
      };
    } catch (error) {
      return this._erreurTechnique('listeReservationsAdmin', error);
    }
  }

  async validerReservationAdmin(id: number) {
    const reservation = await this.reservationRepository.findOne({ where: { id } as any });
    if (!reservation) {
      throw new NotFoundException('Réservation introuvable');
    }

    try {
      await this.reservationRepository.update({ id } as any, { statut: 'confirmee' });
      await this._enregistrerHistoriqueStatut(id, 'Confirmée', 1, 'Validée par l\'administrateur');

      return { etat: 'succes', message: 'Réservation validée avec succès', data: null };
    } catch (error) {
      return this._erreurTechnique('validerReservationAdmin', error);
    }
  }

  async annulerReservationAdmin(id: number) {
    const reservation = await this.reservationRepository.findOne({ where: { id } as any });
    if (!reservation) {
      throw new NotFoundException('Réservation introuvable');
    }

    try {
      await this.reservationRepository.update({ id } as any, { statut: 'annulee' });
      await this._enregistrerHistoriqueStatut(id, 'Annulée', 1, 'Annulée par l\'administrateur');

      return { etat: 'succes', message: 'Réservation annulée avec succès', data: null };
    } catch (error) {
      return this._erreurTechnique('annulerReservationAdmin', error);
    }
  }

  async supprimerReservationAdmin(id: number) {
    const reservation = await this.reservationRepository.findOne({ where: { id } as any });
    if (!reservation) {
      throw new NotFoundException('Réservation introuvable');
    }

    reservation.geler = 1;
    await this.reservationRepository.save(reservation);

    return { etat: 'succes', message: 'Réservation supprimée avec succès', data: null };
  }

  async creerReservationAdmin(data: {
    annonceId: number;
    clientId: number;
    dateDebut: string;
    dateFin?: string;
    montantTotal: number;
    statut?: string;
    description?: string;
  }) {
    if (!data.annonceId || !data.clientId || !data.dateDebut) {
      throw new BadRequestException(
        "L'annonce, le client et la date de début sont obligatoires",
      );
    }

    const annonce = await this.annonceRepository.findOne({
      where: { id: data.annonceId } as any,
    });
    if (!annonce) {
      throw new NotFoundException('Annonce introuvable');
    }

    const statutInitial = data.statut ?? 'en_attente';
    const description = data.description ? data.description.substring(0, 100) : null;

    const resultat: any = await this.reservationService.save({
      date_debut: new Date(data.dateDebut),
      date_fin: data.dateFin ? new Date(data.dateFin) : new Date(data.dateDebut),
      montant_total: data.montantTotal ?? 0,
      statut: statutInitial,
      empty1: description,
      geler: 0,
      dateCreation: new Date(),
      idusrcreation: 1,
      annonce: { id: data.annonceId },
      utilisateur: { id: data.clientId },
    });

    await this._enregistrerHistoriqueStatut(
      resultat.id,
      this._libelleDepuisStatutBrut(statutInitial),
      1,
      'Créée manuellement par l\'administrateur',
    );

    return {
      etat: 'succes',
      message: 'Réservation créée avec succès',
      data: null,
    };
  }

  private _libelleDepuisStatutBrut(statutBrut: string): string {
    switch (statutBrut) {
      case 'confirmee': return 'Confirmée';
      case 'annulee': return 'Annulée';
      default: return 'En attente';
    }
  }

  // ====================================================================
  // FORMATAGE
  // ====================================================================

  private _formaterReservationAdmin(r: ReservationEntity) {
    const annonce: any = (r as any).annonce;
    const proprietaire: any = annonce?.utilisateur;
    const client: any = (r as any).utilisateur;

    const formaterNom = (p: any) =>
      [p?.prenom, p?.nom].filter((v) => !!v).join(' ') || 'Utilisateur inconnu';

    return {
      id: r.id,
      dateDebut: r.date_debut,
      dateFin: r.date_fin,
      montantTotal: r.montant_total,
      montantFormatte: `${(r.montant_total ?? 0).toLocaleString('fr-FR')} FCFA`,
      statut: r.statut,
      description: r.empty1 ?? null,
      dateCreation: r.dateCreation,
      annonce: {
        id: annonce?.id ?? null,
        titre: annonce?.titre ?? 'Annonce',
      },
      client: {
        id: client?.id ?? null,
        nom: formaterNom(client),
        contact: client?.contact ?? null,
      },
      proprietaire: {
        id: proprietaire?.id ?? null,
        nom: formaterNom(proprietaire),
        contact: proprietaire?.contact ?? null,
      },
    };
  }

  private _formaterReservation(r: ReservationEntity, inverserRoles = false) {
    const annonce: any = (r as any).annonce;
    const proprietaire: any = annonce?.utilisateur;
    const client: any = (r as any).utilisateur;
    const premiereImage = annonce?.images?.[0]?.nom ?? null;

    const formaterNom = (p: any) =>
      [p?.prenom, p?.nom].filter((v) => !!v).join(' ');

    const nomAffiche = inverserRoles ? formaterNom(client) : formaterNom(proprietaire);
    const contactAffiche = inverserRoles ? client?.contact : proprietaire?.contact;

    const historiquesBruts: any[] = (r as any).historiquesStatut ?? [];
    const historique = [...historiquesBruts]
      .sort(
        (a, b) =>
          new Date(a.dateChangement).getTime() -
          new Date(b.dateChangement).getTime(),
      )
      .map((h) => ({
        libelle: h.statutReservation?.libelle ?? 'Statut',
        dateChangement: h.dateChangement,
        commentaire: h.commentaire ?? null,
      }));

    return {
      id: r.id,
      dateDebut: r.date_debut,
      dateFin: r.date_fin,
      montantTotal: r.montant_total,
      statut: r.statut,
      description: r.empty1 ?? null,
      historique,
      annonce: {
        id: annonce?.id ?? null,
        titre: annonce?.titre ?? 'Annonce',
        adresse: annonce?.adresse ?? '',
        imageNom: premiereImage,
        proprietaireId: proprietaire?.id ?? null,
        proprietaireNom: nomAffiche.length > 0 ? nomAffiche : null,
        proprietaireContact: contactAffiche ?? null,
      },
    };
  }
}

// import {
//   BadRequestException,
//   ForbiddenException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { ReservationService } from 'src/database/reservation/reservation.service';
// import { ReservationEntity } from 'src/database/reservation/reservation.entity';
// import { AnnonceEntity } from 'src/database/annonce/annonce.entity';
// import { ReserverDto } from './reserver.dto';
// import {
//   TypeReservation,
//   determinerTypeReservation,
//   necessiteVerificationChevauchement,
//   necessiteDateUnique,
// } from './reservation-type.util';
// import { NotificationMetierService } from '../notification/notification-metier.service';
// import { StatutReservationEntity } from 'src/database/statut_reservation/statut_reservation.entity';
// import { HistoriqueStatutReservationEntity } from 'src/database/historique_statut_reservation/historique_statut_reservation.entity';

// // ✅ AJOUT
// import { AbonnementMetierService } from '../abonnement/abonnement-metier.service';

// @Injectable()
// export class ReservationMetierService {
//   constructor(
//     private readonly reservationService: ReservationService,

//     @InjectRepository(ReservationEntity)
//     private readonly reservationRepository: Repository<ReservationEntity>,

//     @InjectRepository(AnnonceEntity)
//     private readonly annonceRepository: Repository<AnnonceEntity>,

//     private readonly notificationMetierService: NotificationMetierService,

//     @InjectRepository(StatutReservationEntity)
//     private readonly statutReservationRepository: Repository<StatutReservationEntity>,

//     @InjectRepository(HistoriqueStatutReservationEntity)
//     private readonly historiqueStatutRepository: Repository<HistoriqueStatutReservationEntity>,

//     // ✅ AJOUT
//     private readonly abonnementMetierService: AbonnementMetierService,
//   ) {}

//   private async _enregistrerHistoriqueStatut(
//     reservationId: number,
//     libelleStatut: string,
//     idUsrConnecte: number,
//     commentaire?: string,
//   ) {
//     try {
//       const statut = await this.statutReservationRepository.findOne({
//         where: { libelle: libelleStatut } as any,
//       });

//       if (!statut) {
//         console.warn(
//           `⚠️ Statut "${libelleStatut}" introuvable dans statutreservation_ssr — historique non créé.`,
//         );
//         return;
//       }

//       const historique = this.historiqueStatutRepository.create({
//         dateChangement: new Date(),
//         commentaire: commentaire ?? null,
//         geler: 0,
//         dateCreation: new Date(),
//         idusrcreation: idUsrConnecte,
//         statutReservation: statut,
//         reservation: { id: reservationId } as any,
//       });
//       await this.historiqueStatutRepository.save(historique);
//     } catch (error) {
//       console.error('❌ Échec création historique statut réservation :', error);
//     }
//   }

//   async reserver(dto: ReserverDto, idUsrConnecte: number) {
//     // ✅ NOUVEAU : Vérifie la limite de réservations selon l'abonnement
//     const limite = await this.abonnementMetierService.verifierLimiteReservations(
//       idUsrConnecte,
//     );

//     if (!limite.peutReserver) {
//       throw new ForbiddenException(
//         limite.message ?? 'Limite de réservations atteinte.',
//       );
//     }

//     const annonce = await this.annonceRepository.findOne({
//       where: { id: dto.annonceId } as any,
//       relations: ['sousCategorie', 'utilisateur'],
//     });

//     if (!annonce) {
//       throw new NotFoundException('Annonce introuvable');
//     }

//     const nomSousCategorie: string = (annonce as any).sousCategorie?.nom ?? '';
//     const type = determinerTypeReservation(nomSousCategorie);

//     if (type === null) {
//       throw new BadRequestException(
//         "Cette sous-catégorie n'est pas reconnue pour la réservation.",
//       );
//     }

//     const dateDebut = new Date(dto.dateDebut);
//     let dateFin: Date;

//     if (necessiteDateUnique(type)) {
//       dateFin = new Date(dto.dateDebut);
//     } else {
//       if (!dto.dateFin) {
//         throw new BadRequestException(
//           'La date de fin est obligatoire pour ce type de réservation',
//         );
//       }
//       dateFin = new Date(dto.dateFin);
//       if (dateFin <= dateDebut) {
//         throw new BadRequestException(
//           'La date de fin doit être postérieure à la date de début',
//         );
//       }
//     }

//     if (necessiteVerificationChevauchement(type)) {
//       const chevauchement = await this._aUnChevauchement(
//         dto.annonceId,
//         dateDebut,
//         dateFin,
//       );
//       if (chevauchement) {
//         throw new BadRequestException(
//           'Ces dates ne sont plus disponibles pour cette annonce — une autre réservation existe déjà sur cette période.',
//         );
//       }
//     }

//     const prixUnitaire = Number((annonce as any).prix ?? 0);
//     const fraisVisite = Number(
//       (annonce as any).frais_visite ?? (annonce as any).fraisVisite ?? 0,
//     );
//     const montantTotal = this._calculerMontant(
//       type,
//       prixUnitaire,
//       dateDebut,
//       dateFin,
//       fraisVisite,
//     );

//     const description = dto.description
//       ? dto.description.substring(0, 100)
//       : null;

//     const resultat: any = await this.reservationService.save({
//       date_debut: dateDebut,
//       date_fin: dateFin,
//       montant_total: montantTotal,
//       statut: 'en_attente',
//       empty1: description,
//       geler: 0,
//       dateCreation: new Date(),
//       idusrcreation: idUsrConnecte,
//       annonce: { id: dto.annonceId },
//       utilisateur: { id: idUsrConnecte },
//     });

//     await this._enregistrerHistoriqueStatut(
//       resultat.id,
//       'En attente',
//       idUsrConnecte,
//       'Réservation créée',
//     );

//     const proprietaireId = (annonce as any).utilisateur?.id;
//     if (proprietaireId) {
//       try {
//         await this.notificationMetierService.creerNotification({
//           idUsr: proprietaireId,
//           titre: 'Nouvelle réservation reçue',
//           message: `Une nouvelle demande de réservation a été faite sur votre annonce "${(annonce as any).titre}".`,
//           type: 'reservation',
//           referenceType: 'reservation',
//           referenceId: resultat.id,
//         });
//       } catch (error) {
//         console.error('❌ Échec notification propriétaire (réservation) :', error);
//       }
//     }

//     return {
//       etat: 'succes',
//       message: this._messageConfirmation(type),
//       data: {
//         reservation: resultat,
//         typeReservation: type,
//       },
//     };
//   }

//   private async _aUnChevauchement(
//     annonceId: number,
//     dateDebut: Date,
//     dateFin: Date,
//   ): Promise<boolean> {
//     const reservationsExistantes = await this.reservationRepository.find({
//       where: { annonce: { id: annonceId } as any, geler: 0 },
//       relations: ['annonce'],
//     });

//     return reservationsExistantes.some((res) => {
//       if (res.statut === 'annulee' || res.statut === 'annulée') return false;
//       return (
//         new Date(res.date_debut) < dateFin && new Date(res.date_fin) > dateDebut
//       );
//     });
//   }

//   private _calculerMontant(
//     type: TypeReservation,
//     prixUnitaire: number,
//     dateDebut: Date,
//     dateFin: Date,
//     fraisVisite: number,
//   ): number {
//     switch (type) {
//       case TypeReservation.SEJOUR: {
//         const nuits = this._nombreDeJours(dateDebut, dateFin);
//         return nuits * prixUnitaire;
//       }
//       case TypeReservation.VEHICULE: {
//         const jours = Math.max(1, this._nombreDeJours(dateDebut, dateFin));
//         return jours * prixUnitaire;
//       }
//       case TypeReservation.EVENEMENT:
//         return prixUnitaire;
//       case TypeReservation.VISITE:
//         return fraisVisite;
//       case TypeReservation.RENDEZ_VOUS:
//         return prixUnitaire;
//       default:
//         return 0;
//     }
//   }

//   private _nombreDeJours(debut: Date, fin: Date): number {
//     const msParJour = 1000 * 60 * 60 * 24;
//     return Math.max(1, Math.round((fin.getTime() - debut.getTime()) / msParJour));
//   }

//   private _messageConfirmation(type: TypeReservation): string {
//     switch (type) {
//       case TypeReservation.SEJOUR:
//         return 'Séjour réservé avec succès';
//       case TypeReservation.VEHICULE:
//         return 'Location réservée avec succès';
//       case TypeReservation.EVENEMENT:
//         return 'Réservation de la salle/espace confirmée';
//       case TypeReservation.VISITE:
//         return 'Demande de visite envoyée avec succès';
//       case TypeReservation.RENDEZ_VOUS:
//         return 'Demande de rendez-vous envoyée avec succès';
//       default:
//         return 'Réservation enregistrée';
//     }
//   }

//   async mesReservations(idUsrConnecte: number) {
//     try {
//       const reservations = await this.reservationRepository.find({
//         where: { utilisateur: { id: idUsrConnecte } as any },
//         relations: [
//           'annonce',
//           'annonce.images',
//           'annonce.utilisateur',
//           'historiquesStatut',
//           'historiquesStatut.statutReservation',
//         ],
//         order: { date_debut: 'DESC' } as any,
//       });
//       return {
//         etat: 'succes',
//         message: 'Réservations récupérées',
//         data: reservations.map((r) => this._formaterReservation(r)),
//       };
//     } catch (error) {
//       return this._erreurTechnique('mesReservations', error);
//     }
//   }

//   async reservationsRecues(idUsrConnecte: number) {
//     try {
//       const reservations = await this.reservationRepository.find({
//         where: { annonce: { utilisateur: { id: idUsrConnecte } as any } } as any,
//         relations: [
//           'annonce',
//           'annonce.images',
//           'annonce.utilisateur',
//           'utilisateur',
//           'historiquesStatut',
//           'historiquesStatut.statutReservation',
//         ],
//         order: { date_debut: 'DESC' } as any,
//       });
//       return {
//         etat: 'succes',
//         message: 'Réservations reçues récupérées',
//         data: reservations.map((r) => this._formaterReservation(r, true)),
//       };
//     } catch (error) {
//       return this._erreurTechnique('reservationsRecues', error);
//     }
//   }

//   async validerReservation(id: number, idUsrConnecte: number) {
//     const reservation = await this.reservationRepository.findOne({
//       where: { id } as any,
//       relations: ['annonce', 'annonce.utilisateur', 'utilisateur'],
//     });

//     if (!reservation) {
//       throw new NotFoundException('Réservation introuvable');
//     }

//     const proprietaireId = (reservation as any).annonce?.utilisateur?.id;
//     if (proprietaireId !== idUsrConnecte) {
//       throw new ForbiddenException(
//         "Vous n'êtes pas le propriétaire de cette annonce, vous ne pouvez pas valider cette réservation.",
//       );
//     }

//     try {
//       await this.reservationRepository.update({ id } as any, {
//         statut: 'confirmee',
//       });
//       const resultat: any = { id, statut: 'confirmee' };

//       await this._enregistrerHistoriqueStatut(
//         id,
//         'Confirmée',
//         idUsrConnecte,
//         'Validée par le propriétaire',
//       );

//       const clientId = (reservation as any).utilisateur?.id;
//       const titreAnnonce = (reservation as any).annonce?.titre ?? 'votre annonce';
//       if (clientId) {
//         try {
//           await this.notificationMetierService.creerNotification({
//             idUsr: clientId,
//             titre: 'Réservation validée',
//             message: `Votre réservation pour "${titreAnnonce}" a été validée par le propriétaire.`,
//             type: 'reservation',
//             referenceType: 'reservation',
//             referenceId: id,
//           });
//         } catch (error) {
//           console.error('❌ Échec notification client (validation) :', error);
//         }
//       }

//       return {
//         etat: 'succes',
//         message: 'Réservation validée avec succès',
//         data: resultat,
//       };
//     } catch (error) {
//       return this._erreurTechnique('validerReservation', error);
//     }
//   }

//   async annulerReservation(id: number, idUsrConnecte: number) {
//     const reservation = await this.reservationRepository.findOne({
//       where: { id } as any,
//       relations: ['utilisateur', 'annonce', 'annonce.utilisateur'],
//     });

//     if (!reservation) {
//       throw new NotFoundException('Réservation introuvable');
//     }

//     const reservataireId = (reservation as any).utilisateur?.id;
//     if (reservataireId !== idUsrConnecte) {
//       throw new ForbiddenException(
//         "Cette réservation n'est pas la vôtre, vous ne pouvez pas l'annuler.",
//       );
//     }

//     try {
//       await this.reservationRepository.update({ id } as any, {
//         statut: 'annulee',
//       });
//       const resultat: any = { id, statut: 'annulee' };

//       await this._enregistrerHistoriqueStatut(
//         id,
//         'Annulée',
//         idUsrConnecte,
//         'Annulée par le client',
//       );

//       const proprietaireId = (reservation as any).annonce?.utilisateur?.id;
//       const titreAnnonce = (reservation as any).annonce?.titre ?? 'votre annonce';
//       if (proprietaireId) {
//         try {
//           await this.notificationMetierService.creerNotification({
//             idUsr: proprietaireId,
//             titre: 'Réservation annulée',
//             message: `Une réservation sur "${titreAnnonce}" a été annulée par le client.`,
//             type: 'reservation',
//             referenceType: 'reservation',
//             referenceId: id,
//           });
//         } catch (error) {
//           console.error('❌ Échec notification propriétaire (annulation) :', error);
//         }
//       }

//       return {
//         etat: 'succes',
//         message: 'Réservation annulée avec succès',
//         data: resultat,
//       };
//     } catch (error) {
//       return this._erreurTechnique('annulerReservation', error);
//     }
//   }

//   private _erreurTechnique(nomMethode: string, error: unknown) {
//     const messageErreur = error instanceof Error ? error.message : String(error);
//     console.error(`❌ ERREUR ${nomMethode}():`, messageErreur);
//     return { etat: 'warning', message: `Erreur technique : ${messageErreur}`, data: null };
//   }

//   // ====================================================================
//   // ADMIN
//   // ====================================================================

//   async listeReservationsAdmin() {
//     try {
//       const reservations = await this.reservationRepository.find({
//         where: { geler: 0 } as any,
//         relations: ['annonce', 'annonce.utilisateur', 'utilisateur'],
//         order: { dateCreation: 'DESC' } as any,
//       });

//       return {
//         etat: 'succes',
//         message: 'Réservations récupérées',
//         data: reservations.map((r) => this._formaterReservationAdmin(r)),
//       };
//     } catch (error) {
//       return this._erreurTechnique('listeReservationsAdmin', error);
//     }
//   }

//   async validerReservationAdmin(id: number) {
//     const reservation = await this.reservationRepository.findOne({ where: { id } as any });
//     if (!reservation) {
//       throw new NotFoundException('Réservation introuvable');
//     }

//     try {
//       await this.reservationRepository.update({ id } as any, { statut: 'confirmee' });
//       await this._enregistrerHistoriqueStatut(id, 'Confirmée', 1, 'Validée par l\'administrateur');

//       return { etat: 'succes', message: 'Réservation validée avec succès', data: null };
//     } catch (error) {
//       return this._erreurTechnique('validerReservationAdmin', error);
//     }
//   }

//   async annulerReservationAdmin(id: number) {
//     const reservation = await this.reservationRepository.findOne({ where: { id } as any });
//     if (!reservation) {
//       throw new NotFoundException('Réservation introuvable');
//     }

//     try {
//       await this.reservationRepository.update({ id } as any, { statut: 'annulee' });
//       await this._enregistrerHistoriqueStatut(id, 'Annulée', 1, 'Annulée par l\'administrateur');

//       return { etat: 'succes', message: 'Réservation annulée avec succès', data: null };
//     } catch (error) {
//       return this._erreurTechnique('annulerReservationAdmin', error);
//     }
//   }

//   async supprimerReservationAdmin(id: number) {
//     const reservation = await this.reservationRepository.findOne({ where: { id } as any });
//     if (!reservation) {
//       throw new NotFoundException('Réservation introuvable');
//     }

//     reservation.geler = 1;
//     await this.reservationRepository.save(reservation);

//     return { etat: 'succes', message: 'Réservation supprimée avec succès', data: null };
//   }

//   async creerReservationAdmin(data: {
//     annonceId: number;
//     clientId: number;
//     dateDebut: string;
//     dateFin?: string;
//     montantTotal: number;
//     statut?: string;
//     description?: string;
//   }) {
//     if (!data.annonceId || !data.clientId || !data.dateDebut) {
//       throw new BadRequestException(
//         "L'annonce, le client et la date de début sont obligatoires",
//       );
//     }

//     const annonce = await this.annonceRepository.findOne({
//       where: { id: data.annonceId } as any,
//     });
//     if (!annonce) {
//       throw new NotFoundException('Annonce introuvable');
//     }

//     const statutInitial = data.statut ?? 'en_attente';
//     const description = data.description ? data.description.substring(0, 100) : null;

//     const resultat: any = await this.reservationService.save({
//       date_debut: new Date(data.dateDebut),
//       date_fin: data.dateFin ? new Date(data.dateFin) : new Date(data.dateDebut),
//       montant_total: data.montantTotal ?? 0,
//       statut: statutInitial,
//       empty1: description,
//       geler: 0,
//       dateCreation: new Date(),
//       idusrcreation: 1,
//       annonce: { id: data.annonceId },
//       utilisateur: { id: data.clientId },
//     });

//     await this._enregistrerHistoriqueStatut(
//       resultat.id,
//       this._libelleDepuisStatutBrut(statutInitial),
//       1,
//       'Créée manuellement par l\'administrateur',
//     );

//     return {
//       etat: 'succes',
//       message: 'Réservation créée avec succès',
//       data: null,
//     };
//   }

//   private _libelleDepuisStatutBrut(statutBrut: string): string {
//     switch (statutBrut) {
//       case 'confirmee': return 'Confirmée';
//       case 'annulee': return 'Annulée';
//       default: return 'En attente';
//     }
//   }

//   private _formaterReservationAdmin(r: ReservationEntity) {
//     const annonce: any = (r as any).annonce;
//     const proprietaire: any = annonce?.utilisateur;
//     const client: any = (r as any).utilisateur;

//     const formaterNom = (p: any) =>
//       [p?.prenom, p?.nom].filter((v) => !!v).join(' ') || 'Utilisateur inconnu';

//     return {
//       id: r.id,
//       dateDebut: r.date_debut,
//       dateFin: r.date_fin,
//       montantTotal: r.montant_total,
//       montantFormatte: `${(r.montant_total ?? 0).toLocaleString('fr-FR')} FCFA`,
//       statut: r.statut,
//       description: r.empty1 ?? null,
//       dateCreation: r.dateCreation,
//       annonce: {
//         id: annonce?.id ?? null,
//         titre: annonce?.titre ?? 'Annonce',
//       },
//       client: {
//         id: client?.id ?? null,
//         nom: formaterNom(client),
//         contact: client?.contact ?? null,
//       },
//       proprietaire: {
//         id: proprietaire?.id ?? null,
//         nom: formaterNom(proprietaire),
//         contact: proprietaire?.contact ?? null,
//       },
//     };
//   }

//   private _formaterReservation(r: ReservationEntity, inverserRoles = false) {
//     const annonce: any = (r as any).annonce;
//     const proprietaire: any = annonce?.utilisateur;
//     const client: any = (r as any).utilisateur;
//     const premiereImage = annonce?.images?.[0]?.nom ?? null;

//     const formaterNom = (p: any) =>
//       [p?.prenom, p?.nom].filter((v) => !!v).join(' ');

//     const nomAffiche = inverserRoles ? formaterNom(client) : formaterNom(proprietaire);
//     const contactAffiche = inverserRoles ? client?.contact : proprietaire?.contact;

//     const historiquesBruts: any[] = (r as any).historiquesStatut ?? [];
//     const historique = [...historiquesBruts]
//       .sort(
//         (a, b) =>
//           new Date(a.dateChangement).getTime() -
//           new Date(b.dateChangement).getTime(),
//       )
//       .map((h) => ({
//         libelle: h.statutReservation?.libelle ?? 'Statut',
//         dateChangement: h.dateChangement,
//         commentaire: h.commentaire ?? null,
//       }));

//     return {
//       id: r.id,
//       dateDebut: r.date_debut,
//       dateFin: r.date_fin,
//       montantTotal: r.montant_total,
//       statut: r.statut,
//       description: r.empty1 ?? null,
//       historique,
//       annonce: {
//         id: annonce?.id ?? null,
//         titre: annonce?.titre ?? 'Annonce',
//         adresse: annonce?.adresse ?? '',
//         imageNom: premiereImage,
//         proprietaireId: proprietaire?.id ?? null,
//         proprietaireNom: nomAffiche.length > 0 ? nomAffiche : null,
//         proprietaireContact: contactAffiche ?? null,
//       },
//     };
//   }
// }