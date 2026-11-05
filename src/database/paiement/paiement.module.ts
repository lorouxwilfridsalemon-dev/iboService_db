import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaiementEntity } from './paiement.entity';
import { PaiementService } from './paiement.service';
import { PaiementController } from './paiement.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaiementEntity])],
  controllers: [PaiementController],
  providers: [PaiementService],
  exports: [PaiementService],
})
export class PaiementModule {}

