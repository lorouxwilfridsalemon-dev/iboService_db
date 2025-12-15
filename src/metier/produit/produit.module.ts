import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProduitMetierController } from './produit.controller';
import { ProduitMetierService } from './produit.service';
import { ProduitEntity } from '../../database/produit/produit.entity';
import { HistoriqueProduitEntity } from '../../database/historique_produit/historique_produit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProduitEntity,
      HistoriqueProduitEntity,
    ]),
  ],
  controllers: [ProduitMetierController],
  providers: [ProduitMetierService],
  exports: [ProduitMetierService],
})
export class ProduitMetierModule {}


