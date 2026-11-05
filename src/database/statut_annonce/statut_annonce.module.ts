import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatutAnnonceEntity } from './statut_annonce.entity';
import { StatutAnnonceService } from './statut_annonce.service';
import { StatutAnnonceController } from './statut_annonce.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StatutAnnonceEntity])],
  controllers: [StatutAnnonceController],
  providers: [StatutAnnonceService],
  exports: [StatutAnnonceService],
})
export class StatutAnnonceModule {}

