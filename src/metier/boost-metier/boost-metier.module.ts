import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoostEntity } from '../../database/boost/boost.entity';
import { AnnonceEntity } from '../../database/annonce/annonce.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { TransactionEntity } from '../../database/transaction/transaction.entity';

import { BoostMetierController } from './boost-metier.controller';
import { BoostMetierService } from './boost-metier.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BoostEntity,
      AnnonceEntity,
      UtilisateurEntity,
      TransactionEntity,
    ]),
  ],
  controllers: [BoostMetierController],
  providers: [BoostMetierService],
  exports: [BoostMetierService],
})
export class BoostMetierModule {}