import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanAbonnementEntity } from './plan_abonnement.entity';
import { PlanAbonnementService } from './plan_abonnement.service';
import { PlanAbonnementController } from './plan_abonnement.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlanAbonnementEntity])],
  controllers: [PlanAbonnementController],
  providers: [PlanAbonnementService],
  exports: [PlanAbonnementService],
})
export class PlanAbonnementModule {}   