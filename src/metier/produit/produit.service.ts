import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ProduitEntity } from '../../database/produit/produit.entity';
import { HistoriqueProduitEntity } from '../../database/historique_produit/historique_produit.entity';

@Injectable()
export class ProduitMetierService {
  constructor(
    private readonly entityManager: EntityManager,
  ) { }

  
  async historiserProduit(produitId: number, idusrcreation: number) {
    // Charger le produit courant par son ID
    const produit = await this.entityManager.findOne(ProduitEntity, {
      where: { id: produitId },
    });

    // Si aucun produit trouvé une erreur simple
    if (!produit) {
      throw new Error('Produit introuvable pour historisation');
    }

    // Préparer l’objet d’historique
    const maintenant = new Date();

    const historique = this.entityManager.create(HistoriqueProduitEntity, {
      // relation vers le produit d’origine
      produit: produit,

      // copie des champs du produit au moment T
      libelle: produit.libelle,
      prixKg: produit.prixKg,
      prixKgPalier1: produit.prixKgPalier1,
      prixKgPalier2: produit.prixKgPalier2,

      // champs libres si tu veux les utiliser plus tard
      empty1: produit.empty1,
      empty2: produit.empty2,
      empty3: produit.empty3,

      geler: produit.geler,
      dateCreation: maintenant,
      idusrcreation: idusrcreation,
    });

    // Sauvegarder l’historique en base
    const historiqueSauvegarde = await this.entityManager.save(HistoriqueProduitEntity, historique);

    // On retourne un objet simple pour le front
    return {
      success: true,
      message: 'Historique produit créé avec succès',
      data: historiqueSauvegarde,
    };
  }
}


