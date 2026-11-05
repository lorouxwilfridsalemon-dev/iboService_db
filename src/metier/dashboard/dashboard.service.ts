
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { AnnonceEntity } from '../../database/annonce/annonce.entity';
import { ReservationEntity } from '../../database/reservation/reservation.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { CategoriesEntity } from '../../database/categories/categories.entity';

@Injectable()
export class DashboardMetierService {
  constructor(
    @InjectRepository(AnnonceEntity)
    private readonly annonceRepository: Repository<AnnonceEntity>,

    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,

    @InjectRepository(UtilisateurEntity)
    private readonly utilisateurRepository: Repository<UtilisateurEntity>,

    @InjectRepository(CategoriesEntity)
    private readonly categoriesRepository: Repository<CategoriesEntity>,
  ) {}

  /**
   * GET /metier/dashboard/annonces-periodicite
   * ✅ Nombre d'annonces publiées : aujourd'hui, cette semaine, ce
   * mois-ci, cette année — et le total général.
   */
  async annoncesParPeriodicite() {
    const maintenant = new Date();

    const debutJour = new Date(maintenant);    
    debutJour.setHours(0, 0, 0, 0);

    const debutSemaine = new Date(maintenant);
    const jourSemaine = debutSemaine.getDay(); // 0 = dimanche
    const decalage = jourSemaine === 0 ? 6 : jourSemaine - 1; // lundi = début de semaine
    debutSemaine.setDate(debutSemaine.getDate() - decalage);
    debutSemaine.setHours(0, 0, 0, 0);

    const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
    const debutAnnee = new Date(maintenant.getFullYear(), 0, 1);

    const [jour, semaine, mois, annee, total] = await Promise.all([
      this.annonceRepository.count({ where: { geler: 0, dateCreation: MoreThanOrEqual(debutJour) } as any }),
      this.annonceRepository.count({ where: { geler: 0, dateCreation: MoreThanOrEqual(debutSemaine) } as any }),
      this.annonceRepository.count({ where: { geler: 0, dateCreation: MoreThanOrEqual(debutMois) } as any }),
      this.annonceRepository.count({ where: { geler: 0, dateCreation: MoreThanOrEqual(debutAnnee) } as any }),
      this.annonceRepository.count({ where: { geler: 0 } as any }),
    ]);

    return {
      etat: 'succes',
      message: 'Statistiques de périodicité récupérées',
      data: { jour, semaine, mois, annee, total },
    };
  }

  /**
   * GET /metier/dashboard/annonces-tendance
   * ✅ Évolution du nombre d'annonces publiées sur les 12 derniers mois
   * — utile pour un graphique de tendance.
   */
  async annoncesTendance12Mois() {
    const maintenant = new Date();
    const mois: { libelle: string; nombre: number }[] = [];

    const nomsMois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

    for (let i = 11; i >= 0; i--) {
      const debut = new Date(maintenant.getFullYear(), maintenant.getMonth() - i, 1);
      const fin = new Date(maintenant.getFullYear(), maintenant.getMonth() - i + 1, 1);

      const nombre = await this.annonceRepository
        .createQueryBuilder('annonce')
        .where('annonce.geler = 0')
        .andWhere('annonce.dateCreation >= :debut', { debut })
        .andWhere('annonce.dateCreation < :fin', { fin })
        .getCount();

      mois.push({ libelle: `${nomsMois[debut.getMonth()]} ${debut.getFullYear()}`, nombre });
    }

    return {
      etat: 'succes',
      message: 'Tendance sur 12 mois récupérée',
      data: mois,
    };
  }

  /**
   * GET /metier/dashboard/vue-ensemble
   * ✅ ENRICHI : accepte maintenant une plage de dates optionnelle
   * (dateDebut, dateFin) — filtre TOUS les indicateurs (annonces,
   * réservations, utilisateurs) sur leur date de création, pour
   * permettre une recherche "combien d'annonces validées/en attente,
   * de réservations, d'utilisateurs sur telle période". Sans dates
   * fournies, comportement inchangé (toutes les données, tout temps).
   */
  async vueEnsemble(dateDebut?: Date, dateFin?: Date) {
    // ✅ Construit la clause de date une seule fois, réutilisée pour les
    // 3 entités (même colonne 'dateCreation' partout).
    const clauseDate = (alias: string) => {
      if (dateDebut && dateFin) {
        return `${alias}.dateCreation BETWEEN :dateDebut AND :dateFin`;
      }
      if (dateDebut) {
        return `${alias}.dateCreation >= :dateDebut`;
      }
      if (dateFin) {
        return `${alias}.dateCreation <= :dateFin`;
      }
      return null;
    };
    const parametresDate = { dateDebut, dateFin };

    const compterAnnonces = (statut?: string) => {
      const qb = this.annonceRepository.createQueryBuilder('annonce').where('annonce.geler = 0');
      if (statut) qb.andWhere('annonce.statut = :statut', { statut });
      const clause = clauseDate('annonce');
      if (clause) qb.andWhere(clause, parametresDate);
      return qb.getCount();
    };

    const compterUtilisateurs = (geler: number) => {
      const qb = this.utilisateurRepository.createQueryBuilder('utilisateur').where('utilisateur.geler = :geler', { geler });
      const clause = clauseDate('utilisateur');
      if (clause) qb.andWhere(clause, parametresDate);
      return qb.getCount();
    };

    const compterReservations = (statut?: string) => {
      const qb = this.reservationRepository.createQueryBuilder('reservation');
      if (statut) qb.andWhere('reservation.statut = :statut', { statut });
      const clause = clauseDate('reservation');
      if (clause) qb.andWhere(clause, parametresDate);
      return qb.getCount();
    };

    const [
      totalAnnonces,
      annoncesActives,
      annoncesEnAttente,
      annoncesRefusees,
      utilisateursActifs,
      utilisateursInactifs,
      totalReservations,
      reservationsEnAttente,
      reservationsConfirmees,
      reservationsAnnulees,
    ] = await Promise.all([
      compterAnnonces(),
      compterAnnonces('Actives'),
      compterAnnonces('En attente'),
      compterAnnonces('Réfusées'),
      compterUtilisateurs(0),
      compterUtilisateurs(1),
      compterReservations(),
      compterReservations('en_attente'),
      compterReservations('confirmee'),
      compterReservations('annulee'),
    ]);
    const totalUtilisateurs = utilisateursActifs + utilisateursInactifs;

    // ✅ Montant total des réservations confirmées — même filtre de date.
    const montantQb = this.reservationRepository
      .createQueryBuilder('reservation')
      .select('SUM(reservation.montant_total)', 'total')
      .where('reservation.statut = :statut', { statut: 'confirmee' });
    const clauseMontant = clauseDate('reservation');
    if (clauseMontant) montantQb.andWhere(clauseMontant, parametresDate);
    const montantResult = await montantQb.getRawOne();
    const montantTotalConfirme = Number(montantResult?.total ?? 0);

    // ✅ Répartition des annonces par catégorie — même filtre de date.
    const parCategorieQb = this.annonceRepository
      .createQueryBuilder('annonce')
      .leftJoin('annonce.sousCategorie', 'sousCategorie')
      .leftJoin('sousCategorie.categorie', 'categorie')
      .select('categorie.nom', 'nom')
      .addSelect('COUNT(annonce.id)', 'nombre')
      .where('annonce.geler = 0')
      .andWhere('categorie.id IS NOT NULL')
      .groupBy('categorie.id')
      .addGroupBy('categorie.nom')
      .orderBy('nombre', 'DESC');
    const clauseCategorie = clauseDate('annonce');
    if (clauseCategorie) parCategorieQb.andWhere(clauseCategorie, parametresDate);
    const parCategorieRaw = await parCategorieQb.getRawMany();
    const parCategorie = parCategorieRaw.map((r) => ({ nom: r.nom, nombre: Number(r.nombre) }));

    return {
      etat: 'succes',
      message: 'Vue d\'ensemble récupérée',
      data: {
        periode: {
          dateDebut: dateDebut ?? null,
          dateFin: dateFin ?? null,
        },
        annonces: {
          total: totalAnnonces,
          actives: annoncesActives,
          enAttente: annoncesEnAttente,
          refusees: annoncesRefusees,
        },
        utilisateurs: {
          total: totalUtilisateurs,
          actifs: utilisateursActifs,
          inactifs: utilisateursInactifs,
        },
        reservations: {
          total: totalReservations,
          enAttente: reservationsEnAttente,
          confirmees: reservationsConfirmees,
          annulees: reservationsAnnulees,
          montantTotalConfirme,
        },
        parCategorie,
      },
    };
  }

  /**
   * GET /metier/dashboard/mon-tableau-de-bord
   * ✅ AJOUT : tableau de bord PERSONNEL — pour l'app mobile, un
   * propriétaire voit SES annonces, SES réservations reçues, et SES
   * propres réservations (en tant que client). Contrairement à
   * vueEnsemble() (dashboard admin web), tout est filtré sur
   * l'utilisateur connecté.
   */
  async monTableauDeBord(idUsrConnecte: number) {
    const [
      totalAnnonces,
      annoncesActives,
      annoncesEnAttente,
      annoncesRefusees,
      reservationsRecuesTotal,
      reservationsRecuesEnAttente,
      reservationsRecuesConfirmees,
      mesReservationsTotal,
      mesReservationsEnAttente,
      mesReservationsConfirmees,
    ] = await Promise.all([
      this.annonceRepository.count({ where: { geler: 0, utilisateur: { id: idUsrConnecte } } as any }),
      this.annonceRepository.count({ where: { geler: 0, utilisateur: { id: idUsrConnecte }, statut: 'Actives' } as any }),
      this.annonceRepository.count({ where: { geler: 0, utilisateur: { id: idUsrConnecte }, statut: 'En attente' } as any }),
      this.annonceRepository.count({ where: { geler: 0, utilisateur: { id: idUsrConnecte }, statut: 'Réfusées' } as any }),
      this.reservationRepository
        .createQueryBuilder('r')
        .leftJoin('r.annonce', 'a')
        .where('a.id_usr = :id', { id: idUsrConnecte })
        .getCount(),
      this.reservationRepository
        .createQueryBuilder('r')
        .leftJoin('r.annonce', 'a')
        .where('a.id_usr = :id', { id: idUsrConnecte })
        .andWhere('r.statut = :statut', { statut: 'en_attente' })
        .getCount(),
      this.reservationRepository
        .createQueryBuilder('r')
        .leftJoin('r.annonce', 'a')
        .where('a.id_usr = :id', { id: idUsrConnecte })
        .andWhere('r.statut = :statut', { statut: 'confirmee' })
        .getCount(),
      this.reservationRepository.count({ where: { utilisateur: { id: idUsrConnecte } } as any }),
      this.reservationRepository.count({ where: { utilisateur: { id: idUsrConnecte }, statut: 'en_attente' } as any }),
      this.reservationRepository.count({ where: { utilisateur: { id: idUsrConnecte }, statut: 'confirmee' } as any }),
    ]);

    // ✅ Montant total encaissé (réservations reçues confirmées).
    const montantResult = await this.reservationRepository
      .createQueryBuilder('r')
      .leftJoin('r.annonce', 'a')
      .select('SUM(r.montant_total)', 'total')
      .where('a.id_usr = :id', { id: idUsrConnecte })
      .andWhere('r.statut = :statut', { statut: 'confirmee' })
      .getRawOne();
    const montantTotalEncaisse = Number(montantResult?.total ?? 0);

    return {
      etat: 'succes',
      message: 'Tableau de bord récupéré',
      data: {
        annonces: {
          total: totalAnnonces,
          actives: annoncesActives,
          enAttente: annoncesEnAttente,
          refusees: annoncesRefusees,
        },
        reservationsRecues: {
          total: reservationsRecuesTotal,
          enAttente: reservationsRecuesEnAttente,
          confirmees: reservationsRecuesConfirmees,
          montantTotalEncaisse,
        },
        mesReservations: {
          total: mesReservationsTotal,
          enAttente: mesReservationsEnAttente,
          confirmees: mesReservationsConfirmees,
        },
      },
    };
  }
} 



// // import { Injectable, Logger } from '@nestjs/common';
// // import { getManager } from 'typeorm';
// // import { PaiementEntity } from '../../database/paiement/paiement.entity';

// // @Injectable()
// // export class DashboardMetierService {
// //   private readonly logger = new Logger(DashboardMetierService.name);
  
// //   constructor() {}

    
 
// // }

// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { MoreThanOrEqual, Repository } from 'typeorm';
// import { AnnonceEntity } from '../../database/annonce/annonce.entity';
// import { ReservationEntity } from '../../database/reservation/reservation.entity';
// import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
// import { CategoriesEntity } from '../../database/categories/categories.entity';

// @Injectable()
// export class DashboardMetierService {
//   constructor(
//     @InjectRepository(AnnonceEntity)
//     private readonly annonceRepository: Repository<AnnonceEntity>,

//     @InjectRepository(ReservationEntity)
//     private readonly reservationRepository: Repository<ReservationEntity>,

//     @InjectRepository(UtilisateurEntity)
//     private readonly utilisateurRepository: Repository<UtilisateurEntity>,

//     @InjectRepository(CategoriesEntity)
//     private readonly categoriesRepository: Repository<CategoriesEntity>,
//   ) {}

//   /**
//    * GET /metier/dashboard/annonces-periodicite
//    * ✅ Nombre d'annonces publiées : aujourd'hui, cette semaine, ce
//    * mois-ci, cette année — et le total général.
//    */
//   async annoncesParPeriodicite() {
//     const maintenant = new Date();

//     const debutJour = new Date(maintenant);
//     debutJour.setHours(0, 0, 0, 0);

//     const debutSemaine = new Date(maintenant);
//     const jourSemaine = debutSemaine.getDay(); // 0 = dimanche
//     const decalage = jourSemaine === 0 ? 6 : jourSemaine - 1; // lundi = début de semaine
//     debutSemaine.setDate(debutSemaine.getDate() - decalage);
//     debutSemaine.setHours(0, 0, 0, 0);

//     const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
//     const debutAnnee = new Date(maintenant.getFullYear(), 0, 1);

//     const [jour, semaine, mois, annee, total] = await Promise.all([
//       this.annonceRepository.count({ where: { geler: 0, dateCreation: MoreThanOrEqual(debutJour) } as any }),
//       this.annonceRepository.count({ where: { geler: 0, dateCreation: MoreThanOrEqual(debutSemaine) } as any }),
//       this.annonceRepository.count({ where: { geler: 0, dateCreation: MoreThanOrEqual(debutMois) } as any }),
//       this.annonceRepository.count({ where: { geler: 0, dateCreation: MoreThanOrEqual(debutAnnee) } as any }),
//       this.annonceRepository.count({ where: { geler: 0 } as any }),
//     ]);

//     return {
//       etat: 'succes',
//       message: 'Statistiques de périodicité récupérées',
//       data: { jour, semaine, mois, annee, total },
//     };
//   }

//   /**
//    * GET /metier/dashboard/annonces-tendance
//    * ✅ Évolution du nombre d'annonces publiées sur les 12 derniers mois
//    * — utile pour un graphique de tendance.
//    */
//   async annoncesTendance12Mois() {
//     const maintenant = new Date();
//     const mois: { libelle: string; nombre: number }[] = [];

//     const nomsMois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

//     for (let i = 11; i >= 0; i--) {
//       const debut = new Date(maintenant.getFullYear(), maintenant.getMonth() - i, 1);
//       const fin = new Date(maintenant.getFullYear(), maintenant.getMonth() - i + 1, 1);

//       const nombre = await this.annonceRepository
//         .createQueryBuilder('annonce')
//         .where('annonce.geler = 0')
//         .andWhere('annonce.dateCreation >= :debut', { debut })
//         .andWhere('annonce.dateCreation < :fin', { fin })
//         .getCount();

//       mois.push({ libelle: `${nomsMois[debut.getMonth()]} ${debut.getFullYear()}`, nombre });
//     }

//     return {
//       etat: 'succes',
//       message: 'Tendance sur 12 mois récupérée',
//       data: mois,
//     };
//   }

//   /**
//    * GET /metier/dashboard/vue-ensemble
//    * ✅ ENRICHI : accepte maintenant une plage de dates optionnelle
//    * (dateDebut, dateFin) — filtre TOUS les indicateurs (annonces,
//    * réservations, utilisateurs) sur leur date de création, pour
//    * permettre une recherche "combien d'annonces validées/en attente,
//    * de réservations, d'utilisateurs sur telle période". Sans dates
//    * fournies, comportement inchangé (toutes les données, tout temps).
//    */
//   async vueEnsemble(dateDebut?: Date, dateFin?: Date) {
//     // ✅ Construit la clause de date une seule fois, réutilisée pour les
//     // 3 entités (même colonne 'dateCreation' partout).
//     const clauseDate = (alias: string) => {
//       if (dateDebut && dateFin) {
//         return `${alias}.dateCreation BETWEEN :dateDebut AND :dateFin`;
//       }
//       if (dateDebut) {
//         return `${alias}.dateCreation >= :dateDebut`;
//       }
//       if (dateFin) {
//         return `${alias}.dateCreation <= :dateFin`;
//       }
//       return null;
//     };
//     const parametresDate = { dateDebut, dateFin };

//     const compterAnnonces = (statut?: string) => {
//       const qb = this.annonceRepository.createQueryBuilder('annonce').where('annonce.geler = 0');
//       if (statut) qb.andWhere('annonce.statut = :statut', { statut });
//       const clause = clauseDate('annonce');
//       if (clause) qb.andWhere(clause, parametresDate);
//       return qb.getCount();
//     };

//     const compterUtilisateurs = (geler: number) => {
//       const qb = this.utilisateurRepository.createQueryBuilder('utilisateur').where('utilisateur.geler = :geler', { geler });
//       const clause = clauseDate('utilisateur');
//       if (clause) qb.andWhere(clause, parametresDate);
//       return qb.getCount();
//     };

//     const compterReservations = (statut?: string) => {
//       const qb = this.reservationRepository.createQueryBuilder('reservation');
//       if (statut) qb.andWhere('reservation.statut = :statut', { statut });
//       const clause = clauseDate('reservation');
//       if (clause) qb.andWhere(clause, parametresDate);
//       return qb.getCount();
//     };

//     const [
//       totalAnnonces,
//       annoncesActives,
//       annoncesEnAttente,
//       annoncesRefusees,
//       utilisateursActifs,
//       utilisateursInactifs,
//       totalReservations,
//       reservationsEnAttente,
//       reservationsConfirmees,
//       reservationsAnnulees,
//     ] = await Promise.all([
//       compterAnnonces(),
//       compterAnnonces('Actives'),
//       compterAnnonces('En attente'),
//       compterAnnonces('Réfusées'),
//       compterUtilisateurs(0),
//       compterUtilisateurs(1),
//       compterReservations(),
//       compterReservations('en_attente'),
//       compterReservations('confirmee'),
//       compterReservations('annulee'),
//     ]);
//     const totalUtilisateurs = utilisateursActifs + utilisateursInactifs;

//     // ✅ Montant total des réservations confirmées — même filtre de date.
//     const montantQb = this.reservationRepository
//       .createQueryBuilder('reservation')
//       .select('SUM(reservation.montant_total)', 'total')
//       .where('reservation.statut = :statut', { statut: 'confirmee' });
//     const clauseMontant = clauseDate('reservation');
//     if (clauseMontant) montantQb.andWhere(clauseMontant, parametresDate);
//     const montantResult = await montantQb.getRawOne();
//     const montantTotalConfirme = Number(montantResult?.total ?? 0);

//     // ✅ Répartition des annonces par catégorie — même filtre de date.
//     const parCategorieQb = this.annonceRepository
//       .createQueryBuilder('annonce')
//       .leftJoin('annonce.sousCategorie', 'sousCategorie')
//       .leftJoin('sousCategorie.categorie', 'categorie')
//       .select('categorie.nom', 'nom')
//       .addSelect('COUNT(annonce.id)', 'nombre')
//       .where('annonce.geler = 0')
//       .andWhere('categorie.id IS NOT NULL')
//       .groupBy('categorie.id')
//       .addGroupBy('categorie.nom')
//       .orderBy('nombre', 'DESC');
//     const clauseCategorie = clauseDate('annonce');
//     if (clauseCategorie) parCategorieQb.andWhere(clauseCategorie, parametresDate);
//     const parCategorieRaw = await parCategorieQb.getRawMany();
//     const parCategorie = parCategorieRaw.map((r) => ({ nom: r.nom, nombre: Number(r.nombre) }));

//     return {
//       etat: 'succes',
//       message: 'Vue d\'ensemble récupérée',
//       data: {
//         periode: {
//           dateDebut: dateDebut ?? null,
//           dateFin: dateFin ?? null,
//         },
//         annonces: {
//           total: totalAnnonces,
//           actives: annoncesActives,
//           enAttente: annoncesEnAttente,
//           refusees: annoncesRefusees,
//         },
//         utilisateurs: {
//           total: totalUtilisateurs,
//           actifs: utilisateursActifs,
//           inactifs: utilisateursInactifs,
//         },
//         reservations: {
//           total: totalReservations,
//           enAttente: reservationsEnAttente,
//           confirmees: reservationsConfirmees,
//           annulees: reservationsAnnulees,
//           montantTotalConfirme,
//         },
//         parCategorie,
//       },
//     };
//   }
// }