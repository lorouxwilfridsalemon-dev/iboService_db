import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { TransactionEntity } from '../../database/transaction/transaction.entity';
import { PaiementMobileEntity } from '../../database/paiement_mobile/paiement_mobile.entity';
import { AbonnementEntity } from '../../database/abonnement/abonnement.entity';
import { BoostEntity } from '../../database/boost/boost.entity';

import { PaiementMetierController } from './paiement-metier.controller';
import { PaiementMetierService } from './paiement-metier.service';
import { WaveMoneyService } from './services/wave-money.service';

@Module({
  imports: [
    ConfigModule, // ✅ Pour ConfigService
    TypeOrmModule.forFeature([
      TransactionEntity,
      PaiementMobileEntity,
      AbonnementEntity,
      BoostEntity,
    ]),
  ],
  controllers: [PaiementMetierController],
  providers: [
    PaiementMetierService,
    WaveMoneyService, // ✅ AJOUT
  ],
  exports: [PaiementMetierService, WaveMoneyService],
})
export class PaiementMetierModule {} 