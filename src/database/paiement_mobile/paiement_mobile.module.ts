import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaiementMobileEntity } from './paiement_mobile.entity';
import { PaiementMobileService } from './paiement_mobile.service';
import { PaiementMobileController } from './paiement_mobile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaiementMobileEntity])],
  controllers: [PaiementMobileController],
  providers: [PaiementMobileService],
  exports: [PaiementMobileService],
})
export class PaiementMobileModule {}