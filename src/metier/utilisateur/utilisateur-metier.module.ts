import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilisateurMetierController } from './utilisateur-metier.controller';
import { UtilisateurMetierService } from './utilisateur-metier.service';
import { UtilisateurEntity } from 'src/database/utilisateur/utilisateur.entity';
// import { UtilisateurEntity } from 'src/database/utilisateur';
// import { UtilisateurEntity } from '../utilisateur/utilisateur.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UtilisateurEntity  
    ]),
  ],
  controllers: [UtilisateurMetierController],
  providers: [UtilisateurMetierService],
  exports: [UtilisateurMetierService],
})
export class UtilisateurMetierModule {} 