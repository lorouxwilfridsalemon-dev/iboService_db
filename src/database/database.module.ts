import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CONFIG } from '../app.constant';

import { TypeClientModule } from './type_client';
import { UtilisateurModule } from './utilisateur';
import { ClientModule } from './client';
import { ProduitModule } from './produit';
import { AchatModule } from './achat';
import { DetailAchatModule } from './detail_achat';
import { HistoriqueProduitModule } from './historique_produit';
import { ModalitePaiementModule } from './modalite_paiement';

@Module({
  imports: [
    // Config
    TypeOrmModule.forRoot(CONFIG().db),

    // Administration


    // Gestion Thon
    TypeClientModule,
    UtilisateurModule,
    ClientModule,
    ProduitModule,
    AchatModule,
    DetailAchatModule,
    HistoriqueProduitModule,
    ModalitePaiementModule,
  ],
  providers: [],
  controllers: [],
  exports: [
    // Administration


    // Gestion Thon
    TypeClientModule,
    UtilisateurModule,
    ClientModule,
    ProduitModule,
    AchatModule,
    DetailAchatModule,
    HistoriqueProduitModule,
    ModalitePaiementModule,
  ],
})
export class DatabaseModule { }
