import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';

import { AbonnementEntity } from '../../database/abonnement/abonnement.entity';
import { PlanAbonnementEntity } from '../../database/plan_abonnement/plan_abonnement.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { TransactionEntity } from '../../database/transaction/transaction.entity';
import { AnnonceEntity } from '../../database/annonce/annonce.entity';
import { ReservationEntity } from '../../database/reservation/reservation.entity'; // ✅ AJOUT

@Injectable()
export class AbonnementMetierService {
  constructor(
    @InjectRepository(AbonnementEntity)
    private readonly abonnementRepository: Repository<AbonnementEntity>,

    @InjectRepository(PlanAbonnementEntity)
    private readonly planRepository: Repository<PlanAbonnementEntity>,

    @InjectRepository(UtilisateurEntity)
    private readonly utilisateurRepository: Repository<UtilisateurEntity>,

    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,

    @InjectRepository(AnnonceEntity)
    private readonly annonceRepository: Repository<AnnonceEntity>,

    // ✅ AJOUT
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
  ) {}

  // =========================================================================
  // LISTE DES PLANS
  // =========================================================================

  async getPlans() {
    const plans = await this.planRepository.find({
      where: { actif: 1, geler: 0 },
      order: { ordre: 'ASC' },
    });

    return {
      success: true,
      count: plans.length,
      data: plans.map((plan) => this.formaterPlan(plan)),
    };
  }

  async getPlanByCode(code: string) {
    const plan = await this.planRepository.findOne({
      where: { code, actif: 1, geler: 0 },
    });

    if (!plan) {
      throw new NotFoundException(`Plan '${code}' introuvable`);
    }

    return plan;
  }

  // =========================================================================
  // SOUSCRIPTION
  // =========================================================================

  async souscrire(codePlan: string, idUsrConnecte: number) {
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id: idUsrConnecte },
    });

    if (!utilisateur) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const abonnementActif = await this.getAbonnementActif(idUsrConnecte);

    if (abonnementActif) {
      const planActif = await this.planRepository.findOne({
        where: {
          id: (abonnementActif as any).plan?.id,
        },
      });

      const estGratuit =
        planActif?.prix === 0 || planActif?.code === 'gratuit';

      if (estGratuit) {
        console.log(
          `✅ [Abonnement] Remplacement du plan GRATUIT (user ${idUsrConnecte})`,
        );

        abonnementActif.statut = 'annule';
        abonnementActif.dateAnnulation = new Date();
        abonnementActif.raisonAnnulation =
          'Remplacé automatiquement par un abonnement payant';
        abonnementActif.autoRenouvellement = 0;
        abonnementActif.dateModification = new Date();

        await this.abonnementRepository.save(abonnementActif);
      } else {
        throw new ConflictException(
          "Vous avez déjà un abonnement payant actif. Annulez-le avant d'en souscrire un nouveau.",
        );
      }
    }

    const plan = await this.getPlanByCode(codePlan);

    const dateDebut = new Date();
    let dateFin: Date | null = null;
    let dateProchainPaiement: Date | null = null;

    if (plan.typeFacturation === 'mensuel') {
      dateFin = new Date(dateDebut);
      dateFin.setMonth(dateFin.getMonth() + 1);
      dateProchainPaiement = new Date(dateFin);
    }

    if (
      plan.typeFacturation === 'annuelle' ||
      plan.typeFacturation === 'annuel' ||
      plan.code === 'a_vie'
    ) {
      dateFin = new Date(dateDebut);
      dateFin.setFullYear(dateFin.getFullYear() + 1);
      dateProchainPaiement = new Date(dateFin);
    }

    const reference = await this.genererReferenceAbonnement();

    const abonnement = this.abonnementRepository.create({
      reference,
      typeFacturation: plan.typeFacturation,
      dateDebut,
      dateFin,
      dateProchainPaiement,
      montantPaye: plan.prix,
      devise: plan.devise,
      statut: plan.prix === 0 ? 'actif' : 'en_attente',
      autoRenouvellement:
        plan.typeFacturation === 'mensuel' ||
        plan.typeFacturation === 'annuelle' ||
        plan.typeFacturation === 'annuel' ||
        plan.code === 'a_vie'
          ? 1
          : 0,
      annoncesUtilisees: 0,
      boostsUtilises: 0,
      dateCreation: new Date(),
      dateModification: null,
      geler: 0,
      idusrcreation: idUsrConnecte,
      utilisateur: { id: idUsrConnecte } as UtilisateurEntity,
      plan: { id: plan.id } as PlanAbonnementEntity,
    });

    const abonnementSaved = await this.abonnementRepository.save(abonnement);

    if (plan.prix === 0) {
      return {
        success: true,
        message: 'Abonnement gratuit activé',
        abonnement: this.formaterAbonnement(abonnementSaved, plan),
        besoinPaiement: false,
      };
    }

    const referenceTransaction = await this.genererReferenceTransaction();

    const transaction = this.transactionRepository.create({
      reference: referenceTransaction,
      type: 'abonnement',
      montant: plan.prix,
      devise: plan.devise,
      montantCommission: 0,
      pourcentageCommission: 0,
      montantNet: plan.prix,
      statut: 'en_attente',
      methodePaiement: null,
      referenceExterne: null,
      referenceOperateur: null,
      description: `Souscription abonnement ${plan.nom}`,
      metadata: JSON.stringify({
        abonnementId: abonnementSaved.id,
        planCode: plan.code,
      }),
      erreur: null,
      dateCreation: new Date(),
      dateValidation: null,
      dateRemboursement: null,
      geler: 0,
      idusrcreation: idUsrConnecte,
      utilisateur: { id: idUsrConnecte } as UtilisateurEntity,
      beneficiaire: null,
      reservation: null,
    });

    const transactionSaved = await this.transactionRepository.save(transaction);

    return {
      success: true,
      message: 'Abonnement créé. Veuillez procéder au paiement.',
      abonnement: this.formaterAbonnement(abonnementSaved, plan),
      besoinPaiement: true,
      transaction: {
        id: transactionSaved.id,
        reference: transactionSaved.reference,
        montant: transactionSaved.montant,
        devise: transactionSaved.devise,
      },
    };
  }

  // =========================================================================
  // CONSULTATION
  // =========================================================================

  async getMonAbonnement(idUsrConnecte: number) {
    const abonnement = await this.getAbonnementActif(idUsrConnecte);

    if (!abonnement) {
      return {
        success: true,
        data: null,
        message: 'Aucun abonnement actif',
      };
    }

    const annoncesUtilisees = await this.annonceRepository.count({
      where: {
        utilisateur: { id: idUsrConnecte },
        geler: 0,
      },
    });

    // ✅ Compter aussi les réservations actives
    const reservationsUtilisees = await this.reservationRepository.count({
      where: [
        {
          utilisateur: { id: idUsrConnecte },
          statut: 'en_attente',
          geler: 0,
        },
        {
          utilisateur: { id: idUsrConnecte },
          statut: 'confirmee',
          geler: 0,
        },
      ],
    });

    console.log(
      `📊 [getMonAbonnement] user#${idUsrConnecte} → ${annoncesUtilisees} annonces, ${reservationsUtilisees} réservations`,
    );

    const dataFormatee = this.formaterAbonnement(abonnement, abonnement.plan);

    return {
      success: true,
      data: {
        ...dataFormatee,
        compteurs: {
          ...dataFormatee.compteurs,
          annoncesUtilisees: annoncesUtilisees,
          reservationsUtilisees: reservationsUtilisees, // ✅ AJOUT
        },
      },
    };
  }

  async getHistorique(idUsrConnecte: number) {
    const abonnements = await this.abonnementRepository.find({
      where: { utilisateur: { id: idUsrConnecte }, geler: 0 },
      relations: ['plan'],
      order: { dateCreation: 'DESC' },
    });

    return {
      success: true,
      count: abonnements.length,
      data: abonnements.map((a) => this.formaterAbonnement(a, a.plan)),
    };
  }

  // =========================================================================
  // ✅ NOUVEAU : VÉRIFICATION DES LIMITES
  // =========================================================================

  async verifierLimiteReservations(idUsrConnecte: number): Promise<{
    peutReserver: boolean;
    reservationsUtilisees: number;
    limiteReservations: number;
    message?: string;
  }> {
    const abonnement = await this.getAbonnementActif(idUsrConnecte);

    if (!abonnement || !abonnement.plan) {
      return {
        peutReserver: false,
        reservationsUtilisees: 0,
        limiteReservations: 0,
        message: 'Vous devez avoir un abonnement actif pour réserver.',
      };
    }

    const plan = abonnement.plan;

    // Compter les réservations actives (en_attente + confirmee)
    const reservationsUtilisees = await this.reservationRepository.count({
      where: [
        {
          utilisateur: { id: idUsrConnecte },
          statut: 'en_attente',
          geler: 0,
        },
        {
          utilisateur: { id: idUsrConnecte },
          statut: 'confirmee',
          geler: 0,
        },
      ],
    });

    // ✅ Limite = même que les annonces (nbAnnoncesMax)
    const limiteReservations = plan.nbAnnoncesMax ?? 999999;
    const estIllimite = limiteReservations >= 999999;

    console.log(
      `📊 [verifierLimiteReservations] user#${idUsrConnecte} → ${reservationsUtilisees}/${estIllimite ? '∞' : limiteReservations}`,
    );

    if (!estIllimite && reservationsUtilisees >= limiteReservations) {
      return {
        peutReserver: false,
        reservationsUtilisees,
        limiteReservations,
        message:
          `Vous avez atteint la limite de ${limiteReservations} réservations actives ` +
          `autorisées par votre forfait "${plan.nom}". ` +
          `Passez à un forfait supérieur pour réserver plus.`,
      };
    }

    return {
      peutReserver: true,
      reservationsUtilisees,
      limiteReservations,
    };
  }

  // =========================================================================
  // ANNULATION
  // =========================================================================

  async annuler(raison: string | undefined, idUsrConnecte: number) {
    const abonnement = await this.getAbonnementActif(idUsrConnecte);

    if (!abonnement) {
      throw new NotFoundException('Aucun abonnement actif à annuler');
    }

    const estAnnuel =
      abonnement.typeFacturation === 'a_vie' ||
      abonnement.typeFacturation === 'annuelle' ||
      abonnement.typeFacturation === 'annuel';

    if (estAnnuel) {
      abonnement.statut = 'annule';
      abonnement.dateAnnulation = new Date();
      abonnement.raisonAnnulation =
        raison ?? "Annulation par l'utilisateur";
      abonnement.autoRenouvellement = 0;
      abonnement.dateModification = new Date();

      await this.abonnementRepository.save(abonnement);

      return {
        success: true,
        message:
          "Abonnement annulé. Il restera actif jusqu'à sa date d'expiration.",
      };
    }

    abonnement.statut = 'annule';
    abonnement.dateAnnulation = new Date();
    abonnement.raisonAnnulation = raison ?? "Annulation par l'utilisateur";
    abonnement.autoRenouvellement = 0;
    abonnement.dateModification = new Date();

    await this.abonnementRepository.save(abonnement);

    return {
      success: true,
      message: 'Abonnement annulé avec succès',
    };
  }

  // =========================================================================
  // ROUTES ADMIN (inchangé)
  // =========================================================================

  async listeAdmin(filtres: any) {
    const qb = this.abonnementRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.plan', 'plan')
      .leftJoinAndSelect('a.utilisateur', 'utilisateur')
      .where('a.geler = :geler', { geler: 0 });

    if (filtres.periodicite === 'jour' && filtres.dateJour) {
      qb.andWhere('DATE(a.dateCreation) = :dateJour', {
        dateJour: filtres.dateJour,
      });
    } else if (
      filtres.periodicite === 'semaine' &&
      filtres.dateDebut &&
      filtres.dateFin
    ) {
      qb.andWhere('DATE(a.dateCreation) BETWEEN :dateDebut AND :dateFin', {
        dateDebut: filtres.dateDebut,
        dateFin: filtres.dateFin,
      });
    } else if (
      filtres.periodicite === 'mois' &&
      filtres.mois &&
      filtres.annee
    ) {
      qb.andWhere(
        'MONTH(a.dateCreation) = :mois AND YEAR(a.dateCreation) = :annee',
        { mois: filtres.mois, annee: filtres.annee },
      );
    } else if (filtres.periodicite === 'annee' && filtres.annee) {
      qb.andWhere('YEAR(a.dateCreation) = :annee', { annee: filtres.annee });
    }

    qb.orderBy('a.dateCreation', 'DESC');

    const abonnements = await qb.getMany();

    return {
      success: true,
      count: abonnements.length,
      data: abonnements.map((a) => this.formaterAbonnement(a, a.plan)),
    };
  }

  async getStatsDashboard(dateDebut?: string, dateFin?: string) {
    const qb = this.abonnementRepository
      .createQueryBuilder('a')
      .where('a.geler = :geler', { geler: 0 });

    if (dateDebut) {
      qb.andWhere('DATE(a.dateCreation) >= :dateDebut', { dateDebut });
    }
    if (dateFin) {
      qb.andWhere('DATE(a.dateCreation) <= :dateFin', { dateFin });
    }

    const abonnements = await qb.getMany();

    const total = abonnements.length;
    const actifs = abonnements.filter((a) => a.statut === 'actif').length;
    const enAttente = abonnements.filter((a) => a.statut === 'en_attente').length;
    const expires = abonnements.filter((a) => a.statut === 'expire').length;
    const annules = abonnements.filter((a) => a.statut === 'annule').length;

    const montantTotal = abonnements
      .filter((a) => a.statut === 'actif')
      .reduce((sum, a) => sum + (Number(a.montantPaye) || 0), 0);

    const maintenant = new Date();
    const debutMois = new Date(
      maintenant.getFullYear(),
      maintenant.getMonth(),
      1,
    );
    const finMois = new Date(
      maintenant.getFullYear(),
      maintenant.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const montantMois = abonnements
      .filter((a) => {
        if (a.statut !== 'actif') return false;
        const d = new Date(a.dateDebut);
        return d >= debutMois && d <= finMois;
      })
      .reduce((sum, a) => sum + (Number(a.montantPaye) || 0), 0);

    const tauxActivation = total > 0 ? Math.round((actifs / total) * 100) : 0;

    return {
      success: true,
      data: {
        total,
        actifs,
        enAttente,
        expires,
        annules,
        montantTotal,
        montantMois,
        tauxActivation,
      },
    };
  }

  async creerAdmin(dto: any, idUsrConnecte: number) {
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id: dto.utilisateur_id_usr },
    });
    if (!utilisateur) throw new NotFoundException('Utilisateur introuvable');

    const plan = await this.planRepository.findOne({
      where: { id: dto.plan_id_pab },
    });
    if (!plan) throw new NotFoundException('Plan introuvable');

    const reference = await this.genererReferenceAbonnement();

    const abonnement = this.abonnementRepository.create({
      reference,
      typeFacturation: dto.typeFacturation ?? plan.typeFacturation,
      dateDebut: dto.dateDebut ? new Date(dto.dateDebut) : new Date(),
      dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
      dateProchainPaiement: dto.dateProchainPaiement
        ? new Date(dto.dateProchainPaiement)
        : null,
      montantPaye: dto.montantPaye ?? plan.prix,
      devise: dto.devise ?? plan.devise,
      statut: dto.statut ?? 'en_attente',
      autoRenouvellement: dto.autoRenouvellement ?? 0,
      annoncesUtilisees: dto.annoncesUtilisees ?? 0,
      boostsUtilises: dto.boostsUtilises ?? 0,
      raisonAnnulation: dto.raisonAnnulation ?? null,
      dateCreation: new Date(),
      dateModification: null,
      geler: 0,
      idusrcreation: idUsrConnecte,
      utilisateur: { id: dto.utilisateur_id_usr } as UtilisateurEntity,
      plan: { id: dto.plan_id_pab } as PlanAbonnementEntity,
    });

    const saved = await this.abonnementRepository.save(abonnement);

    return {
      success: true,
      message: 'Abonnement créé avec succès',
      data: this.formaterAbonnement(saved, plan),
    };
  }

  async activerAdmin(id: number, idUsrConnecte: number) {
    const abonnement = await this.abonnementRepository.findOne({
      where: { id, geler: 0 },
      relations: ['plan', 'utilisateur'],
    });
    if (!abonnement) throw new NotFoundException('Abonnement introuvable');

    abonnement.statut = 'actif';
    abonnement.dateModification = new Date();
    await this.abonnementRepository.save(abonnement);

    return { success: true, message: 'Abonnement activé' };
  }

  async annulerAdmin(id: number, idUsrConnecte: number) {
    const abonnement = await this.abonnementRepository.findOne({
      where: { id, geler: 0 },
    });
    if (!abonnement) throw new NotFoundException('Abonnement introuvable');

    abonnement.statut = 'annule';
    abonnement.dateAnnulation = new Date();
    abonnement.raisonAnnulation = "Annulation par l'administrateur";
    abonnement.autoRenouvellement = 0;
    abonnement.dateModification = new Date();
    await this.abonnementRepository.save(abonnement);

    return { success: true, message: 'Abonnement annulé' };
  }

  async supprimerAdmin(id: number, idUsrConnecte: number) {
    const abonnement = await this.abonnementRepository.findOne({
      where: { id },
    });
    if (!abonnement) throw new NotFoundException('Abonnement introuvable');

    abonnement.geler = 1;
    abonnement.dateModification = new Date();
    await this.abonnementRepository.save(abonnement);

    return { success: true, message: 'Abonnement supprimé' };
  }

  // =========================================================================
  // MÉTHODES INTERNES
  // =========================================================================

  private async getAbonnementActif(
    idUsrConnecte: number,
  ): Promise<AbonnementEntity | null> {
    const maintenant = new Date();

    const abonnement = await this.abonnementRepository.findOne({
      where: [
        {
          utilisateur: { id: idUsrConnecte },
          statut: 'actif',
          dateFin: null,
          geler: 0,
        },
        {
          utilisateur: { id: idUsrConnecte },
          statut: 'actif',
          dateFin: MoreThanOrEqual(maintenant) as any,
          geler: 0,
        },
      ],
      relations: ['plan', 'utilisateur'],
      order: { dateCreation: 'DESC' },
    });

    return abonnement;
  }

  private async genererReferenceAbonnement(): Promise<string> {
    const annee = new Date().getFullYear();
    const count = await this.abonnementRepository.count();
    const numero = (count + 1).toString().padStart(6, '0');
    return `ABN-${annee}-${numero}`;
  }

  private async genererReferenceTransaction(): Promise<string> {
    const annee = new Date().getFullYear();
    const count = await this.transactionRepository.count();
    const numero = (count + 1).toString().padStart(6, '0');
    return `TRX-${annee}-${numero}`;
  }

  private formaterPlan(plan: PlanAbonnementEntity) {
    return {
      id: plan.id,
      code: plan.code,
      nom: plan.nom,
      description: plan.description,
      prix: plan.prix,
      devise: plan.devise,
      typeFacturation: plan.typeFacturation,
      avantages: {
        nbAnnoncesMax: plan.nbAnnoncesMax,
        videoAutorisee: plan.videoAutorisee === 1,
        badgeActif: plan.badgeActif === 1,
        nbPhotosMax: plan.nbPhotosMax,
      },
      affichage: {
        ordre: plan.ordre,
        populaire: plan.populaire === 1,
        couleur: plan.couleur,
      },
    };
  }

  private formaterAbonnement(
    abonnement: AbonnementEntity,
    plan: PlanAbonnementEntity | undefined,
  ) {
    return {
      id: abonnement.id,
      reference: abonnement.reference,
      typeFacturation: abonnement.typeFacturation,
      dateDebut: abonnement.dateDebut,
      dateFin: abonnement.dateFin,
      dateProchainPaiement: abonnement.dateProchainPaiement,
      montantPaye: abonnement.montantPaye,
      devise: abonnement.devise,
      statut: abonnement.statut,
      autoRenouvellement: abonnement.autoRenouvellement === 1,
      dateAnnulation: abonnement.dateAnnulation,
      raisonAnnulation: abonnement.raisonAnnulation,
      compteurs: {
        annoncesUtilisees: abonnement.annoncesUtilisees,
        boostsUtilises: abonnement.boostsUtilises,
      },
      plan: plan ? this.formaterPlan(plan) : null,
      utilisateur: abonnement.utilisateur
        ? {
            id: abonnement.utilisateur.id,
            prenom: abonnement.utilisateur.prenom,
            nom: abonnement.utilisateur.nom,
            contact: abonnement.utilisateur.contact,
            email: abonnement.utilisateur.email,
          }
        : null,
      dateCreation: abonnement.dateCreation,
    };
  }

  async simulerPaiement(transactionId: number) {
    console.log(
      `🧪 [SIMULATION] Paiement simulé pour transaction #${transactionId}`,
    );

    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction introuvable');
    }

    if (transaction.statut === 'validee') {
      return {
        success: true,
        message: 'Cette transaction est déjà validée',
      };
    }

    transaction.statut = 'validee';
    transaction.dateValidation = new Date();
    transaction.methodePaiement = 'wave_simulation';
    transaction.referenceOperateur = `SIM-${Date.now()}`;
    await this.transactionRepository.save(transaction);

    if (transaction.metadata) {
      try {
        const metadata = JSON.parse(transaction.metadata);

        if (metadata.abonnementId) {
          const abonnement = await this.abonnementRepository.findOne({
            where: { id: metadata.abonnementId },
          });

          if (abonnement) {
            abonnement.statut = 'actif';
            abonnement.dateModification = new Date();
            await this.abonnementRepository.save(abonnement);
          }
        }
      } catch (error) {
        console.error(
          '❌ [SIMULATION] Erreur activation abonnement:',
          error,
        );
      }
    }

    return {
      success: true,
      message: 'Paiement simulé avec succès (mode test)',
      data: {
        transactionId: transaction.id,
        reference: transaction.reference,
        statut: transaction.statut,
        dateValidation: transaction.dateValidation,
      },
    };
  }
}


// import {
//   Injectable,
//   NotFoundException,
//   BadRequestException,
//   ConflictException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, MoreThanOrEqual } from 'typeorm';

// import { AbonnementEntity } from '../../database/abonnement/abonnement.entity';
// import { PlanAbonnementEntity } from '../../database/plan_abonnement/plan_abonnement.entity';
// import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
// import { TransactionEntity } from '../../database/transaction/transaction.entity';

// /**
//  * Service métier pour la gestion des abonnements.
//  */
// @Injectable()
// export class AbonnementMetierService {
//   constructor(
//     @InjectRepository(AbonnementEntity)
//     private readonly abonnementRepository: Repository<AbonnementEntity>,

//     @InjectRepository(PlanAbonnementEntity)
//     private readonly planRepository: Repository<PlanAbonnementEntity>,

//     @InjectRepository(UtilisateurEntity)
//     private readonly utilisateurRepository: Repository<UtilisateurEntity>,

//     @InjectRepository(TransactionEntity)
//     private readonly transactionRepository: Repository<TransactionEntity>,
//   ) {}

//   // =========================================================================
//   // LISTE DES PLANS
//   // =========================================================================

//   async getPlans() {
//     const plans = await this.planRepository.find({
//       where: { actif: 1, geler: 0 },
//       order: { ordre: 'ASC' },
//     });

//     return {
//       success: true,
//       count: plans.length,
//       data: plans.map((plan) => this.formaterPlan(plan)),
//     };
//   }

//   async getPlanByCode(code: string) {
//     const plan = await this.planRepository.findOne({
//       where: { code, actif: 1, geler: 0 },
//     });

//     if (!plan) {
//       throw new NotFoundException(`Plan '${code}' introuvable`);
//     }

//     return plan;
//   }

//   // =========================================================================
//   // SOUSCRIPTION
//   // =========================================================================

//   async souscrire(codePlan: string, idUsrConnecte: number) {
//     const utilisateur = await this.utilisateurRepository.findOne({
//       where: { id: idUsrConnecte },
//     });

//     if (!utilisateur) {
//       throw new NotFoundException('Utilisateur introuvable');
//     }

//     // 1️⃣ Vérifier l'abonnement actif
//     const abonnementActif = await this.getAbonnementActif(idUsrConnecte);

//     if (abonnementActif) {
//       const planActif = await this.planRepository.findOne({
//         where: {
//           id: (abonnementActif as any).plan?.id,
//         },
//       });

//       const estGratuit =
//         planActif?.prix === 0 || planActif?.code === 'gratuit';

//       if (estGratuit) {
//         console.log(
//           `✅ [Abonnement] Remplacement du plan GRATUIT (user ${idUsrConnecte})`,
//         );

//         abonnementActif.statut = 'annule';
//         abonnementActif.dateAnnulation = new Date();
//         abonnementActif.raisonAnnulation =
//           'Remplacé automatiquement par un abonnement payant';
//         abonnementActif.autoRenouvellement = 0;
//         abonnementActif.dateModification = new Date();

//         await this.abonnementRepository.save(abonnementActif);
//       } else {
//         throw new ConflictException(
//           "Vous avez déjà un abonnement payant actif. Annulez-le avant d'en souscrire un nouveau.",
//         );
//       }
//     }

//     // 2️⃣ Récupérer le plan demandé
//     const plan = await this.getPlanByCode(codePlan);

//     const dateDebut = new Date();
//     let dateFin: Date | null = null;
//     let dateProchainPaiement: Date | null = null;

//     if (plan.typeFacturation === 'mensuel') {
//       dateFin = new Date(dateDebut);
//       dateFin.setMonth(dateFin.getMonth() + 1);
//       dateProchainPaiement = new Date(dateFin);
//     }

//     if (
//       plan.typeFacturation === 'annuelle' ||
//       plan.typeFacturation === 'annuel' ||
//       plan.code === 'a_vie'
//     ) {
//       dateFin = new Date(dateDebut);
//       dateFin.setFullYear(dateFin.getFullYear() + 1);
//       dateProchainPaiement = new Date(dateFin);
//     }

//     const reference = await this.genererReferenceAbonnement();

//     const abonnement = this.abonnementRepository.create({
//       reference,
//       typeFacturation: plan.typeFacturation,
//       dateDebut,
//       dateFin,
//       dateProchainPaiement,
//       montantPaye: plan.prix,
//       devise: plan.devise,
//       statut: plan.prix === 0 ? 'actif' : 'en_attente',
//       autoRenouvellement:
//         plan.typeFacturation === 'mensuel' ||
//         plan.typeFacturation === 'annuelle' ||
//         plan.typeFacturation === 'annuel' ||
//         plan.code === 'a_vie'
//           ? 1
//           : 0,
//       annoncesUtilisees: 0,
//       boostsUtilises: 0,
//       dateCreation: new Date(),
//       dateModification: null,
//       geler: 0,
//       idusrcreation: idUsrConnecte,
//       utilisateur: { id: idUsrConnecte } as UtilisateurEntity,
//       plan: { id: plan.id } as PlanAbonnementEntity,
//     });

//     const abonnementSaved = await this.abonnementRepository.save(abonnement);

//     // 3️⃣ Plan gratuit
//     if (plan.prix === 0) {
//       return {
//         success: true,
//         message: 'Abonnement gratuit activé',
//         abonnement: this.formaterAbonnement(abonnementSaved, plan),
//         besoinPaiement: false,
//       };
//     }

//     // 4️⃣ Plan payant → créer transaction
//     const referenceTransaction = await this.genererReferenceTransaction();

//     const transaction = this.transactionRepository.create({
//       reference: referenceTransaction,
//       type: 'abonnement',
//       montant: plan.prix,
//       devise: plan.devise,
//       montantCommission: 0,
//       pourcentageCommission: 0,
//       montantNet: plan.prix,
//       statut: 'en_attente',
//       methodePaiement: null,
//       referenceExterne: null,
//       referenceOperateur: null,
//       description: `Souscription abonnement ${plan.nom}`,
//       metadata: JSON.stringify({
//         abonnementId: abonnementSaved.id,
//         planCode: plan.code,
//       }),
//       erreur: null,
//       dateCreation: new Date(),
//       dateValidation: null,
//       dateRemboursement: null,
//       geler: 0,
//       idusrcreation: idUsrConnecte,
//       utilisateur: { id: idUsrConnecte } as UtilisateurEntity,
//       beneficiaire: null,
//       reservation: null,
//     });

//     const transactionSaved = await this.transactionRepository.save(transaction);

//     return {
//       success: true,
//       message: 'Abonnement créé. Veuillez procéder au paiement.',
//       abonnement: this.formaterAbonnement(abonnementSaved, plan),
//       besoinPaiement: true,
//       transaction: {
//         id: transactionSaved.id,
//         reference: transactionSaved.reference,
//         montant: transactionSaved.montant,
//         devise: transactionSaved.devise,
//       },
//     };
//   }

//   // =========================================================================
//   // CONSULTATION
//   // =========================================================================

//   async getMonAbonnement(idUsrConnecte: number) {
//     const abonnement = await this.getAbonnementActif(idUsrConnecte);

//     if (!abonnement) {
//       return {
//         success: true,
//         data: null,
//         message: 'Aucun abonnement actif',
//       };
//     }

//     return {
//       success: true,
//       data: this.formaterAbonnement(abonnement, abonnement.plan),
//     };
//   }

//   async getHistorique(idUsrConnecte: number) {
//     const abonnements = await this.abonnementRepository.find({
//       where: { utilisateur: { id: idUsrConnecte }, geler: 0 },
//       relations: ['plan'],
//       order: { dateCreation: 'DESC' },
//     });

//     return {
//       success: true,
//       count: abonnements.length,
//       data: abonnements.map((a) => this.formaterAbonnement(a, a.plan)),
//     };
//   }

//   // =========================================================================
//   // ANNULATION (utilisateur)
//   // =========================================================================

//   async annuler(raison: string | undefined, idUsrConnecte: number) {
//     const abonnement = await this.getAbonnementActif(idUsrConnecte);

//     if (!abonnement) {
//       throw new NotFoundException('Aucun abonnement actif à annuler');
//     }

//     const estAnnuel =
//       abonnement.typeFacturation === 'a_vie' ||
//       abonnement.typeFacturation === 'annuelle' ||
//       abonnement.typeFacturation === 'annuel';

//     if (estAnnuel) {
//       abonnement.statut = 'annule';
//       abonnement.dateAnnulation = new Date();
//       abonnement.raisonAnnulation =
//         raison ?? "Annulation par l'utilisateur";
//       abonnement.autoRenouvellement = 0;
//       abonnement.dateModification = new Date();

//       await this.abonnementRepository.save(abonnement);

//       return {
//         success: true,
//         message:
//           "Abonnement annulé. Il restera actif jusqu'à sa date d'expiration.",
//       };
//     }

//     abonnement.statut = 'annule';
//     abonnement.dateAnnulation = new Date();
//     abonnement.raisonAnnulation = raison ?? "Annulation par l'utilisateur";
//     abonnement.autoRenouvellement = 0;
//     abonnement.dateModification = new Date();

//     await this.abonnementRepository.save(abonnement);

//     return {
//       success: true,
//       message: 'Abonnement annulé avec succès',
//     };
//   }

//   // =========================================================================
//   // ✅ ROUTES ADMIN
//   // =========================================================================

//   /**
//    * Liste des abonnements avec filtres de périodicité (vue admin).
//    */
//   async listeAdmin(filtres: {
//     periodicite?: string;
//     dateJour?: string;
//     dateDebut?: string;
//     dateFin?: string;
//     semaine?: number;
//     mois?: number;
//     annee?: number;
//   }) {
//     const qb = this.abonnementRepository
//       .createQueryBuilder('a')
//       .leftJoinAndSelect('a.plan', 'plan')
//       .leftJoinAndSelect('a.utilisateur', 'utilisateur')
//       .where('a.geler = :geler', { geler: 0 });

//     if (filtres.periodicite === 'jour' && filtres.dateJour) {
//       qb.andWhere('DATE(a.dateCreation) = :dateJour', {
//         dateJour: filtres.dateJour,
//       });
//     } else if (
//       filtres.periodicite === 'semaine' &&
//       filtres.dateDebut &&
//       filtres.dateFin
//     ) {
//       qb.andWhere('DATE(a.dateCreation) BETWEEN :dateDebut AND :dateFin', {
//         dateDebut: filtres.dateDebut,
//         dateFin: filtres.dateFin,
//       });
//     } else if (
//       filtres.periodicite === 'mois' &&
//       filtres.mois &&
//       filtres.annee
//     ) {
//       qb.andWhere(
//         'MONTH(a.dateCreation) = :mois AND YEAR(a.dateCreation) = :annee',
//         { mois: filtres.mois, annee: filtres.annee },
//       );
//     } else if (filtres.periodicite === 'annee' && filtres.annee) {
//       qb.andWhere('YEAR(a.dateCreation) = :annee', { annee: filtres.annee });
//     }

//     qb.orderBy('a.dateCreation', 'DESC');

//     const abonnements = await qb.getMany();

//     return {
//       success: true,
//       count: abonnements.length,
//       data: abonnements.map((a) => this.formaterAbonnement(a, a.plan)),
//     };
//   }

//   // =========================================================================
//   // ✅ STATISTIQUES DASHBOARD
//   // =========================================================================

//   /**
//    * Retourne les statistiques globales des abonnements pour le dashboard.
//    * Accepte une plage de dates optionnelle.
//    */
//   async getStatsDashboard(dateDebut?: string, dateFin?: string) {
//     const qb = this.abonnementRepository
//       .createQueryBuilder('a')
//       .where('a.geler = :geler', { geler: 0 });

//     // Filtres date optionnels
//     if (dateDebut) {
//       qb.andWhere('DATE(a.dateCreation) >= :dateDebut', { dateDebut });
//     }
//     if (dateFin) {
//       qb.andWhere('DATE(a.dateCreation) <= :dateFin', { dateFin });
//     }

//     const abonnements = await qb.getMany();

//     // Compteurs
//     const total = abonnements.length;
//     const actifs = abonnements.filter((a) => a.statut === 'actif').length;
//     const enAttente = abonnements.filter((a) => a.statut === 'en_attente').length;
//     const expires = abonnements.filter((a) => a.statut === 'expire').length;
//     const annules = abonnements.filter((a) => a.statut === 'annule').length;

//     // Montant total encaissé (uniquement abonnements actifs)
//     const montantTotal = abonnements
//       .filter((a) => a.statut === 'actif')
//       .reduce((sum, a) => sum + (Number(a.montantPaye) || 0), 0);

//     // Montant du mois en cours (uniquement abonnements actifs)
//     const maintenant = new Date();
//     const debutMois = new Date(
//       maintenant.getFullYear(),
//       maintenant.getMonth(),
//       1,
//     );
//     const finMois = new Date(
//       maintenant.getFullYear(),
//       maintenant.getMonth() + 1,
//       0,
//       23,
//       59,
//       59,
//     );

//     const montantMois = abonnements
//       .filter((a) => {
//         if (a.statut !== 'actif') return false;
//         const d = new Date(a.dateDebut);
//         return d >= debutMois && d <= finMois;
//       })
//       .reduce((sum, a) => sum + (Number(a.montantPaye) || 0), 0);

//     // Taux d'activation
//     const tauxActivation = total > 0 ? Math.round((actifs / total) * 100) : 0;

//     return {
//       success: true,
//       data: {
//         total,
//         actifs,
//         enAttente,
//         expires,
//         annules,
//         montantTotal,
//         montantMois,
//         tauxActivation,
//       },
//     };
//   }

//   /**
//    * Création manuelle d'un abonnement par l'admin.
//    */
//   async creerAdmin(dto: any, idUsrConnecte: number) {
//     const utilisateur = await this.utilisateurRepository.findOne({
//       where: { id: dto.utilisateur_id_usr },
//     });
//     if (!utilisateur) throw new NotFoundException('Utilisateur introuvable');

//     const plan = await this.planRepository.findOne({
//       where: { id: dto.plan_id_pab },
//     });
//     if (!plan) throw new NotFoundException('Plan introuvable');

//     const reference = await this.genererReferenceAbonnement();

//     const abonnement = this.abonnementRepository.create({
//       reference,
//       typeFacturation: dto.typeFacturation ?? plan.typeFacturation,
//       dateDebut: dto.dateDebut ? new Date(dto.dateDebut) : new Date(),
//       dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
//       dateProchainPaiement: dto.dateProchainPaiement
//         ? new Date(dto.dateProchainPaiement)
//         : null,
//       montantPaye: dto.montantPaye ?? plan.prix,
//       devise: dto.devise ?? plan.devise,
//       statut: dto.statut ?? 'en_attente',
//       autoRenouvellement: dto.autoRenouvellement ?? 0,
//       annoncesUtilisees: dto.annoncesUtilisees ?? 0,
//       boostsUtilises: dto.boostsUtilises ?? 0,
//       raisonAnnulation: dto.raisonAnnulation ?? null,
//       dateCreation: new Date(),
//       dateModification: null,
//       geler: 0,
//       idusrcreation: idUsrConnecte,
//       utilisateur: { id: dto.utilisateur_id_usr } as UtilisateurEntity,
//       plan: { id: dto.plan_id_pab } as PlanAbonnementEntity,
//     });

//     const saved = await this.abonnementRepository.save(abonnement);

//     return {
//       success: true,
//       message: 'Abonnement créé avec succès',
//       data: this.formaterAbonnement(saved, plan),
//     };
//   }

//   /**
//    * Active un abonnement (statut → actif).
//    */
//   async activerAdmin(id: number, idUsrConnecte: number) {
//     const abonnement = await this.abonnementRepository.findOne({
//       where: { id, geler: 0 },
//       relations: ['plan', 'utilisateur'],
//     });
//     if (!abonnement) throw new NotFoundException('Abonnement introuvable');

//     abonnement.statut = 'actif';
//     abonnement.dateModification = new Date();
//     await this.abonnementRepository.save(abonnement);

//     return { success: true, message: 'Abonnement activé' };
//   }

//   /**
//    * Annule un abonnement (admin).
//    */
//   async annulerAdmin(id: number, idUsrConnecte: number) {
//     const abonnement = await this.abonnementRepository.findOne({
//       where: { id, geler: 0 },
//     });
//     if (!abonnement) throw new NotFoundException('Abonnement introuvable');

//     abonnement.statut = 'annule';
//     abonnement.dateAnnulation = new Date();
//     abonnement.raisonAnnulation = "Annulation par l'administrateur";
//     abonnement.autoRenouvellement = 0;
//     abonnement.dateModification = new Date();
//     await this.abonnementRepository.save(abonnement);

//     return { success: true, message: 'Abonnement annulé' };
//   }

//   /**
//    * Supprime (soft delete) un abonnement.
//    */
//   async supprimerAdmin(id: number, idUsrConnecte: number) {
//     const abonnement = await this.abonnementRepository.findOne({
//       where: { id },
//     });
//     if (!abonnement) throw new NotFoundException('Abonnement introuvable');

//     abonnement.geler = 1;
//     abonnement.dateModification = new Date();
//     await this.abonnementRepository.save(abonnement);

//     return { success: true, message: 'Abonnement supprimé' };
//   }

//   // =========================================================================
//   // MÉTHODES INTERNES
//   // =========================================================================

//   private async getAbonnementActif(
//     idUsrConnecte: number,
//   ): Promise<AbonnementEntity | null> {
//     const maintenant = new Date();

//     const abonnement = await this.abonnementRepository.findOne({
//       where: [
//         {
//           utilisateur: { id: idUsrConnecte },
//           statut: 'actif',
//           dateFin: null,
//           geler: 0,
//         },
//         {
//           utilisateur: { id: idUsrConnecte },
//           statut: 'actif',
//           dateFin: MoreThanOrEqual(maintenant) as any,
//           geler: 0,
//         },
//       ],
//       relations: ['plan', 'utilisateur'],
//       order: { dateCreation: 'DESC' },
//     });

//     return abonnement;
//   }

//   private async genererReferenceAbonnement(): Promise<string> {
//     const annee = new Date().getFullYear();
//     const count = await this.abonnementRepository.count();
//     const numero = (count + 1).toString().padStart(6, '0');
//     return `ABN-${annee}-${numero}`;
//   }

//   private async genererReferenceTransaction(): Promise<string> {
//     const annee = new Date().getFullYear();
//     const count = await this.transactionRepository.count();
//     const numero = (count + 1).toString().padStart(6, '0');
//     return `TRX-${annee}-${numero}`;
//   }

//   // =========================================================================
//   // FORMATAGE
//   // =========================================================================

//   private formaterPlan(plan: PlanAbonnementEntity) {
//     return {
//       id: plan.id,
//       code: plan.code,
//       nom: plan.nom,
//       description: plan.description,
//       prix: plan.prix,
//       devise: plan.devise,
//       typeFacturation: plan.typeFacturation,
//       avantages: {
//         nbAnnoncesMax: plan.nbAnnoncesMax,
//         videoAutorisee: plan.videoAutorisee === 1,
//         badgeActif: plan.badgeActif === 1,
//         nbPhotosMax: plan.nbPhotosMax,
//       },
//       affichage: {
//         ordre: plan.ordre,
//         populaire: plan.populaire === 1,
//         couleur: plan.couleur,
//       },
//     };
//   }

//   private formaterAbonnement(
//     abonnement: AbonnementEntity,
//     plan: PlanAbonnementEntity | undefined,
//   ) {
//     return {
//       id: abonnement.id,
//       reference: abonnement.reference,
//       typeFacturation: abonnement.typeFacturation,
//       dateDebut: abonnement.dateDebut,
//       dateFin: abonnement.dateFin,
//       dateProchainPaiement: abonnement.dateProchainPaiement,
//       montantPaye: abonnement.montantPaye,
//       devise: abonnement.devise,
//       statut: abonnement.statut,
//       autoRenouvellement: abonnement.autoRenouvellement === 1,
//       dateAnnulation: abonnement.dateAnnulation,
//       raisonAnnulation: abonnement.raisonAnnulation,
//       compteurs: {
//         annoncesUtilisees: abonnement.annoncesUtilisees,
//         boostsUtilises: abonnement.boostsUtilises,
//       },
//       plan: plan ? this.formaterPlan(plan) : null,
//       utilisateur: abonnement.utilisateur
//         ? {
//             id: abonnement.utilisateur.id,
//             prenom: abonnement.utilisateur.prenom,
//             nom: abonnement.utilisateur.nom,
//             contact: abonnement.utilisateur.contact,
//             email: abonnement.utilisateur.email,
//           }
//         : null,
//       dateCreation: abonnement.dateCreation,
//     };
//   }

//   // =========================================================================
//   // ⚠️ MÉTHODE DE TEST - SIMULATION DE PAIEMENT
//   // À SUPPRIMER EN PRODUCTION
//   // =========================================================================

//   async simulerPaiement(transactionId: number) {
//     console.log(
//       `🧪 [SIMULATION] Paiement simulé pour transaction #${transactionId}`,
//     );

//     const transaction = await this.transactionRepository.findOne({
//       where: { id: transactionId },
//     });

//     if (!transaction) {
//       throw new NotFoundException('Transaction introuvable');
//     }

//     if (transaction.statut === 'validee') {
//       return {
//         success: true,
//         message: 'Cette transaction est déjà validée',
//       };
//     }

//     transaction.statut = 'validee';
//     transaction.dateValidation = new Date();
//     transaction.methodePaiement = 'wave_simulation';
//     transaction.referenceOperateur = `SIM-${Date.now()}`;
//     await this.transactionRepository.save(transaction);

//     console.log(
//       `✅ [SIMULATION] Transaction #${transactionId} marquée comme validée`,
//     );

//     if (transaction.metadata) {
//       try {
//         const metadata = JSON.parse(transaction.metadata);

//         if (metadata.abonnementId) {
//           const abonnement = await this.abonnementRepository.findOne({
//             where: { id: metadata.abonnementId },
//           });

//           if (abonnement) {
//             abonnement.statut = 'actif';
//             abonnement.dateModification = new Date();
//             await this.abonnementRepository.save(abonnement);

//             console.log(
//               `✅ [SIMULATION] Abonnement #${abonnement.id} activé`,
//             );
//           }
//         }
//       } catch (error) {
//         console.error(
//           '❌ [SIMULATION] Erreur activation abonnement:',
//           error,
//         );
//       }
//     }

//     return {
//       success: true,
//       message: 'Paiement simulé avec succès (mode test)',
//       data: {
//         transactionId: transaction.id,
//         reference: transaction.reference,
//         statut: transaction.statut,
//         dateValidation: transaction.dateValidation,
//       },
//     };
//   }
// }