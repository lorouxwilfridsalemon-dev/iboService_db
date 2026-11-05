import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesEntity } from '../../database/categories/categories.entity';
import { CategoriesMetierController } from './categories-metier.controller';
import { CategoriesMetierService } from './categories-metier.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriesEntity])],
  controllers: [CategoriesMetierController],
  providers: [CategoriesMetierService],
  exports: [CategoriesMetierService],
})
export class CategoriesMetierModule {} 