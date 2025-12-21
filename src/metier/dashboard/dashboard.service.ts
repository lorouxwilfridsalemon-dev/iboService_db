import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { AchatEntity } from '../../database/achat/achat.entity';

@Injectable()
export class DashboardMetierService {
  
  constructor() {}

  async statistiquesParJour(query: any) {
    const manager = getManager();
    const { dateJour } = query;

    const resultat = await manager.createQueryBuilder(AchatEntity, 'achat')
      .select('SUM(achat.poidsTotal)', 'poidsTotal')
      .addSelect('SUM(achat.montantTotal)', 'montantTotal')
      .where('achat.geler = 0')
      .andWhere('TO_DAYS(achat.dateCreation) = TO_DAYS(:dateJour)', { dateJour })
      .getRawOne();

    return {
      poidsTotal: parseFloat(resultat.poidsTotal) || 0,
      montantTotal: parseFloat(resultat.montantTotal) || 0,
      date: dateJour
    };
  }

  async statistiquesParSemaine(query: any) {
    const manager = getManager();
    const { date } = query;

    const resultat = await manager.createQueryBuilder(AchatEntity, 'achat')
      .select('SUM(achat.poidsTotal)', 'poidsTotal')
      .addSelect('SUM(achat.montantTotal)', 'montantTotal')
      .where('achat.geler = 0')
      .andWhere('WEEK(achat.dateCreation, 1) = WEEK(:date, 1)', { date })
      .andWhere('YEAR(achat.dateCreation) = YEAR(:date)', { date })
      .getRawOne();

    return {
      poidsTotal: parseFloat(resultat.poidsTotal) || 0,
      montantTotal: parseFloat(resultat.montantTotal) || 0,
      date: date
    };
  }

  async statistiquesParMois(query: any) {
    const manager = getManager();
    const { mois, annee } = query;

    const moisInt = parseInt(mois);
    const anneeInt = parseInt(annee);

    const resultat = await manager.createQueryBuilder(AchatEntity, 'achat')
      .select('SUM(achat.poidsTotal)', 'poidsTotal')
      .addSelect('SUM(achat.montantTotal)', 'montantTotal')
      .where('achat.geler = 0')
      .andWhere('MONTH(achat.dateCreation) = :mois', { mois: moisInt })
      .andWhere('YEAR(achat.dateCreation) = :annee', { annee: anneeInt })
      .getRawOne();

    return {
      poidsTotal: parseFloat(resultat.poidsTotal) || 0,
      montantTotal: parseFloat(resultat.montantTotal) || 0,
      mois: moisInt,
      annee: anneeInt
    };
  }

  async statistiquesParAnnee(query: any) {
    const manager = getManager();
    const { annee } = query;

    const anneeInt = parseInt(annee);

    const resultat = await manager.createQueryBuilder(AchatEntity, 'achat')
      .select('SUM(achat.poidsTotal)', 'poidsTotal')
      .addSelect('SUM(achat.montantTotal)', 'montantTotal')
      .where('achat.geler = 0')
      .andWhere('YEAR(achat.dateCreation) = :annee', { annee: anneeInt })
      .getRawOne();

    return {
      poidsTotal: parseFloat(resultat.poidsTotal) || 0,
      montantTotal: parseFloat(resultat.montantTotal) || 0,
      annee: anneeInt
    };
  }

}

