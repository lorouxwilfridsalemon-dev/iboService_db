import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { DetailAchatEntity } from '../../database/detail_achat/detail_achat.entity';

@Injectable()
export class EtatMetierService {
  constructor(
    private readonly entityManager: EntityManager,
  ) {}

  /**
   * Récupère les statistiques de ventes pour un jour spécifique
   * @param date Date au format YYYY-MM-DD (ex: "2025-11-01")
   * @returns Statistiques du jour avec liste des ventes
   */
  async getEtatJour(date: string) {
    // ÉTAPE 1 : Convertir la date en objet Date
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0); // Début de la journée (00:00:00)
    const dateDebut = new Date(dateObj);
    const dateFin = new Date(dateObj);
    dateFin.setHours(23, 59, 59, 999); // Fin de la journée (23:59:59)

    // ÉTAPE 2 : Récupérer tous les détails de vente pour ce jour avec QueryBuilder
    const details = await this.entityManager
      .createQueryBuilder(DetailAchatEntity, 'detail')
      .where('detail.date >= :dateDebut AND detail.date <= :dateFin', {
        dateDebut: dateDebut,
        dateFin: dateFin
      })
      .leftJoinAndSelect('detail.achat', 'achat')
      .leftJoinAndSelect('detail.produit', 'produit')
      .getMany();

    // ÉTAPE 3 : Grouper les détails par achat
    // Chaque achat = une ligne dans le tableau
    const resultats = {};

    // Parcourir tous les détails
    for (const detail of details) {
      const achatId = detail.achat.id; // ID de l'achat

      // Si c'est la première fois qu'on voit cet achat, on crée une entrée
      if (!resultats[achatId]) {
        resultats[achatId] = {
          date: this.formatDate(detail.date),
          totalPoids: 0,
          prixKg: detail.prixKg,
          nombrePesees: 0,
          montant: 0
        };
      }

      // Ajouter les données de ce détail à l'achat
      resultats[achatId].totalPoids += parseFloat(detail.poids.toString());
      resultats[achatId].nombrePesees += 1;
      resultats[achatId].montant += detail.montant;
    }

    // ÉTAPE 4 : Convertir l'objet en tableau
    const liste = [];
    for (const achatId in resultats) {
      liste.push(resultats[achatId]);
    }

    // ÉTAPE 5 : Calculer les totaux
    let totalPoids = 0;
    let totalVentes = 0;

    for (const item of liste) {
      totalPoids += item.totalPoids;
      totalVentes += item.montant;
    }

    // ÉTAPE 6 : Retourner le résultat
    return {
      success: true,
      data: {
        periode: date,
        liste: liste,
        totalPoids: parseFloat(totalPoids.toFixed(1)),
        totalVentes: totalVentes,
        nombreItems: liste.length
      }
    };
  }

  /**
   * Récupère les statistiques de ventes pour une semaine
   * @param date Date de début de la semaine au format YYYY-MM-DD
   * @returns Statistiques de la semaine avec liste par jour
   */
  async getEtatSemaine(date: string) {
    // ÉTAPE 1 : Calculer le début et la fin de la semaine
    const dateObj = new Date(date);
    const jourSemaine = dateObj.getDay(); // 0 = dimanche, 1 = lundi, etc.

    // Trouver le lundi de cette semaine
    const dateDebut = new Date(dateObj);
    dateDebut.setDate(dateObj.getDate() - jourSemaine + 1); // +1 car lundi = 1
    dateDebut.setHours(0, 0, 0, 0);

    // Trouver le dimanche de cette semaine
    const dateFin = new Date(dateDebut);
    dateFin.setDate(dateDebut.getDate() + 6);
    dateFin.setHours(23, 59, 59, 999);

    // ÉTAPE 2 : Récupérer tous les détails de vente pour cette semaine avec QueryBuilder
    const details = await this.entityManager
      .createQueryBuilder(DetailAchatEntity, 'detail')
      .where('detail.date >= :dateDebut AND detail.date <= :dateFin', {
        dateDebut: dateDebut,
        dateFin: dateFin
      })
      .leftJoinAndSelect('detail.achat', 'achat')
      .leftJoinAndSelect('detail.produit', 'produit')
      .getMany();

    // ÉTAPE 3 : Grouper par jour de la semaine
    const resultats = {};
    const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    for (const detail of details) {
      const dateDetail = new Date(detail.date);
      const jourNom = joursSemaine[dateDetail.getDay()];
      const dateKey = this.formatDate(detail.date);

      // Si c'est la première fois qu'on voit ce jour, on crée une entrée
      if (!resultats[dateKey]) {
        resultats[dateKey] = {
          jour: jourNom,
          date: dateKey,
          totalPoids: 0,
          prixKg: detail.prixKg,
          nombrePesees: 0,
          montant: 0
        };
      }

      // Ajouter les données de ce détail au jour
      resultats[dateKey].totalPoids += parseFloat(detail.poids.toString());
      resultats[dateKey].nombrePesees += 1;
      resultats[dateKey].montant += detail.montant;
    }

    // ÉTAPE 4 : Convertir en tableau
    const liste = [];
    for (const dateKey in resultats) {
      liste.push(resultats[dateKey]);
    }

    // ÉTAPE 5 : Calculer les totaux
    let totalPoids = 0;
    let totalVentes = 0;

    for (const item of liste) {
      totalPoids += item.totalPoids;
      totalVentes += item.montant;
    }

    // ÉTAPE 6 : Retourner le résultat
    return {
      success: true,
      data: {
        periode: `Semaine du ${this.formatDate(dateDebut)} au ${this.formatDate(dateFin)}`,
        liste: liste,
        totalPoids: parseFloat(totalPoids.toFixed(1)),
        totalVentes: totalVentes,
        nombreItems: liste.length
      }
    };
  }

  /**
   * Récupère les statistiques de ventes pour un mois
   * @param mois Mois (1-12)
   * @param annee Année (ex: 2025)
   * @returns Statistiques du mois avec liste par jour
   */
  async getEtatMois(mois: number, annee: number) {
    // ÉTAPE 1 : Calculer le début et la fin du mois
    const dateDebut = new Date(annee, mois - 1, 1); // mois - 1 car janvier = 0
    const dateFin = new Date(annee, mois, 0, 23, 59, 59, 999); // Dernier jour du mois

    // ÉTAPE 2 : Récupérer tous les détails de vente pour ce mois avec QueryBuilder
    const details = await this.entityManager
      .createQueryBuilder(DetailAchatEntity, 'detail')
      .where('detail.date >= :dateDebut AND detail.date <= :dateFin', {
        dateDebut: dateDebut,
        dateFin: dateFin
      })
      .leftJoinAndSelect('detail.achat', 'achat')
      .leftJoinAndSelect('detail.produit', 'produit')
      .getMany();

    // ÉTAPE 3 : Grouper par jour
    const resultats = {};

    for (const detail of details) {
      const dateKey = this.formatDate(detail.date);

      // Si c'est la première fois qu'on voit ce jour, on crée une entrée
      if (!resultats[dateKey]) {
        resultats[dateKey] = {
          date: dateKey,
          totalPoids: 0,
          prixKg: detail.prixKg,
          nombrePesees: 0,
          montant: 0
        };
      }

      // Ajouter les données de ce détail au jour
      resultats[dateKey].totalPoids += parseFloat(detail.poids.toString());
      resultats[dateKey].nombrePesees += 1;
      resultats[dateKey].montant += detail.montant;
    }

    // ÉTAPE 4 : Convertir en tableau et trier par date
    const liste = [];
    for (const dateKey in resultats) {
      liste.push(resultats[dateKey]);
    }

    // Trier par date (du plus ancien au plus récent)
    liste.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });

    // ÉTAPE 5 : Calculer les totaux
    let totalPoids = 0;
    let totalVentes = 0;

    for (const item of liste) {
      totalPoids += item.totalPoids;
      totalVentes += item.montant;
    }

    // ÉTAPE 6 : Nom du mois
    const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    // ÉTAPE 7 : Retourner le résultat
    return {
      success: true,
      data: {
        periode: `${moisNoms[mois - 1]} ${annee}`,
        liste: liste,
        totalPoids: parseFloat(totalPoids.toFixed(1)),
        totalVentes: totalVentes,
        nombreItems: liste.length
      }
    };
  }

  /**
   * Récupère les statistiques de ventes pour une année
   * @param annee Année (ex: 2025)
   * @returns Statistiques de l'année avec liste par mois
   */
  async getEtatAnnee(annee: number) {
    // ÉTAPE 1 : Calculer le début et la fin de l'année
    const dateDebut = new Date(annee, 0, 1); // 1er janvier
    const dateFin = new Date(annee, 11, 31, 23, 59, 59, 999); // 31 décembre

    // ÉTAPE 2 : Récupérer tous les détails de vente pour cette année avec QueryBuilder
    const details = await this.entityManager
      .createQueryBuilder(DetailAchatEntity, 'detail')
      .where('detail.date >= :dateDebut AND detail.date <= :dateFin', {
        dateDebut: dateDebut,
        dateFin: dateFin
      })
      .leftJoinAndSelect('detail.achat', 'achat')
      .leftJoinAndSelect('detail.produit', 'produit')
      .getMany();

    // ÉTAPE 3 : Grouper par mois
    const resultats = {};
    const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    for (const detail of details) {
      const dateDetail = new Date(detail.date);
      const mois = dateDetail.getMonth() + 1; // +1 car janvier = 0
      const moisNom = moisNoms[dateDetail.getMonth()];

      // Si c'est la première fois qu'on voit ce mois, on crée une entrée
      if (!resultats[mois]) {
        resultats[mois] = {
          mois: moisNom,
          totalPoids: 0,
          prixKg: detail.prixKg,
          nombrePesees: 0,
          montant: 0
        };
      }

      // Ajouter les données de ce détail au mois
      resultats[mois].totalPoids += parseFloat(detail.poids.toString());
      resultats[mois].nombrePesees += 1;
      resultats[mois].montant += detail.montant;
    }

    // ÉTAPE 4 : Convertir en tableau et trier par mois
    const liste = [];
    for (const mois in resultats) {
      liste.push(resultats[mois]);
    }

    // Trier par mois (janvier, février, mars, etc.)
    liste.sort((a, b) => {
      const indexA = moisNoms.indexOf(a.mois);
      const indexB = moisNoms.indexOf(b.mois);
      return indexA - indexB;
    });

    // ÉTAPE 5 : Calculer les totaux
    let totalPoids = 0;
    let totalVentes = 0;

    for (const item of liste) {
      totalPoids += item.totalPoids;
      totalVentes += item.montant;
    }

    // ÉTAPE 6 : Retourner le résultat
    return {
      success: true,
      data: {
        periode: annee.toString(),
        liste: liste,
        totalPoids: parseFloat(totalPoids.toFixed(1)),
        totalVentes: totalVentes,
        nombreItems: liste.length
      }
    };
  }

  /**
   * Formate une date au format DD/MM/YYYY
   * @param date Date à formater
   * @returns Date formatée
   */
  private formatDate(date: Date | string): string {
    const d = new Date(date);
    const jour = String(d.getDate()).padStart(2, '0'); // Ajoute un 0 devant si < 10
    const mois = String(d.getMonth() + 1).padStart(2, '0'); // +1 car janvier = 0
    const annee = d.getFullYear();
    return `${jour}/${mois}/${annee}`;
  }
}
