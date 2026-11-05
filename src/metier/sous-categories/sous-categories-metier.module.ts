import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SousCategoriesEntity } from 'src/database/sous_categories/sous_categories.entity';
import { AnnonceEntity } from 'src/database/annonce/annonce.entity'; // ✅ AJOUT
import { SousCategoriesMetierController } from './sous-categories-metier.controller';
import { SousCategoriesMetierService } from './sous-categories-metier.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SousCategoriesEntity,
      AnnonceEntity, // ✅ AJOUT — sans lui, le service ne peut pas démarrer
    ]),
  ],
  controllers: [SousCategoriesMetierController],
  providers: [SousCategoriesMetierService],
  exports: [SousCategoriesMetierService],
})
export class SousCategoriesMetierModule {} 