import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationModule } from 'src/database/reservation/reservation.module';
import { ReservationEntity } from 'src/database/reservation/reservation.entity';
import { AnnonceEntity } from 'src/database/annonce/annonce.entity';
import { ReservationMetierController } from './reservation-metier.controller';
import { ReservationMetierService } from './reservation-metier.service';
import { NotificationMetierModule } from '../notification/notification-metier.module';
import { StatutReservationEntity } from 'src/database/statut_reservation/statut_reservation.entity';
import { HistoriqueStatutReservationEntity } from 'src/database/historique_statut_reservation/historique_statut_reservation.entity';
import { AbonnementMetierModule } from '../abonnement/abonnement-metier.module';

@Module({
  imports: [ 
    ReservationModule,
    TypeOrmModule.forFeature([
      ReservationEntity,
      AnnonceEntity,
      StatutReservationEntity,
      HistoriqueStatutReservationEntity,
    ]),
    NotificationMetierModule,
    AbonnementMetierModule,
  ],
  controllers: [ReservationMetierController],
  providers: [ReservationMetierService],
  exports: [ReservationMetierService],
})
export class ReservationMetierModule {} 