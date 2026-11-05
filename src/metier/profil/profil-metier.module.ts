import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilMetierController } from './profil-metier.controller';
import { ProfilMetierService } from './profil-metier.service';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
// ✅ AJOUT : nécessaire pour la gestion des Profils (types de comptes).
import { ProfilEntity } from '../../database/profil/profil.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UtilisateurEntity,
      ProfilEntity, // ✅ AJOUT
    ]),
  ],
  controllers: [ProfilMetierController],
  providers: [ProfilMetierService],
  exports: [ProfilMetierService],
})
export class ProfilMetierModule {}