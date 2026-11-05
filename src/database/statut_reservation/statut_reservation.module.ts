import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatutReservationEntity } from './statut_reservation.entity';
import { StatutReservationService } from './statut_reservation.service';
import { StatutReservationController } from './statut_reservation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StatutReservationEntity])],
  controllers: [StatutReservationController],
  providers: [StatutReservationService],
  exports: [StatutReservationService],
})
export class StatutReservationModule {}

