import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardMetierController } from './dashboard.controller';
import { DashboardMetierService } from './dashboard.service';

// Entities nécessaires pour TypeORM
import { AchatEntity } from '../../database/achat/achat.entity';
import { DetailAchatEntity } from '../../database/detail_achat/detail_achat.entity';
import { ClientEntity } from '../../database/client/client.entity';
import { ProduitEntity } from '../../database/produit/produit.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { TypeClientEntity } from '../../database/type_client/type_client.entity';

/**
 * MODULE DASHBOARD
 * 
 * Module pour les statistiques et tableaux de bord
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      AchatEntity,
      DetailAchatEntity,
      ClientEntity,
      ProduitEntity,
      UtilisateurEntity,
      TypeClientEntity,
    ]),
  ],
  controllers: [DashboardMetierController],
  providers: [DashboardMetierService],
  exports: [DashboardMetierService],
})
export class DashboardMetierModule {}

