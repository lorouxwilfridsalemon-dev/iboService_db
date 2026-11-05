import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaracteristiqueEntity } from '../../database/caracteristique/caracteristique.entity';
import { CaracteristiquesMetierController } from './caracteristiques-metier.controller';
import { CaracteristiquesMetierService } from './caracteristiques-metier.service';

@Module({
  imports: [TypeOrmModule.forFeature([CaracteristiqueEntity])],
  controllers: [CaracteristiquesMetierController],
  providers: [CaracteristiquesMetierService],
  exports: [CaracteristiquesMetierService],
})
export class CaracteristiquesMetierModule {} 