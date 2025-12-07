import { Injectable } from '@nestjs/common';
import { Like, Between } from 'typeorm';
import { Transaction, TransactionManager, EntityManager, getManager, } from 'typeorm';

import { UtilisateurEntity } from 'src/database';

@Injectable()
export class EtatMetierService {
  constructor() { }

  //Fonction demande etat
  //créer une nouvelle etat et lui attribuer le statut 1(en attente) par defaut.
  //   async demandeEtat(manager: EntityManager, etat: any) {
  //     let etatEntity = new EtatEntity({
  //       ...etat,
  //     });

  //     etatEntity = await manager.save(etatEntity);

  //     if (etatEntity) {
  //       let statutEtatEntity = new StatutEtatEntity({
  //         empty1: null,
  //         empty2: null,
  //         empty3: null,
  //         geler: 0,
  //         dateCreation: new Date().toDateString(),
  //         idusrcreation: 1,
  //         etat: etatEntity.id,
  //         statut: 1,
  //         actif: 0,
  //       });
  //       statutEtatEntity = await manager.save(statutEtatEntity);
  //     }

  //     return etatEntity;
  //   }

  //   //Fonction Modifier etat
  //   async updateEtat(manager: EntityManager, etat: any) {
  //     let etatEntity = new EtatEntity({
  //       ...etat,
  //     });

  //     etatEntity = await manager.save(etatEntity);
  //     return etatEntity;
  //   }

  //   //Fonction Annuler etat
  //   async attribuerEtat(manager: EntityManager, etat: any) {
  //     const etatEntity = new EtatEntity({
  //       ...etat,
  //       employe: etat.utilisateurs,
  //     });

  //     const etats = await manager.save(etatEntity);

  //     let statutEtatEntity = new StatutEtatEntity({
  //       empty1: null,
  //       empty2: null,
  //       empty3: null,
  //       geler: 0,
  //       dateCreation: new Date().toDateString(),
  //       idusrcreation: 1,
  //       etat: etatEntity.id,
  //       statut: 1,
  //       actif: 0,
  //     });

  //     const etatStatutZero = await manager.find(StatutEtatEntity, {
  //       where: {
  //         etat: etatEntity.id,
  //         actif: 0,
  //       },
  //     });

  //     if (etatStatutZero.length > 0) {
  //       for (let i = 0; i < etatStatutZero.length; i++) {
  //         const statut = etatStatutZero[i];
  //         statut.actif = 1;
  //         await manager.save(statut);
  //       }
  //     }

  //     statutEtatEntity = await manager.save(statutEtatEntity);

  //     return etats;
  //   }

  //   //Fonction Annuler etat
  //   async rejeterEtat(manager: EntityManager, etat: any, user: any) {
  //     // console.log(user);

  //     const etatEntity = new EtatEntity({
  //       ...etat,
  //       motif: etat.motifs.id,
  //       empty1: etat.empty1
  //     });

  //     const etats = await manager.save(etatEntity);

  //     let statutEtatEntity = new StatutEtatEntity({
  //       empty1: null,
  //       empty2: null,
  //       empty3: null,
  //       geler: 0,
  //       dateCreation: new Date().toDateString(),
  //       idusrcreation: 1,
  //       etat: etatEntity.id,
  //       statut: 3,
  //       actif: 0,
  //     });

  //     const etatStatutZero = await manager.find(StatutEtatEntity, {
  //       where: {
  //         etat: etatEntity.id,
  //         actif: 0,
  //       },
  //     });

  //     if (etatStatutZero.length > 0) {
  //       for (let i = 0; i < etatStatutZero.length; i++) {
  //         const statut = etatStatutZero[i];
  //         statut.actif = 1;
  //         await manager.save(statut);
  //       }
  //     }

  //     statutEtatEntity = await manager.save(statutEtatEntity);

  //     // console.log(statutEtatEntity)
  //     return etats;
  //   }

  //   // async SupprimerEtatAttente(manager: EntityManager, etat: any) {
  //   //   let etatEntity = new EtatEntity({
  //   //     ...etat,
  //   //   });

  //   //   etatEntity = await manager.save(etatEntity);
  //   //   return etatEntity;
  //   // }
}
