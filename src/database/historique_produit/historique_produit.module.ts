import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriqueProduitEntity } from './historique_produit.entity';
import { HistoriqueProduitService } from './historique_produit.service';
import { HistoriqueProduitController } from './historique_produit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HistoriqueProduitEntity])],
  controllers: [HistoriqueProduitController],
  providers: [HistoriqueProduitService],
  exports: [HistoriqueProduitService],
})
export class HistoriqueProduitModule {}

