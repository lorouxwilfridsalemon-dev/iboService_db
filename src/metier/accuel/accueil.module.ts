import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccueilMetierController } from './accueil.controller';
import { AccueilMetierService } from './accueil.service';
import { AnnonceEntity } from '../../database/annonce/annonce.entity';
import { CategoriesEntity } from '../../database/categories/categories.entity';
import { SousCategoriesEntity } from '../../database/sous_categories/sous_categories.entity';
import { AnnonceVideoEntity } from 'src/database/annonce_video/annonce_video.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnnonceEntity,
      CategoriesEntity,
      SousCategoriesEntity,
      AnnonceVideoEntity
    ]), 
  ],
  controllers: [AccueilMetierController],
  providers: [AccueilMetierService],
})
export class AccueilModule {}