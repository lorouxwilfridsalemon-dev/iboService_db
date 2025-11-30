import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenteMetierController } from './vente.controller';
import { VenteMetierService } from './vente.service';
import { ClientEntity } from '../../database/client/client.entity';
import { AchatEntity } from '../../database/achat/achat.entity';
import { DetailAchatEntity } from '../../database/detail_achat/detail_achat.entity';
import { ProduitEntity } from '../../database/produit/produit.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { SupportEntity } from '../../database/support/support.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ClientEntity,
            AchatEntity,
            DetailAchatEntity,
            ProduitEntity,
            UtilisateurEntity,
            SupportEntity
        ])
    ],
    controllers: [VenteMetierController],
    providers: [VenteMetierService],
    exports: [VenteMetierService],
})
export class VenteMetierModule { }
