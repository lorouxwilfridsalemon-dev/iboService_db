import { Injectable } from '@nestjs/common';
import { EntityManager, getManager } from 'typeorm';
import { AchatEntity } from '../../database/achat/achat.entity';
import { DetailAchatEntity } from '../../database/detail_achat/detail_achat.entity';
import { ClientEntity } from '../../database/client/client.entity';
import { ProduitEntity } from '../../database/produit/produit.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { TypeClientEntity } from '../../database/type_client/type_client.entity';
import { get } from 'http';


@Injectable()
export class VenteMetierService {

  constructor(
    private readonly entityManager: EntityManager,
  ) { }


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
      // ÉTAPE 2 : Charger utilisateur
      const utilisateur = await entityManager.findOne(UtilisateurEntity, {
        where: { id: venteData.utilisateurId }
      });

      // ÉTAPE 3 : Calculer le montant total
      // On doit d'abord charger les produits pour obtenir leurs prixKg
      let montantTotal = 0;
      for (const element of venteData.details) {
        // Charger le produit pour obtenir son prixKg
        const produit = await entityManager.findOne(ProduitEntity, {
          where: { id: element.produitId }
        });
        // Utiliser le prixKg du produit depuis la base de données
        const prixKg = produit.prixKg || 0; // Si prixKg est null, utiliser 0
        montantTotal += element.poids * prixKg;
      }

      // ÉTAPE 4 : Créer l'achat

      const now = new Date();

      const achat = entityManager.create(AchatEntity, {
        client: client,
        utilisateur: utilisateur,
        montantTotal: montantTotal,
        geler: 0,
        dateCreation: now,
        idusrcreation: utilisateur.id
      });

      const achatSauvegarde = await entityManager.save(AchatEntity, achat);

      // ÉTAPE 5 : Créer les détails

      const detailsCrees = [];

      for (const element of venteData.details) {
        // Charger le produit pour obtenir son prixKg
        const produit = await entityManager.findOne(ProduitEntity, {
          where: { id: element.produitId }
        });

        // Utiliser le prixKg du produit depuis la base de données
        const prixKg = produit.prixKg || 0; // Si prixKg est null, utiliser 0

        // Calculer le montant (poids × prixKg du produit)
        const montant = element.poids * prixKg;

        // Créer le détail
        // Note: prixKg n'est plus stocké dans DetailAchatEntity, il est dans ProduitEntity
        const detail = entityManager.create(DetailAchatEntity, {
          achat: achatSauvegarde,
          produit: produit,
          poids: element.poids,
          montant: montant,
          dateCreation: now
        });

        const detailSauvegarde = await entityManager.save(DetailAchatEntity, detail);

        detailsCrees.push({
          produit: produit.libelle,
          poids: detailSauvegarde.poids,
          prixKg: prixKg, // Prix utilisé (depuis le produit)
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
  async venteParJour(query: any) {
    const manager = getManager();
    const { dateJour } = query;

    const ventesDuJour = await manager.createQueryBuilder(AchatEntity, 'achat')
      .select([
        "achat",
        "client",
        "typeClient",
        "detailAchat",
        "produit",
        "utilisateur"
      ])
      .leftJoin("achat.utilisateur", "utilisateur")
      .leftJoin("achat.client", "client")
      .leftJoin("client.typeClient", "typeClient")
      .leftJoin("achat.detailsAchat", "detailAchat")
      .leftJoin("detailAchat.produit", "produit")
      .where('achat.geler = 0')
      .andWhere('TO_DAYS(achat.dateCreation) = TO_DAYS(:dateJour)', { dateJour })
      .getMany();

    // Ajouter le nombre de pesées pour chaque vente
    const resultatsAvecPesees = ventesDuJour.map(achat => {
      // Compter le nombre de pesées (détails d'achat)
      const nombrePesees = achat.detailsAchat?.length || 0;

      // Retourner l'achat avec la propriété nombrePesees ajoutée
      return {
        ...achat,
        nombrePesees: nombrePesees
      };
    });

    return resultatsAvecPesees;
  }

  async venteParMois(query: any) {
    const manager = getManager();
    const { mois, annee } = query;

    const moisInt = parseInt(mois);
    const anneeInt = parseInt(annee);

    const ventesDuMois = await manager.createQueryBuilder(AchatEntity, 'achat')
      .select([
        "achat",
        "client",
        "typeClient",
        "detailAchat",
        "produit",
        "utilisateur"
      ])
      .leftJoin("achat.utilisateur", "utilisateur")
      .leftJoin("achat.client", "client")
      .leftJoin("client.typeClient", "typeClient")
      .leftJoin("achat.detailsAchat", "detailAchat")
      .leftJoin("detailAchat.produit", "produit")
      .where('achat.geler = 0')
      .andWhere('MONTH(achat.dateCreation) = :mois', { mois: moisInt })
      .andWhere('YEAR(achat.dateCreation) = :annee', { annee: anneeInt })
      .getMany();

    // Ajouter le nombre de pesées pour chaque vente
    const resultatsAvecPesees = ventesDuMois.map(achat => {
      // Compter le nombre de pesées (détails d'achat)
      const nombrePesees = achat.detailsAchat?.length || 0;

      // Retourner l'achat avec la propriété nombrePesees ajoutée
      return {
        ...achat,
        nombrePesees: nombrePesees
      };
    });

    return resultatsAvecPesees;
  }

  async venteParAnnee(query: any) {
    const manager = getManager();
    const { annee } = query;

    const anneeInt = parseInt(annee, 10);

    const ventesDeLAnnee = await manager.createQueryBuilder(AchatEntity, 'achat')
      .select([
        "achat",
        "client",
        "typeClient",
        "detailAchat",
        "produit",
        "utilisateur"
      ])
      .leftJoin("achat.utilisateur", "utilisateur")
      .leftJoin("achat.client", "client")
      .leftJoin("client.typeClient", "typeClient")
      .leftJoin("achat.detailsAchat", "detailAchat")
      .leftJoin("detailAchat.produit", "produit")
      .where('achat.geler = 0')
      .andWhere('YEAR(achat.dateCreation) = :annee', { annee: anneeInt })
      .getMany();

    // Ajouter le nombre de pesées pour chaque vente
    const resultatsAvecPesees = ventesDeLAnnee.map(achat => {
      // Compter le nombre de pesées (détails d'achat)
      const nombrePesees = achat.detailsAchat?.length || 0;

      // Retourner l'achat avec la propriété nombrePesees ajoutée
      return {
        ...achat,
        nombrePesees: nombrePesees
      };
    });

    return resultatsAvecPesees;



  }

}
