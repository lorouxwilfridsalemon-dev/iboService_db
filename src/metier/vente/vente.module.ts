import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenteMetierController } from './vente.controller';
import { VenteMetierService } from './vente.service';

// Entities nécessaires pour TypeORM
import { AchatEntity } from '../../database/achat/achat.entity';
import { DetailAchatEntity } from '../../database/detail_achat/detail_achat.entity';
import { ClientEntity } from '../../database/client/client.entity';
import { ProduitEntity } from '../../database/produit/produit.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { TypeClientEntity } from '../../database/type_client/type_client.entity';

/**
 * MODULE VENTE
 * 
 * NOTE : On importe les entités pour que TypeORM les connaisse,
 * mais le service utilise uniquement EntityManager (pas de Repository)
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      AchatEntity,
      DetailAchatEntity,
      ClientEntity,
      ProduitEntity,
      UtilisateurEntity,
      TypeClientEntity,
    ]),
  ],
  controllers: [VenteMetierController],
  providers: [VenteMetierService],
  exports: [VenteMetierService],
})
export class VenteMetierModule {}
