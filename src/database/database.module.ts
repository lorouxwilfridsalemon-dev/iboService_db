import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CONFIG } from '../app.constant';

import { TypeClientModule } from './type_client';
import { UtilisateurModule } from './utilisateur';
import { ClientModule } from './client';
import { ProduitModule } from './produit';
import { AchatModule } from './achat';
import { DetailAchatModule } from './detail_achat';

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
  ],
})
export class DatabaseModule { }
