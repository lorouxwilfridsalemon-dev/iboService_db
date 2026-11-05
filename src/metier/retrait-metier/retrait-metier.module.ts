import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RetraitEntity } from '../../database/retrait/retrait.entity';
import { PortefeuilleEntity } from '../../database/portefeuille/portefeuille.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';

import { RetraitMetierController } from './retrait-metier.controller';
import { RetraitMetierService } from './retrait-metier.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RetraitEntity,
      PortefeuilleEntity,
      UtilisateurEntity,
    ]),
  ],
  controllers: [RetraitMetierController],
  providers: [RetraitMetierService],
  exports: [RetraitMetierService],
})
export class RetraitMetierModule {} 