import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriqueStatutAnnonceEntity } from './historique_statut_annonce.entity';
import { HistoriqueStatutAnnonceService } from './historique_statut_annonce.service';
import { HistoriqueStatutAnnonceController } from './historique_statut_annonce.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HistoriqueStatutAnnonceEntity])],
  controllers: [HistoriqueStatutAnnonceController],
  providers: [HistoriqueStatutAnnonceService],
  exports: [HistoriqueStatutAnnonceService],
})
export class HistoriqueStatutAnnonceModule {}

