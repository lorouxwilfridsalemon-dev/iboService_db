import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { AchatEntity } from '../../database/achat/achat.entity';
import { DetailAchatEntity } from '../../database/detail_achat/detail_achat.entity';
import { ClientEntity } from '../../database/client/client.entity';
import { ProduitEntity } from '../../database/produit/produit.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { SupportEntity } from '../../database/support/support.entity';
import { TypeClientEntity } from '../../database/type_client/type_client.entity';

/**
 * SERVICE DE VENTE - LOGIQUE SIMPLE
 * 
 * Workflow :
 * 1. Chercher ou créer le client
 * 2. Créer la vente (achat + détails)
 * 3. Tout en transaction (automatique)
 */
@Injectable()
export class VenteMetierService {

  constructor(
    private readonly entityManager: EntityManager,
  ) { }

  /**
   * CRÉER UNE VENTE
   * 
   * C'est la fonction principale qui fait tout
   */
  async creerVente(venteData: any) {
    return await this.entityManager.transaction(async (entityManager) => {
      // ÉTAPE 1 : Gérer le client
      // Chercher si le client existe déjà (par numéro)
      let client = await entityManager.findOne(ClientEntity, {
        where: { numero: venteData.clientNumero }
      });

      // Si pas trouvé → créer un nouveau client
      if (!client) {
        console.log(`Nouveau client: ${venteData.clientNom}`);

        // Charger le type de client
        const typeClient = await entityManager.findOne(TypeClientEntity, {
          where: { id: venteData.clientTypeClient }
        });

        // Créer le client
        client = entityManager.create(ClientEntity, {
          nomPrenom: venteData.clientNom,
          numero: venteData.clientNumero,
          typeClient: typeClient,
          geler: 0,
          dateCreation: new Date(),
          idusrcreation: venteData.utilisateurId
        });

        client = await entityManager.save(ClientEntity, client);
      } else {
        console.log(`Client existant: ${client.nomPrenom}`);
      }
      // ÉTAPE 2 : Charger utilisateur et support
      const utilisateur = await entityManager.findOne(UtilisateurEntity, {
        where: { id: venteData.utilisateurId }
      });

      let support = null;
      if (venteData.supportId) {
        support = await entityManager.findOne(SupportEntity, {
          where: { id: venteData.supportId }
        });
      }
      // ÉTAPE 3 : Calculer le montant total
      let montantTotal = 0;
      for (const detail of venteData.details) {
        montantTotal += detail.poids * detail.prixKg;
      }
      montantTotal = Math.round(montantTotal * 100) / 100;

      // ÉTAPE 4 : Créer l'achat

      const now = new Date();
      const achat = entityManager.create(AchatEntity, {
        client: client,
        utilisateur: utilisateur,
        support: support,
        montantTotal: montantTotal,
        date: now,
        heure: now.toTimeString().split(' ')[0],
        geler: 0,
        dateCreation: now,
        idusrcreation: utilisateur.id
      });

      const achatSauvegarde = await entityManager.save(AchatEntity, achat);

      // ÉTAPE 5 : Créer les détails

      const detailsCrees = [];

      for (const element of venteData.details) {
        // Charger le produit
        const produit = await entityManager.findOne(ProduitEntity, {
          where: { id: element.produitId }
        });

        // Calculer le montant
        const montant = Math.round(element.poids * element.prixKg * 100) / 100;

        // Créer le détail
        const detail = entityManager.create(DetailAchatEntity, {
          achat: achatSauvegarde,
          produit: produit,
          poids: element.poids,
          prixKg: element.prixKg,
          montant: montant,
          date: now,
          heure: now
        });

        const detailSauvegarde = await entityManager.save(DetailAchatEntity, detail);

        detailsCrees.push({
          produit: produit.libelle,
          poids: detailSauvegarde.poids,
          prixKg: detailSauvegarde.prixKg,
          montant: detailSauvegarde.montant
        });
      }

      // ÉTAPE 6 : Retourner le résultat      
      return {
        success: true,
        message: 'Vente créée avec succès',
        data: {
          venteId: achatSauvegarde.id,
          client: {
            id: client.id,
            nom: client.nomPrenom,
            numero: client.numero
          },
          montantTotal: achatSauvegarde.montantTotal,
          nombrePesees: detailsCrees.length,
          details: detailsCrees
        }
      };
    });
  }
}
