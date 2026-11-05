import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SousCategoriesEntity } from './sous_categories.entity';
import { SousCategoriesService } from './sous_categories.service';
import { SousCategoriesController } from './sous_categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SousCategoriesEntity])],
  controllers: [SousCategoriesController],
  providers: [SousCategoriesService],
  exports: [SousCategoriesService],
})
export class SousCategoriesModule {}

