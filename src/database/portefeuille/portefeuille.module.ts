import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortefeuilleEntity } from './portefeuille.entity';
import { PortefeuilleService } from './portefeuille.service';
import { PortefeuilleController } from './portefeuille.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PortefeuilleEntity])],
  controllers: [PortefeuilleController],
  providers: [PortefeuilleService],
  exports: [PortefeuilleService],
})
export class PortefeuilleModule {} 