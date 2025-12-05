import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtatMetierController } from './etat.controller';
import { EtatMetierService } from './etat.service';

// Entities nécessaires pour TypeORM
import { DetailAchatEntity } from '../../database/detail_achat/detail_achat.entity';
import { AchatEntity } from '../../database/achat/achat.entity';
import { ProduitEntity } from '../../database/produit/produit.entity';

/**
 * MODULE ETAT (STATISTIQUES DE VENTES)
 * 
 * Ce module permet de récupérer les statistiques de ventes
 * par jour, semaine, mois ou année.
 * 
 * NOTE : On importe les entités pour que TypeORM les connaisse,
 * mais le service utilise uniquement EntityManager (pas de Repository)
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      DetailAchatEntity,
      AchatEntity,
      ProduitEntity,
    ]),
  ],
  controllers: [EtatMetierController],
  providers: [EtatMetierService],
  exports: [EtatMetierService],
})
export class EtatMetierModule {}

