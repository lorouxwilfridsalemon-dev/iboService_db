// import { EventsModule } from './gateways/events.module';
// import { Module } from '@nestjs/common';
// import { FilesModule } from './../files/files.module';
// // import { PublierMetierModule } from './publier/publier.module';
// import { DashboardMetierModule } from './dashboard/dashboard.module';
// import { PublierModule } from './publier/publier.module';
// import { AccueilModule } from './accuel/accueil.module';
// import { AuthModule } from './auth/auth.module';
// import { ReservationMetierModule } from './reservation/reservation-metier.module';
// import { FavoriMetierModule } from './favori/favori-metier.module';
// import { NotificationMetierModule } from './notification/notification-metier.module';
// import { MessageMetierModule } from './message/message-metier.module';
// import { ProfilMetierModule } from './profil/profil-metier.module';
// import { SousCategoriesMetierModule } from './sous-categories/sous-categories-metier.module';
// import { CategoriesMetierModule } from './categories/categories-metier.module';
// import { CaracteristiquesMetierModule } from './caracteristiques/caracteristiques-metier.module';
// import { CaracteristiqueSousCategoriesMetierModule } from './caracteristique_sous_categories/caracteristique_sous_categories-metier.module';
// import { AnnonceMetierModule } from './annonce/annonce-metier.module';
// import { UtilisateurMetierModule } from './utilisateur/utilisateur-metier.module';
// // import { CaracteristiqueSousCategoriesMetierModule } from './caracteristique_sous_categories/caracteristique_sous_categories-metier.module';

// @Module({
//     imports: [
//         EventsModule,
//         FilesModule,
//         PublierModule,
//         DashboardMetierModule, 
//         AccueilModule,
//         AuthModule,
//         ReservationMetierModule,
//         FavoriMetierModule,
//         NotificationMetierModule,
//         MessageMetierModule,
//         ProfilMetierModule,
//         SousCategoriesMetierModule,
//         CategoriesMetierModule,
//         CaracteristiquesMetierModule,
//         CaracteristiqueSousCategoriesMetierModule,
//         AnnonceMetierModule, 
//         UtilisateurMetierModule,


//     ],
//     providers: [],
//     controllers: [],
//     exports: [],
// })
// export class MetierModule { } 

import { Module } from '@nestjs/common';
import { EventsModule } from './gateways/events.module';
import { FilesModule } from './../files/files.module';
import { DashboardMetierModule } from './dashboard/dashboard.module';
import { PublierModule } from './publier/publier.module';
import { AccueilModule } from './accuel/accueil.module';
import { AuthModule } from './auth/auth.module';
import { ReservationMetierModule } from './reservation/reservation-metier.module';
import { FavoriMetierModule } from './favori/favori-metier.module';
import { NotificationMetierModule } from './notification/notification-metier.module';
import { MessageMetierModule } from './message/message-metier.module';
import { ProfilMetierModule } from './profil/profil-metier.module';
import { SousCategoriesMetierModule } from './sous-categories/sous-categories-metier.module';
import { CategoriesMetierModule } from './categories/categories-metier.module';
import { CaracteristiquesMetierModule } from './caracteristiques/caracteristiques-metier.module';
import { CaracteristiqueSousCategoriesMetierModule } from './caracteristique_sous_categories/caracteristique_sous_categories-metier.module';
import { AnnonceMetierModule } from './annonce/annonce-metier.module';
import { UtilisateurMetierModule } from './utilisateur/utilisateur-metier.module';

// ✅ NOUVEAUX MODULES MÉTIER
import { AbonnementMetierModule } from './abonnement/abonnement-metier.module';
import { BoostMetierModule } from './boost-metier/boost-metier.module';
// import { PaiementMetierModule } from './paiement-metier/paiement-metier.module';
import { RetraitMetierModule } from './retrait-metier/retrait-metier.module';
import { PaiementMetierModule } from './paiement/paiement-metier.module';
import { StatutMetierModule } from './statut-metier/statut-metier.module';

@Module({
  imports: [
    // Système
    EventsModule,
    FilesModule,

    // Métier existant
    PublierModule,
    DashboardMetierModule,
    AccueilModule,
    AuthModule,
    ReservationMetierModule,
    FavoriMetierModule,
    NotificationMetierModule,
    MessageMetierModule,
    ProfilMetierModule,
    SousCategoriesMetierModule,
    CategoriesMetierModule,
    CaracteristiquesMetierModule,
    CaracteristiqueSousCategoriesMetierModule,
    AnnonceMetierModule,
    UtilisateurMetierModule,
    StatutMetierModule, 

    // ✅ Monétisation
    AbonnementMetierModule,
    BoostMetierModule,
    PaiementMetierModule,
    RetraitMetierModule,
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class MetierModule {}