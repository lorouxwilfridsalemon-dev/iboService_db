import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenteMetierController } from './vente.controller';
import { VenteMetierService } from './vente.service';

import { AchatEntity } from '../../database/achat/achat.entity';
import { DetailAchatEntity } from '../../database/detail_achat/detail_achat.entity';
import { ClientEntity } from '../../database/client/client.entity';
import { ProduitEntity } from '../../database/produit/produit.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { TypeClientEntity } from '../../database/type_client/type_client.entity';
import { PaiementEntity } from '../../database/paiement/paiement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AchatEntity,
      DetailAchatEntity,
      ClientEntity,
      ProduitEntity,
      UtilisateurEntity,
      TypeClientEntity,
      PaiementEntity,
    ]),
  ],
  controllers: [VenteMetierController],
  providers: [VenteMetierService],
  exports: [VenteMetierService],
})
export class VenteMetierModule { }
