import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeModule } from './';
import { CONFIG } from '../app.constant';
import { StatutModule } from './statut';
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
    EmployeModule,
    StatutModule,
    
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
    EmployeModule,
    StatutModule,
    
    // Gestion Thon
    TypeClientModule,
    UtilisateurModule,
    ClientModule,
    ProduitModule,
    AchatModule,
    DetailAchatModule,
  ],
})
export class DatabaseModule {}
