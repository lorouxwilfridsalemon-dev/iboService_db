import { Injectable } from '@nestjs/common';
import { EntityManager, getManager } from 'typeorm';
import { AchatEntity } from '../../database/achat/achat.entity';
import { DetailAchatEntity } from '../../database/detail_achat/detail_achat.entity';
import { ClientEntity } from '../../database/client/client.entity';
import { ProduitEntity } from '../../database/produit/produit.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { TypeClientEntity } from '../../database/type_client/type_client.entity';
import { ModalitePaiementEntity } from '../../database/modalite_paiement/modalite_paiement.entity';


@Injectable()
export class VenteMetierService {

  constructor(
    private readonly entityManager: EntityManager,
  ) { }


  async creerVente(venteData: any) {
    return await this.entityManager.transaction(async (entityManager) => {
      
      // ============================================
      // ÉTAPE 1 : DÉTERMINER LE TYPE DE CLIENT
      // ============================================
      // Charger le type "Gros Client" pour comparaison
      const typeGrosClient = await entityManager.findOne(TypeClientEntity, {
        where: { libelle: 'Gros Client' }
      });

      // Vérifier si le type client sélectionné est "Gros Client"
      const isGrosClient = typeGrosClient && (venteData.clientTypeClient === typeGrosClient.id);

      // ============================================
      // ÉTAPE 2 : OBTENIR LE CLIENT
      // ============================================
      let client: ClientEntity;

      if (isGrosClient) {
        // Gros client : charger par ID (client déjà sélectionné dans la liste)
        client = await entityManager.findOne(ClientEntity, {
          where: { id: venteData.clientId }
        });

        if (!client) {
          throw new Error('Client gros client introuvable');
        }
        console.log(`Gros client sélectionné: ${client.nomPrenom}`);
      } else {
        // Client normal : chercher par numéro ou créer
        client = await entityManager.findOne(ClientEntity, {
          where: { numero: venteData.clientNumero }
        });

        if (!client) {
          console.log(`Nouveau client normal: ${venteData.clientNom}`);

          // Charger le type de client normal
          const typeClientNormal = await entityManager.findOne(TypeClientEntity, {
            where: { id: venteData.clientTypeClient }
          });

          // Créer le client
          client = entityManager.create(ClientEntity, {
            nomPrenom: venteData.clientNom,
            numero: venteData.clientNumero,
            typeClient: typeClientNormal,
            geler: 0,
            dateCreation: new Date(),
            idusrcreation: venteData.utilisateurId
          });

          client = await entityManager.save(ClientEntity, client);
        } else {
          console.log(`Client normal existant: ${client.nomPrenom}`);
        }
      }

      // ============================================
      // ÉTAPE 3 : CHARGER L'UTILISATEUR
      // ============================================
      const utilisateur = await entityManager.findOne(UtilisateurEntity, {
        where: { id: venteData.utilisateurId }
      });

      // ============================================
      // ÉTAPE 4 : CHARGER LE PRODUIT (THON)
      // ============================================
      // Puisqu'il n'y a qu'un seul produit (thon), on le charge une seule fois
      const produit = await entityManager.findOne(ProduitEntity, {
        where: { id: venteData.details[0].produitId }
      });

      if (!produit) {
        throw new Error('Produit introuvable');
      }

      // ============================================
      // ÉTAPE 5 : CALCULER LE POIDS TOTAL
      // ============================================
      // Additionner tous les poids de toutes les pesées
      let poidsTotal = 0;
      for (const element of venteData.details) {
        poidsTotal += element.poids;
      }
      // Exemple : 500 + 600 + 200 = 1300 kg

      // ============================================
      // ÉTAPE 6 : CALCULER LE PRIX AU KG
      // ============================================
      let prixKg = 0;

      if (isGrosClient) {
        // Gros client : prix fixe (pas de réduction)
        prixKg = produit.prixKgGrosClient || produit.prixKg || 0;
      } else {
        // Client normal : prix selon poids total
        if (poidsTotal >= 3000) {
          // 3 tonnes ou plus
          prixKg = produit.prixKg3Tonnes || produit.prixKg || 0;
        } else if (poidsTotal >= 1000) {
          // 1 tonne ou plus
          prixKg = produit.prixKg1Tonne || produit.prixKg || 0;
        } else {
          // Moins de 1 tonne : prix de base
          prixKg = produit.prixKg || 0;
        }
      }

      // ============================================
      // ÉTAPE 7 : CALCULER LE MONTANT TOTAL
      // ============================================
      const montantTotal = poidsTotal * prixKg;
      // Exemple : 1300 kg × 2750 FCFA/kg = 3 575 000 FCFA

      // ============================================
      // ÉTAPE 8 : GÉRER LE PAIEMENT
      // ============================================
      const montantPaye = venteData.montantPaye || 0;
      const solde = montantTotal - montantPaye;

      // Charger la modalité de paiement "Espèces"
      const modalitePaiement = await entityManager.findOne(ModalitePaiementEntity, {
        where: { libelle: 'Espèces' }
      });

      // ============================================
      // ÉTAPE 9 : CRÉER L'ACHAT
      // ============================================
      const now = new Date();

      const achat = entityManager.create(AchatEntity, {
        client: client,
        utilisateur: utilisateur,
        montantTotal: montantTotal,
        montantPaye: montantPaye,
        solde: solde,
        modalitePaiement: modalitePaiement,
        geler: 0,
        dateCreation: now,
        idusrcreation: utilisateur.id
      });

      const achatSauvegarde = await entityManager.save(AchatEntity, achat);

      // ============================================
      // ÉTAPE 10 : CRÉER LES DÉTAILS (PESÉES)
      // ============================================
      const detailsCrees = [];

      for (const element of venteData.details) {
        // Toutes les pesées utilisent le même prixKg calculé
        const montant = element.poids * prixKg;

        const detail = entityManager.create(DetailAchatEntity, {
          achat: achatSauvegarde,
          produit: produit,  // Même produit (thon) pour toutes les pesées
          poids: element.poids,
          montant: montant,
          dateCreation: now
        });

        const detailSauvegarde = await entityManager.save(DetailAchatEntity, detail);

        detailsCrees.push({
          produit: produit.libelle,
          poids: detailSauvegarde.poids,
          prixKg: prixKg,
          montant: detailSauvegarde.montant
        });
      }

      // ============================================
      // ÉTAPE 11 : RETOURNER LE RÉSULTAT
      // ============================================
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
          montantPaye: achatSauvegarde.montantPaye,
          solde: achatSauvegarde.solde,
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

    const anneeInt = parseInt(annee);

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




