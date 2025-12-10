import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModalitePaiementEntity } from './modalite_paiement.entity';
import { ModalitePaiementService } from './modalite_paiement.service';
import { ModalitePaiementController } from './modalite_paiement.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ModalitePaiementEntity])],
  controllers: [ModalitePaiementController],
  providers: [ModalitePaiementService],
  exports: [ModalitePaiementService],
})
export class ModalitePaiementModule {}

