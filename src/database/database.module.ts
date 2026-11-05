import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CONFIG } from '../app.constant';

// Administration
import { DroitModule } from './droit';
import { ModuleModule } from './module';
import { ModuleDroitModule } from './module-droit';
import { ProfilModule } from './profil';
import { UtilisateurModule } from './utilisateur';
import { ModalitePaiementModule } from './modalite_paiement';
import { PaiementModule } from './paiement';
import { SignalementModule } from './signalement/signalement.module';
import { SousCategoriesModule } from './sous_categories/sous_categories.module';
import { ReservationModule } from './reservation/reservation.module';
import { LocalisationModule } from './localisation/localisation.module';
import { DetailImmobilierModule } from './detail_immobilier/detail_immobilier.module';
import { AvisModule } from './avis/avis.module';
import { AnnonceModule } from './annonce/annonce.module';
import { CaracteristiqueModule } from './caracteristique/caracteristique.module';
import { AnnonceCaracteristiqueModule } from './annonce_caracteristique/annonce_caracteristique.module';
import { CategoriesModule } from './categories/categories.module';
import { MessageModule } from './message/message.module';
import { AnnonceImageModule } from './annonce_image/annonce_image.module';
import { FavoriModule } from './favori/favori.module';
import { CaracteristiqueSousCategoriesModule } from './caracteristique_sous_categories/caracteristique_sous_categories.module';
import { NotificationModule } from './notification/notification.module';
import { AnnonceVideoModule } from './annonce_video/annonce_video.module';
import { StatutReservationModule } from './statut_reservation/statut_reservation.module';
import { StatutAnnonceModule } from './statut_annonce/statut_annonce.module';
import { HistoriqueStatutReservationModule } from './historique_statut_reservation/historique_statut_reservation.module';
import { HistoriqueStatutAnnonceModule } from './historique_statut_annonce/historique_statut_annonce.module';

// ✅ AJOUT : nouveaux modules de monétisation
import { TransactionModule } from './transaction/transaction.module';
import { PortefeuilleModule } from './portefeuille/portefeuille.module';
import { RetraitModule } from './retrait/retrait.module';
import { PlanAbonnementModule } from './plan_abonnement/plan_abonnement.module';
import { AbonnementModule } from './abonnement/abonnement.module';
import { BoostModule } from './boost/boost.module';

// ✅ AJOUT : modules statuts (stories WhatsApp)
import { StatutModule } from './statut/statut.module';
import { StatutVueModule } from './statut_vue/statut_vue.module';

@Module({
  imports: [
    // Config
    TypeOrmModule.forRoot(CONFIG().db),

    // ═══════════════════════════════════════════════════════════════════════
    // ADMINISTRATION
    // ═══════════════════════════════════════════════════════════════════════

    DroitModule,
    ModuleModule,
    ModuleDroitModule,
    ProfilModule,
    SignalementModule,
    SousCategoriesModule,
    ReservationModule,
    LocalisationModule,
    DetailImmobilierModule,
    UtilisateurModule,
    ModalitePaiementModule,
    PaiementModule,
    AvisModule,
    AnnonceModule,
    CaracteristiqueModule,
    AnnonceCaracteristiqueModule,
    CategoriesModule,
    MessageModule,
    AnnonceImageModule,
    FavoriModule,
    CaracteristiqueSousCategoriesModule,
    NotificationModule,
    AnnonceVideoModule,
    HistoriqueStatutAnnonceModule,
    HistoriqueStatutReservationModule,
    StatutAnnonceModule,
    StatutReservationModule,

    // ═══════════════════════════════════════════════════════════════════════
    // ✅ MONÉTISATION (nouveaux modules)
    // ═══════════════════════════════════════════════════════════════════════

    TransactionModule,      // Transactions financières
    PortefeuilleModule,     // Portefeuille utilisateur
    RetraitModule,          // Demandes de retrait
    PlanAbonnementModule,   // Plans d'abonnement (gratuit/mensuel/à vie)
    AbonnementModule,       // Abonnements actifs des utilisateurs
    BoostModule,            // Boosts d'annonces

    // ═══════════════════════════════════════════════════════════════════════
    // ✅ STATUTS (stories WhatsApp)
    // ═══════════════════════════════════════════════════════════════════════

    StatutModule,           // Statuts (stories)
    StatutVueModule,        // Vues des statuts
  ],
  providers: [],
  controllers: [],
  exports: [
    DroitModule,
    ModuleModule,
    ModuleDroitModule,
    ProfilModule,
    UtilisateurModule,
    ModalitePaiementModule,
    PaiementModule,

    // ✅ AJOUT : modules exportés pour réutilisation
    TransactionModule,
    PortefeuilleModule,
    RetraitModule,
    PlanAbonnementModule,
    AbonnementModule,
    BoostModule,

    // ✅ AJOUT : statuts exportés
    StatutModule,
    StatutVueModule,
  ],
})
export class DatabaseModule {}


// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';

// import { CONFIG } from '../app.constant';

// // Administration
// import { DroitModule } from './droit';
// import { ModuleModule } from './module';
// import { ModuleDroitModule } from './module-droit';
// import { ProfilModule } from './profil';
// import { UtilisateurModule } from './utilisateur';
// import { ModalitePaiementModule } from './modalite_paiement';
// import { PaiementModule } from './paiement';
// import { SignalementModule } from './signalement/signalement.module';
// import { SousCategoriesModule } from './sous_categories/sous_categories.module';
// import { ReservationModule } from './reservation/reservation.module';
// import { LocalisationModule } from './localisation/localisation.module';
// import { DetailImmobilierModule } from './detail_immobilier/detail_immobilier.module';
// import { AvisModule } from './avis/avis.module';
// import { AnnonceModule } from './annonce/annonce.module';
// import { CaracteristiqueModule } from './caracteristique/caracteristique.module';
// import { AnnonceCaracteristiqueModule } from './annonce_caracteristique/annonce_caracteristique.module';
// import { CategoriesModule } from './categories/categories.module';
// import { MessageModule } from './message/message.module';
// import { AnnonceImageModule } from './annonce_image/annonce_image.module';
// import { FavoriModule } from './favori/favori.module';
// import { CaracteristiqueSousCategoriesModule } from './caracteristique_sous_categories/caracteristique_sous_categories.module';
// import { NotificationModule } from './notification/notification.module';
// import { AnnonceVideoModule } from './annonce_video/annonce_video.module';
// import { StatutReservationModule } from './statut_reservation/statut_reservation.module';
// import { StatutAnnonceModule } from './statut_annonce/statut_annonce.module';
// import { HistoriqueStatutReservationModule } from './historique_statut_reservation/historique_statut_reservation.module';
// import { HistoriqueStatutAnnonceModule } from './historique_statut_annonce/historique_statut_annonce.module';

// // ✅ AJOUT : nouveaux modules de monétisation
// import { TransactionModule } from './transaction/transaction.module';
// import { PortefeuilleModule } from './portefeuille/portefeuille.module';
// import { RetraitModule } from './retrait/retrait.module';
// import { PlanAbonnementModule } from './plan_abonnement/plan_abonnement.module';
// import { AbonnementModule } from './abonnement/abonnement.module';
// import { BoostModule } from './boost/boost.module';

// @Module({
//   imports: [
//     // Config
//     TypeOrmModule.forRoot(CONFIG().db),

//     // ═══════════════════════════════════════════════════════════════════════
//     // ADMINISTRATION
//     // ═══════════════════════════════════════════════════════════════════════

//     DroitModule,
//     ModuleModule,
//     ModuleDroitModule,
//     ProfilModule,
//     SignalementModule,
//     SousCategoriesModule,
//     ReservationModule,
//     LocalisationModule,
//     DetailImmobilierModule,
//     UtilisateurModule,
//     ModalitePaiementModule,
//     PaiementModule,
//     AvisModule,
//     AnnonceModule,
//     CaracteristiqueModule,
//     AnnonceCaracteristiqueModule,
//     CategoriesModule,
//     MessageModule,
//     AnnonceImageModule,
//     FavoriModule,
//     CaracteristiqueSousCategoriesModule,
//     NotificationModule,
//     AnnonceVideoModule,
//     HistoriqueStatutAnnonceModule,
//     HistoriqueStatutReservationModule,
//     StatutAnnonceModule,
//     StatutReservationModule,

//     // ═══════════════════════════════════════════════════════════════════════
//     // ✅ MONÉTISATION (nouveaux modules)
//     // ═══════════════════════════════════════════════════════════════════════

//     TransactionModule,      // Transactions financières
//     PortefeuilleModule,     // Portefeuille utilisateur
//     RetraitModule,          // Demandes de retrait
//     PlanAbonnementModule,   // Plans d'abonnement (gratuit/mensuel/à vie)
//     AbonnementModule,       // Abonnements actifs des utilisateurs
//     BoostModule,            // Boosts d'annonces
//   ],
//   providers: [],
//   controllers: [],
//   exports: [
//     DroitModule,
//     ModuleModule,
//     ModuleDroitModule,
//     ProfilModule,
//     UtilisateurModule,
//     ModalitePaiementModule,
//     PaiementModule,

//     // ✅ AJOUT : modules exportés pour réutilisation
//     TransactionModule,
//     PortefeuilleModule,
//     RetraitModule,
//     PlanAbonnementModule,
//     AbonnementModule,
//     BoostModule,
//   ],
// })
// export class DatabaseModule {} 