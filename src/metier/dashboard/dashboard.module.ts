import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnonceEntity } from '../../database/annonce/annonce.entity';
import { ReservationEntity } from '../../database/reservation/reservation.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { CategoriesEntity } from '../../database/categories/categories.entity';
import { DashboardMetierController } from './dashboard.controller';
import { DashboardMetierService } from './dashboard.service';
// import { DashboardMetierController } from './dashboard-metier.controller';
// import { DashboardMetierService } from './dashboard-metier.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnnonceEntity,
      ReservationEntity,
      UtilisateurEntity,
      CategoriesEntity,  
    ]),
  ],
  controllers: [DashboardMetierController], 
  providers: [DashboardMetierService],
  exports: [DashboardMetierService],
})
export class DashboardMetierModule {} 