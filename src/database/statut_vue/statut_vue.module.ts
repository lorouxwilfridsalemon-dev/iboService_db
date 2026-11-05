import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatutVueEntity } from './statut_vue.entity';
import { StatutVueService } from './statut_vue.service';
import { StatutVueController } from './statut_vue.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StatutVueEntity])],
  controllers: [StatutVueController],
  providers: [StatutVueService],
  exports: [StatutVueService],
})
export class StatutVueModule {} 

