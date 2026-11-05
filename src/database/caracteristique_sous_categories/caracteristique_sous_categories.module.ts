import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaracteristiqueSousCategoriesEntity } from './caracteristique_sous_categories.entity';
import { CaracteristiqueSousCategoriesService } from './caracteristique_sous_categories.service';
import { CaracteristiqueSousCategoriesController } from './caracteristique_sous_categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CaracteristiqueSousCategoriesEntity])],
  controllers: [CaracteristiqueSousCategoriesController],
  providers: [CaracteristiqueSousCategoriesService],
  exports: [CaracteristiqueSousCategoriesService],
})
export class CaracteristiqueSousCategoriesModule {}

