import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriqueStatutReservationEntity } from './historique_statut_reservation.entity';
import { HistoriqueStatutReservationService } from './historique_statut_reservation.service';
import { HistoriqueStatutReservationController } from './historique_statut_reservation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HistoriqueStatutReservationEntity])],
  controllers: [HistoriqueStatutReservationController],
  providers: [HistoriqueStatutReservationService],
  exports: [HistoriqueStatutReservationService],
})
export class HistoriqueStatutReservationModule {}

