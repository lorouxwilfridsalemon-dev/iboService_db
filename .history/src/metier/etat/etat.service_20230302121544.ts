import { Injectable } from '@nestjs/common';
import { Like, Between } from 'typeorm';
import { Transaction, TransactionManager, EntityManager, getManager,} from 'typeorm';
import { VisiteEntity } from 'src/database/visite/visite.entity';
import { StatutVisiteEntity } from 'src/database/statut-visite/statut-visite.entity';
import { UtilisateurEntity } from 'src/database';

@Injectable()
export class VisiteMetierService {
  constructor() {}

  //Fonction demande visite
  //créer une nouvelle visite et lui attribuer le statut 1(en attente) par defaut.
  async demandeVisite(manager: EntityManager, visite: any) {
    let visiteEntity = new VisiteEntity({
      ...visite,
    });

    visiteEntity = await manager.save(visiteEntity);

    if (visiteEntity) {
      let statutVisiteEntity = new StatutVisiteEntity({
        empty1: null,
        empty2: null,
        empty3: null,
        geler: 0,
        dateCreation: new Date().toDateString(),
        idusrcreation: 1,
        visite: visiteEntity.id,
        statut: 1,
        actif: 0,
      });
      statutVisiteEntity = await manager.save(statutVisiteEntity);
    }

    return visiteEntity;
  }

  //Fonction Modifier visite
  async updateVisite(manager: EntityManager, visite: any) {
    let visiteEntity = new VisiteEntity({
      ...visite,
    });

    visiteEntity = await manager.save(visiteEntity);
    return visiteEntity;
  }

  //Fonction Annuler visite
  async attribuerVisite(manager: EntityManager, visite: any) {
    const visiteEntity = new VisiteEntity({
      ...visite,
      employe: visite.utilisateurs,
    });

    const visites = await manager.save(visiteEntity);

    let statutVisiteEntity = new StatutVisiteEntity({
      empty1: null,
      empty2: null,
      empty3: null,
      geler: 0,
      dateCreation: new Date().toDateString(),
      idusrcreation: 1,
      visite: visiteEntity.id,
      statut: 1,
      actif: 0,
    });

    const visiteStatutZero = await manager.find(StatutVisiteEntity, {
      where: {
        visite: visiteEntity.id,
        actif: 0,
      },
    });

    if (visiteStatutZero.length > 0) {
      for (let i = 0; i < visiteStatutZero.length; i++) {
        const statut = visiteStatutZero[i];
        statut.actif = 1;
        await manager.save(statut);
      }
    }

    statutVisiteEntity = await manager.save(statutVisiteEntity);
    
    return visites;
  }

  //Fonction Annuler visite
  async rejeterVisite(manager: EntityManager, visite: any, user: any) {
    // console.log(user);
    
    const visiteEntity = new VisiteEntity({
      ...visite,
      motif: visite.motifs.id,
      empty1: visite.empty1
    });

    const visites = await manager.save(visiteEntity);

    let statutVisiteEntity = new StatutVisiteEntity({
      empty1: null,
      empty2: null,
      empty3: null,
      geler: 0,
      dateCreation: new Date().toDateString(),
      idusrcreation: 1,
      visite: visiteEntity.id,
      statut: 3,
      actif: 0,
    });

    const visiteStatutZero = await manager.find(StatutVisiteEntity, {
      where: {
        visite: visiteEntity.id,
        actif: 0,
      },
    });

    if (visiteStatutZero.length > 0) {
      for (let i = 0; i < visiteStatutZero.length; i++) {
        const statut = visiteStatutZero[i];
        statut.actif = 1;
        await manager.save(statut);
      }
    }

    statutVisiteEntity = await manager.save(statutVisiteEntity);

    // console.log(statutVisiteEntity)
    return visites;
  }

  // async SupprimerVisiteAttente(manager: EntityManager, visite: any) {
  //   let visiteEntity = new VisiteEntity({
  //     ...visite,
  //   });

  //   visiteEntity = await manager.save(visiteEntity);
  //   return visiteEntity;
  // }
}
