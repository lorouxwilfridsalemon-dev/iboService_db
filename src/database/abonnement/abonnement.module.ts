import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbonnementEntity } from './abonnement.entity';
import { AbonnementService } from './abonnement.service';
import { AbonnementController } from './abonnement.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AbonnementEntity])],
  controllers: [AbonnementController],
  providers: [AbonnementService],
  exports: [AbonnementService],
})
export class AbonnementModule {}

