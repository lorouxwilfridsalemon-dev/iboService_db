import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatutEntity } from '../../database/statut/statut.entity';
import { StatutVueEntity } from '../../database/statut_vue/statut_vue.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { StatutMetierController } from './statut-metier.controller';
import { StatutMetierService } from './statut-metier.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StatutEntity,
      StatutVueEntity,
      UtilisateurEntity,
    ]),
  ],
  controllers: [StatutMetierController],
  providers: [StatutMetierService],
  exports: [StatutMetierService],
})
export class StatutMetierModule {}