// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { PublierMetierController } from './publier.controller';
// import { PublierMetierService } from './publier.service';
// import { AnnonceEntity } from '../../database/annonce/annonce.entity';
// import { LocalisationEntity } from '../../database/localisation/localisation.entity';
// import { SousCategoriesEntity } from '../../database/sous_categories/sous_categories.entity';
// import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
// import { DetailImmobilierEntity } from '../../database/detail_immobilier/detail_immobilier.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([
//       AnnonceEntity,
//       LocalisationEntity,
//       SousCategoriesEntity,
//       UtilisateurEntity,
//       DetailImmobilierEntity,
//     ]),
//   ],
//   controllers: [PublierMetierController],
//   providers: [PublierMetierService],
// })
// export class PublierModule {}  



import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublierMetierController } from './publier.controller';
import { PublierMetierService } from './publier.service';
import { AnnonceEntity } from '../../database/annonce/annonce.entity';
import { LocalisationEntity } from '../../database/localisation/localisation.entity';
import { SousCategoriesEntity } from '../../database/sous_categories/sous_categories.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { DetailImmobilierEntity } from '../../database/detail_immobilier/detail_immobilier.entity';
import { AbonnementEntity } from '../../database/abonnement/abonnement.entity';
import { PlanAbonnementEntity } from '../../database/plan_abonnement/plan_abonnement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnnonceEntity,
      LocalisationEntity,
      SousCategoriesEntity,
      UtilisateurEntity,
      DetailImmobilierEntity,
      // ✅ AJOUT pour la vérification des limites
      AbonnementEntity,
      PlanAbonnementEntity,
    ]),
  ],
  controllers: [PublierMetierController],
  providers: [PublierMetierService],
})
export class PublierModule {}


