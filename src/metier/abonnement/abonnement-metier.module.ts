// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';

// import { AbonnementEntity } from '../../database/abonnement/abonnement.entity';
// import { PlanAbonnementEntity } from '../../database/plan_abonnement/plan_abonnement.entity';
// import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
// import { TransactionEntity } from '../../database/transaction/transaction.entity';

// import { AbonnementMetierController } from './abonnement-metier.controller';
// import { AbonnementMetierService } from './abonnement-metier.service';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([
//       AbonnementEntity,
//       PlanAbonnementEntity,
//       UtilisateurEntity,
//       TransactionEntity,
//     ]),
//   ],
//   controllers: [AbonnementMetierController],
//   providers: [AbonnementMetierService],
//   exports: [AbonnementMetierService],
// })
// export class AbonnementMetierModule {} 

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AbonnementEntity } from '../../database/abonnement/abonnement.entity';
import { PlanAbonnementEntity } from '../../database/plan_abonnement/plan_abonnement.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { TransactionEntity } from '../../database/transaction/transaction.entity';

import { AbonnementMetierController } from './abonnement-metier.controller';
import { AbonnementMetierService } from './abonnement-metier.service';
import { AnnonceEntity } from 'src/database/annonce/annonce.entity';
import { ReservationEntity } from 'src/database/reservation/reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AbonnementEntity,
      PlanAbonnementEntity,
      UtilisateurEntity,
      TransactionEntity,
      AnnonceEntity,
      ReservationEntity
    ]),
  ],
  controllers: [AbonnementMetierController],
  providers: [AbonnementMetierService],
  exports: [AbonnementMetierService],
})
export class AbonnementMetierModule {}