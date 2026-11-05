import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnonceEntity } from '../../database/annonce/annonce.entity';
import { AnnonceCaracteristiqueMetierController } from './annonce-caracteristique-metier.controller';
import { AnnonceCaracteristiqueMetierService } from './annonce-caracteristique-metier.service';
import { AnnonceCaracteristiqueEntity } from 'src/database/annonce_caracteristique/annonce_caracteristique.entity';
// import { AnnonceCaracteristiqueEntity } from 'src/database/sous_categories/sous_categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnnonceCaracteristiqueEntity])],
  controllers: [AnnonceCaracteristiqueMetierController],
  providers: [AnnonceCaracteristiqueMetierService],
  exports: [AnnonceCaracteristiqueMetierService],
})
export class AnnonceCaracteristiqueMetierModule {}