import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnonceCaracteristiqueEntity } from './annonce_caracteristique.entity';
import { AnnonceCaracteristiqueService } from './annonce_caracteristique.service';
import { AnnonceCaracteristiqueController } from './annonce_caracteristique.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AnnonceCaracteristiqueEntity])],
  controllers: [AnnonceCaracteristiqueController],
  providers: [AnnonceCaracteristiqueService],
  exports: [AnnonceCaracteristiqueService],
})
export class AnnonceCaracteristiqueModule {}

