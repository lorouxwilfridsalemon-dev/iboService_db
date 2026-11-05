import { Injectable } from '@nestjs/common';
import { EntityManager, getManager } from 'typeorm';
import { AchatEntity } from '../../database/achat/achat.entity';
import { DetailAchatEntity } from '../../database/detail_achat/detail_achat.entity';
import { ClientEntity } from '../../database/client/client.entity';
import { ProduitEntity } from '../../database/produit/produit.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { TypeClientEntity } from '../../database/type_client/type_client.entity';
import { ModalitePaiementEntity } from '../../database/modalite_paiement/modalite_paiement.entity';
import { PaiementEntity } from '../../database/paiement/paiement.entity';


@Injectable()
export class VenteMetierService {

  constructor(
    private readonly entityManager: EntityManager,
  ) { }


  // async creerVente(venteData: any) {
  //   return await this.entityManager.transaction(async (entityManager) => {

  //     console.log('Données du front', venteData);



  //     // ÉTAPE 1 : DÉTERMINER LE TYPE DE CLIENT (AVEC BOOLÉEN)


  //     // IDs fixes : id=1 = Client Normal, id=2 = Gros Client
  //     const CLIENT_NORMAL_ID = 1;
  //     const GROS_CLIENT_ID = 2;

  //     // Le frontend envoie un booléen au lieu d'un ID

  //     const isGrosClient = venteData.isGrosClient == true;

  //     // ÉTAPE 2 : OBTENIR LE CLIENT

  //     let client: ClientEntity;

  //     if (isGrosClient) {
  //       //  GROS CLIENT 
  //       // Vérifier que clientId est présent
  //       if (!venteData.clientId) {
  //         throw new Error('clientId est obligatoire pour un gros client');
  //       }

  //       // Gros client : charger par ID (client déjà sélectionné dans la liste)
  //       client = await entityManager.findOne(ClientEntity, {
  //         where: { id: venteData.clientId }
  //       });

  //       if (!client) {
  //         throw new Error('Client gros client introuvable');
  //       }
  //       console.log(`Gros client sélectionné: ${client.nomPrenom}`);

  //     } else {
  //       //  CLIENT NORMAL
  //       // Vérifier que clientNumero est présent
  //       if (!venteData.clientNumero) {
  //         throw new Error('clientNumero est obligatoire pour un client normal');
  //       }

  //       // Chercher le client par numéro
  //       const verifContactClient: any = await entityManager.findOne(ClientEntity, {
  //         where: { numero: venteData.clientNumero }
  //       });

  //       if (verifContactClient.length == 0) {
  //         // Client n'existe pas → créer
  //         console.log(`Nouveau client normal: ${venteData.clientNom}`);

  //         // Charger le type "Client Normal" (ID fixe = 1)
  //         const typeClientNormal = await entityManager.findOne(TypeClientEntity, {
  //           where: { id: CLIENT_NORMAL_ID }
  //         });

  //         // Créer le client
  //         let newClient = entityManager.create(ClientEntity, {
  //           nomPrenom: venteData.clientNom || 'Client sans nom',
  //           numero: venteData.clientNumero,
  //           typeClient: typeClientNormal,
  //           geler: 0,
  //           dateCreation: new Date(),
  //           idusrcreation: venteData.utilisateurId
  //         });

  //         newClient = await entityManager.save(ClientEntity, newClient);
  //         console.log(`Client normal créé: ${newClient.nomPrenom}`);

  //       } else {
  //         // Client existe → utiliser
  //         console.log(`Client normal existant `);
  //       }
  //     }

  //     // ÉTAPE 3 : CHARGER L'UTILISATEUR

  //     const utilisateur = await entityManager.findOne(UtilisateurEntity, {
  //       where: { id: venteData.utilisateurId }
  //     });

  //     // ÉTAPE 4 : CHARGER LE PRODUIT (THON)

  //     // Puisqu'il n'y a qu'un seul produit (thon), on le charge une seule fois
  //     const produit = await entityManager.findOne(ProduitEntity, {
  //       where: { id: venteData.details[0].produitId }
  //     });

  //     if (!produit) {
  //       throw new Error('Produit introuvable');
  //     }
  //     // ÉTAPE 5 : CALCULER LE POIDS TOTAL

  //     // Additionner tous les poids de toutes les pesées
  //     let poidsTotal = 0;
  //     for (const element of venteData.details) {
  //       poidsTotal += element.poids;
  //     }

  //     // ÉTAPE 6 : CALCULER LE PRIX AU KG

  //     let prixKg = 0;

  //     if (isGrosClient) {
  //       // Gros client : prix fixe (pas de réduction)
  //       prixKg = produit.prixKgGrosClient;
  //     } else {
  //       // Client normal : prix selon poids total
  //       if (poidsTotal >= 3000) {
  //         // 3 tonnes ou plus
  //         prixKg = produit.prixKgPalier2;
  //       } else if (poidsTotal >= 1000) {
  //         // 1 tonne ou plus
  //         prixKg = produit.prixKgPalier1;
  //       } else {
  //         // Moins de 1 tonne : prix de base
  //         prixKg = produit.prixKg;
  //       }
  //     }


  //     // ÉTAPE 7 : CALCULER LE MONTANT TOTAL

  //     const montantTotal = poidsTotal * prixKg;



  //     // ÉTAPE 8 : GÉRER LE PAIEMENT

  //     const montantPaye = venteData.montantPaye;
  //     const solde = montantTotal - montantPaye;

  //     // Charger la modalité de paiement par ID fixe (id=1 = Espèces)

  //     const modalitePaiement = await entityManager.findOne(ModalitePaiementEntity, {
  //       where: { id: venteData.modalitePaiementId }
  //     });


  //     // ÉTAPE 9 : CRÉER L'ACHAT

  //     const now = new Date();

  //     const achat = entityManager.create(AchatEntity, {
  //       client: client,
  //       utilisateur: utilisateur,
  //       montantTotal: montantTotal,
  //       montantPaye: montantPaye,
  //       solde: solde,
  //       modalitePaiement: modalitePaiement,
  //       geler: 0,
  //       dateCreation: now,
  //       idusrcreation: utilisateur.id
  //     });

  //     const achatSauvegarde = await entityManager.save(AchatEntity, achat);

  //     // ÉTAPE 10 : CRÉER LES DÉTAILS (PESÉES)

  //     const detailsCrees = [];

  //     for (const element of venteData.details) {
  //       // Toutes les pesées utilisent le même prixKg calculé
  //       const montant = element.poids * prixKg;

  //       const detail = entityManager.create(DetailAchatEntity, {
  //         achat: achatSauvegarde,
  //         produit: produit,  // Même produit (thon) pour toutes les pesées
  //         poids: element.poids,
  //         montant: montant,
  //         dateCreation: now
  //       });

  //       const detailSauvegarde = await entityManager.save(DetailAchatEntity, detail);

  //       detailsCrees.push({
  //         produit: produit.libelle,
  //         poids: detailSauvegarde.poids,
  //         prixKg: prixKg,
  //         montant: detailSauvegarde.montant
  //       });
  //     }

  //     // ÉTAPE 11 : RETOURNER LE RÉSULTAT

  //     return {
  //       success: true,
  //       message: 'Vente créée avec succès',
  //       data: {
  //         venteId: achatSauvegarde.id,
  //         client: {
  //           id: client.id,
  //           nom: client.nomPrenom,
  //           numero: client.numero
  //         },
  //         montantTotal: achatSauvegarde.montantTotal,
  //         montantPaye: achatSauvegarde.montantPaye,
  //         solde: achatSauvegarde.solde,
  //         nombrePesees: detailsCrees.length,
  //         details: detailsCrees
  //       }
  //     };
  //   });
  // }

  // async creerVente_(venteData: any) {
  //   return await this.entityManager.transaction(async (entityManager) => {

  //     console.log('Données du front', venteData);



  //     // ÉTAPE 1 : DÉTERMINER LE TYPE DE CLIENT (AVEC BOOLÉEN)


  //     // IDs fixes : id=1 = Client Normal, id=2 = Gros Client
  //     const CLIENT_NORMAL_ID = 1;
  //     const GROS_CLIENT_ID = 2;

  //     // Le frontend envoie un booléen au lieu d'un ID

  //     const isGrosClient = venteData.isGrosClient == true;

  //     // ÉTAPE 2 : OBTENIR LE CLIENT

  //     let client: ClientEntity;

  //     if (isGrosClient) {
  //       //  GROS CLIENT 
  //       // Vérifier que clientId est présent
  //       if (!venteData.clientId) {
  //         throw new Error('clientId est obligatoire pour un gros client');
  //       }

  //       // Gros client : charger par ID (client déjà sélectionné dans la liste)
  //       client = await entityManager.findOne(ClientEntity, {
  //         where: { id: venteData.clientId }
  //       });

  //       if (!client) {
  //         throw new Error('Client gros client introuvable');
  //       }
  //       console.log(`Gros client sélectionné: ${client.nomPrenom}`);

  //     } else {
  //       //  CLIENT NORMAL
  //       // Vérifier que clientNumero est présent
  //       if (!venteData.clientNumero) {
  //         throw new Error('clientNumero est obligatoire pour un client normal');
  //       }

  //       // Chercher le client par numéro
  //       const verifContactClient: any = await entityManager.findOne(ClientEntity, {
  //         where: { numero: venteData.clientNumero }
  //       });

  //       console.log('verifContact', verifContactClient);


  //       if (verifContactClient.length == 0) {
  //         // Client n'existe pas → créer
  //         console.log(`Nouveau client normal: ${venteData.clientNom}`);

  //         // Charger le type "Client Normal" (ID fixe = 1)
  //         const typeClientNormal = await entityManager.findOne(TypeClientEntity, {
  //           where: { id: CLIENT_NORMAL_ID }
  //         });

  //         // Créer le client
  //         let newClient = entityManager.create(ClientEntity, {
  //           nomPrenom: venteData.clientNom || 'Client sans nom',
  //           numero: venteData.clientNumero,
  //           typeClient: typeClientNormal,
  //           geler: 0,
  //           dateCreation: new Date(),
  //           idusrcreation: venteData.utilisateurId
  //         });

  //         newClient = await entityManager.save(ClientEntity, newClient);
  //         console.log(`Client normal créé: ${client.nomPrenom}`);

  //         //     const utilisateur = await entityManager.findOne(UtilisateurEntity, {
  //         //   where: { id: venteData.utilisateurId }
  //         // });

  //         // ÉTAPE 4 : CHARGER LE PRODUIT (THON)

  //         // Puisqu'il n'y a qu'un seul produit (thon), on le charge une seule fois
  //         const produit = await entityManager.findOne(ProduitEntity, {
  //           where: { id: venteData.details[0].produitId }
  //         });

  //         if (!venteData.details[0].produitId) {
  //           throw new Error('Produit introuvable');
  //         }
  //         // ÉTAPE 5 : CALCULER LE POIDS TOTAL

  //         // Additionner tous les poids de toutes les pesées
  //         let poidsTotal = 0;
  //         for (const element of venteData.details) {
  //           poidsTotal += element.poids;
  //         }

  //         // ÉTAPE 6 : CALCULER LE PRIX AU KG

  //         let prixKg = 0;

  //         if (isGrosClient) {
  //           // Gros client : prix fixe (pas de réduction)
  //           prixKg = produit.prixKgGrosClient;
  //         } else {
  //           // Client normal : prix selon poids total
  //           if (poidsTotal >= 3000) {
  //             // 3 tonnes ou plus
  //             prixKg = produit.prixKgPalier2;
  //           } else if (poidsTotal >= 1000) {
  //             // 1 tonne ou plus
  //             prixKg = produit.prixKgPalier1;
  //           } else {
  //             // Moins de 1 tonne : prix de base
  //             prixKg = produit.prixKg;
  //           }
  //         }


  //         // ÉTAPE 7 : CALCULER LE MONTANT TOTAL

  //         const montantTotal = poidsTotal * prixKg;



  //         // ÉTAPE 8 : GÉRER LE PAIEMENT

  //         const montantPaye = venteData.montantPaye;
  //         const solde = montantTotal - montantPaye;

  //         // Charger la modalité de paiement par ID fixe (id=1 = Espèces)

  //         // const modalitePaiement = await entityManager.findOne(ModalitePaiementEntity, {
  //         //   where: { id: venteData.modalitePaiementId }
  //         // });


  //         // ÉTAPE 9 : CRÉER L'ACHAT

  //         const now = new Date();

  //         const achat = entityManager.create(AchatEntity, {
  //           client: newClient,
  //           utilisateur: venteData.utilisateurId,
  //           montantTotal: montantTotal,
  //           montantPaye: montantPaye,
  //           solde: solde,
  //           modalitePaiement: venteData.modalitePaiementId,
  //           geler: 0,
  //           dateCreation: now,
  //           idusrcreation: venteData.utilisateurId
  //         });

  //         const achatSauvegarde = await entityManager.save(AchatEntity, achat);

  //         // ÉTAPE 10 : CRÉER LES DÉTAILS (PESÉES)

  //         const detailsCrees = [];

  //         for (const element of venteData.details) {
  //           // Toutes les pesées utilisent le même prixKg calculé
  //           const montant = element.poids * prixKg;

  //           const detail = entityManager.create(DetailAchatEntity, {
  //             achat: achatSauvegarde,
  //             produit: produit,  // Même produit (thon) pour toutes les pesées
  //             poids: element.poids,
  //             montant: montant,
  //             dateCreation: now
  //           });

  //           const detailSauvegarde = await entityManager.save(DetailAchatEntity, detail);

  //           detailsCrees.push({
  //             produit: produit.libelle,
  //             poids: detailSauvegarde.poids,
  //             prixKg: prixKg,
  //             montant: detailSauvegarde.montant
  //           });
  //         }

  //         // ÉTAPE 11 : RETOURNER LE RÉSULTAT

  //         return {
  //           success: true,
  //           message: 'Vente créée avec succès',
  //           data: {
  //             venteId: achatSauvegarde.id,
  //             client: {
  //               id: client.id,
  //               nom: client.nomPrenom,
  //               numero: client.numero
  //             },
  //             montantTotal: achatSauvegarde.montantTotal,
  //             montantPaye: achatSauvegarde.montantPaye,
  //             solde: achatSauvegarde.solde,
  //             nombrePesees: detailsCrees.length,
  //             details: detailsCrees
  //           }
  //         };

  //       } else {
  //         // Client existe → utiliser
  //         console.log(`Client normal existant: ${verifContactClient[0].nomPrenom}`);

  //         const produit = await entityManager.findOne(ProduitEntity, {
  //           where: { id: venteData.details[0].produitId }
  //         });

  //         if (!venteData.details[0].produitId) {
  //           throw new Error('Produit introuvable');
  //         }
  //         // ÉTAPE 5 : CALCULER LE POIDS TOTAL

  //         // Additionner tous les poids de toutes les pesées
  //         let poidsTotal = 0;
  //         for (const element of venteData.details) {
  //           poidsTotal += element.poids;
  //         }

  //         // ÉTAPE 6 : CALCULER LE PRIX AU KG

  //         let prixKg = 0;

  //         if (isGrosClient) {
  //           // Gros client : prix fixe (pas de réduction)
  //           prixKg = produit.prixKgGrosClient;
  //         } else {
  //           // Client normal : prix selon poids total
  //           if (poidsTotal >= 3000) {
  //             // 3 tonnes ou plus
  //             prixKg = produit.prixKgPalier2;
  //           } else if (poidsTotal >= 1000) {
  //             // 1 tonne ou plus
  //             prixKg = produit.prixKgPalier1;
  //           } else {
  //             // Moins de 1 tonne : prix de base
  //             prixKg = produit.prixKg;
  //           }
  //         }


  //         // ÉTAPE 7 : CALCULER LE MONTANT TOTAL

  //         const montantTotal = poidsTotal * prixKg;



  //         // ÉTAPE 8 : GÉRER LE PAIEMENT

  //         const montantPaye = venteData.montantPaye;
  //         const solde = montantTotal - montantPaye;

  //         // Charger la modalité de paiement par ID fixe (id=1 = Espèces)

  //         // const modalitePaiement = await entityManager.findOne(ModalitePaiementEntity, {
  //         //   where: { id: venteData.modalitePaiementId }
  //         // });


  //         // ÉTAPE 9 : CRÉER L'ACHAT

  //         const now = new Date();

  //         const achat = entityManager.create(AchatEntity, {
  //           client: verifContactClient[0],
  //           utilisateur: venteData.utilisateurId,
  //           montantTotal: montantTotal,
  //           montantPaye: montantPaye,
  //           solde: solde,
  //           modalitePaiement: venteData.modalitePaiementId,
  //           geler: 0,
  //           dateCreation: now,
  //           idusrcreation: venteData.utilisateurId
  //         });

  //         const achatSauvegarde = await entityManager.save(AchatEntity, achat);

  //         // ÉTAPE 10 : CRÉER LES DÉTAILS (PESÉES)

  //         const detailsCrees = [];

  //         for (const element of venteData.details) {
  //           // Toutes les pesées utilisent le même prixKg calculé
  //           const montant = element.poids * prixKg;

  //           const detail = entityManager.create(DetailAchatEntity, {
  //             achat: achatSauvegarde,
  //             produit: produit,  // Même produit (thon) pour toutes les pesées
  //             poids: element.poids,
  //             montant: montant,
  //             dateCreation: now
  //           });

  //           const detailSauvegarde = await entityManager.save(DetailAchatEntity, detail);

  //           detailsCrees.push({
  //             produit: produit.libelle,
  //             poids: detailSauvegarde.poids,
  //             prixKg: prixKg,
  //             montant: detailSauvegarde.montant
  //           });
  //         }

  //         // ÉTAPE 11 : RETOURNER LE RÉSULTAT

  //         // return {
  //         //   success: true,
  //         //   message: 'Vente créée avec succès',
  //         //   data: {
  //         //     venteId: achatSauvegarde.id,
  //         //     client: {
  //         //       id: client.id,
  //         //       nom: client.nomPrenom,
  //         //       numero: client.numero
  //         //     },
  //         //     montantTotal: achatSauvegarde.montantTotal,
  //         //     montantPaye: achatSauvegarde.montantPaye,
  //         //     solde: achatSauvegarde.solde,
  //         //     nombrePesees: detailsCrees.length,
  //         //     details: detailsCrees
  //         //   }
  //         // };


  //       }
  //     }

  //     // ÉTAPE 3 : CHARGER L'UTILISATEUR

  //     const utilisateur = await entityManager.findOne(UtilisateurEntity, {
  //       where: { id: venteData.utilisateurId }
  //     });

  //     // ÉTAPE 4 : CHARGER LE PRODUIT (THON)

  //     // Puisqu'il n'y a qu'un seul produit (thon), on le charge une seule fois
  //     const produit = await entityManager.findOne(ProduitEntity, {
  //       where: { id: venteData.details[0].produitId }
  //     });

  //     if (!produit) {
  //       throw new Error('Produit introuvable');
  //     }
  //     // ÉTAPE 5 : CALCULER LE POIDS TOTAL

  //     // Additionner tous les poids de toutes les pesées
  //     let poidsTotal = 0;
  //     for (const element of venteData.details) {
  //       poidsTotal += element.poids;
  //     }

  //     // ÉTAPE 6 : CALCULER LE PRIX AU KG

  //     let prixKg = 0;

  //     if (isGrosClient) {
  //       // Gros client : prix fixe (pas de réduction)
  //       prixKg = produit.prixKgGrosClient;
  //     } else {
  //       // Client normal : prix selon poids total
  //       if (poidsTotal >= 3000) {
  //         // 3 tonnes ou plus
  //         prixKg = produit.prixKgPalier2;
  //       } else if (poidsTotal >= 1000) {
  //         // 1 tonne ou plus
  //         prixKg = produit.prixKgPalier1;
  //       } else {
  //         // Moins de 1 tonne : prix de base
  //         prixKg = produit.prixKg;
  //       }
  //     }


  //     // ÉTAPE 7 : CALCULER LE MONTANT TOTAL

  //     const montantTotal = poidsTotal * prixKg;



  //     // ÉTAPE 8 : GÉRER LE PAIEMENT

  //     const montantPaye = venteData.montantPaye;
  //     const solde = montantTotal - montantPaye;

  //     // Charger la modalité de paiement par ID fixe (id=1 = Espèces)

  //     const modalitePaiement = await entityManager.findOne(ModalitePaiementEntity, {
  //       where: { id: venteData.modalitePaiementId }
  //     });


  //     // ÉTAPE 9 : CRÉER L'ACHAT

  //     const now = new Date();

  //     const achat = entityManager.create(AchatEntity, {
  //       client: client,
  //       utilisateur: utilisateur,
  //       montantTotal: montantTotal,
  //       montantPaye: montantPaye,
  //       solde: solde,
  //       modalitePaiement: modalitePaiement,
  //       geler: 0,
  //       dateCreation: now,
  //       idusrcreation: utilisateur.id
  //     });

  //     const achatSauvegarde = await entityManager.save(AchatEntity, achat);

  //     // ÉTAPE 10 : CRÉER LES DÉTAILS (PESÉES)

  //     const detailsCrees = [];

  //     for (const element of venteData.details) {
  //       // Toutes les pesées utilisent le même prixKg calculé
  //       const montant = element.poids * prixKg;

  //       const detail = entityManager.create(DetailAchatEntity, {
  //         achat: achatSauvegarde,
  //         produit: produit,  // Même produit (thon) pour toutes les pesées
  //         poids: element.poids,
  //         montant: montant,
  //         dateCreation: now
  //       });

  //       const detailSauvegarde = await entityManager.save(DetailAchatEntity, detail);

  //       detailsCrees.push({
  //         produit: produit.libelle,
  //         poids: detailSauvegarde.poids,
  //         prixKg: prixKg,
  //         montant: detailSauvegarde.montant
  //       });
  //     }

  //     // ÉTAPE 11 : RETOURNER LE RÉSULTAT

  //     return {
  //       success: true,
  //       message: 'Vente créée avec succès',
  //       data: {
  //         venteId: achatSauvegarde.id,
  //         client: {
  //           id: client.id,
  //           nom: client.nomPrenom,
  //           numero: client.numero
  //         },
  //         montantTotal: achatSauvegarde.montantTotal,
  //         montantPaye: achatSauvegarde.montantPaye,
  //         solde: achatSauvegarde.solde,
  //         nombrePesees: detailsCrees.length,
  //         details: detailsCrees
  //       }
  //     };
  //   });
  // }

  async creerVente(venteData: any) {
    return await this.entityManager.transaction(async (entityManager) => {
      console.log('Donnees recues du frontend:', venteData);

      // ETAPE 1 : Determiner le type de client
      const isGrosClient = venteData.isGrosClient === true;


      // ETAPE 2 : Obtenir ou creer le client (optionnel)
      let client: any;

      if (isGrosClient) {
        // Cas 1 : Gros client
        // Si clientId est fourni, on cherche le client
        if (venteData.clientId) {
          const clientTrouve = await entityManager.findOne(ClientEntity, {
            where: { id: venteData.clientId }
          });

          if (clientTrouve) {
            client = clientTrouve;
            console.log('Gros client trouve:', client.nomPrenom);
          } else {
            console.log('Avertissement: Client gros client introuvable avec cet ID, vente sans client');
          }
        }
        // Si pas de clientId, client reste null (pas d erreur)

      } else {
        // Cas 2 : Client normal
        // On cherche ou cree seulement si clientNumero est fourni
        if (venteData.clientNumero) {
          // Chercher si le client existe deja par son numero
          const clientExistant = await entityManager.findOne(ClientEntity, {
            where: { numero: venteData.clientNumero }
          });

          if (!clientExistant) {
            // Client n existe pas, on le cree automatiquement seulement si clientNom est fourni
            if (venteData.clientNom) {
              console.log('Nouveau client', venteData.clientNom);

              // Charger le type Client Normal
              const typeClientNormal = await entityManager.findOne(TypeClientEntity, {
                where: { id: 2 }
              });

              if (typeClientNormal) {
                // Creer le nouveau client
                const nouveauClient = entityManager.create(ClientEntity, {
                  nomPrenom: venteData.clientNom,
                  numero: venteData.clientNumero,
                  typeClient: typeClientNormal,
                  geler: 0,
                  dateCreation: new Date(),
                  idusrcreation: venteData.utilisateurId
                });

                const clientCree = await entityManager.save(ClientEntity, nouveauClient);
                client = clientCree;
                console.log('Nouveau client cree:', client.nomPrenom);
              }
            }
          } else {
            // Client existe deja, on l utilise
            client = clientExistant;
            console.log('Client existant trouve:', client.nomPrenom);
          }
        }
        // Si pas de clientNumero, client reste null (pas d erreur)
      }

      // ETAPE 3 : Charger le produit
      if (!venteData.details || venteData.details.length === 0) {
        throw new Error('Aucun detail de vente fourni (tableau details vide)');
      }

      const produitId = venteData.details[0].produitId;
      const produit = await entityManager.findOne(ProduitEntity, {
        where: { id: produitId }
      });

      // ETAPE 4 : Calculer le poids total
      let poidsTotal = 0;
      for (const detail of venteData.details) {
        if (!detail.poids || detail.poids <= 0) {
          throw new Error('Poids invalide dans les details (doit etre superieur a 0)');
        }
        poidsTotal += detail.poids;
      }

      // ETAPE 5 : Calculer le prix au kg
      const prixKg = produit.prixKg;


      // ETAPE 6 : Calculer le montant total
      const montantTotal = poidsTotal * prixKg;
      const montantPaye = venteData.montantPaye;
      const solde = montantTotal - montantPaye;

      // ETAPE 7 : Charger l utilisateur
      const utilisateur = await entityManager.findOne(UtilisateurEntity, {
        where: { id: venteData.utilisateurId }
      });

      if (!utilisateur) {
        throw new Error('Utilisateur introuvable avec l ID: ' + venteData.utilisateurId);
      }

      // ETAPE 8 : Charger la modalite de paiement
      const modalitePaiementId = venteData.modalitePaiementId || 1;
      const modalitePaiement = await entityManager.findOne(ModalitePaiementEntity, {
        where: { id: modalitePaiementId }
      });

      if (!modalitePaiement) {
        throw new Error('Modalite de paiement introuvable avec l ID: ' + modalitePaiementId);
      }



      // ETAPE 9 : Creer l achat (la vente globale)
      const now = new Date();

      // Creer un objet avec les donnees obligatoires
      const achatData: any = {
        utilisateur: utilisateur,
        poidsTotal: poidsTotal,
        montantTotal: montantTotal,
        geler: 0,
        dateCreation: now,
        idusrcreation: utilisateur.id
      };

      // Ajouter le client seulement s il existe
      if (client) {
        achatData.client = client;
      }

      const achat = entityManager.create(AchatEntity, achatData);

      const achatSauvegarde = await entityManager.save(AchatEntity, achat);
      console.log('Achat cree avec l ID:', achatSauvegarde.id);

      // ETAPE 9.5 : Creer un paiement (même si montantPaye = 0 pour garder l'historique)
      let paiementSauvegarde = null;
      try {
        // Calculer le montant dû AVANT ce paiement
        // Pour le premier paiement, c'est le montantTotal
        const montantDu = montantTotal;

        const paiement = entityManager.create(PaiementEntity, {
          achat: achatSauvegarde,
          modalitePaiement: modalitePaiement,
          montantDu: montantDu, // Montant dû AVANT ce paiement
          montantPaye: montantPaye, // Peut être 0
          solde: solde,
          dateCreation: now,
          idusrcreation: utilisateur.id,
          geler: 0
        });

        paiementSauvegarde = await entityManager.save(PaiementEntity, paiement);
        console.log('Paiement cree avec l ID:', paiementSauvegarde.id, 'montantPaye:', montantPaye);
      } catch (error) {
        console.error('Erreur lors de la creation du paiement:', error);
        throw new Error('Erreur lors de la creation du paiement: ' + (error.message || error));
      }

      // ETAPE 10 : Creer les details (les pesees)
      const detailsCrees = [];

      for (const element of venteData.details) {
        // Calculer le montant pour cette pesee
        const montant = element.poids * prixKg;

        // Creer le detail d achat
        const detail = entityManager.create(DetailAchatEntity, {
          achat: achatSauvegarde,
          produit: produit,
          poids: element.poids,
          montant: montant,
          dateCreation: now
        });

        const detailSauvegarde = await entityManager.save(DetailAchatEntity, detail);

        // Ajouter au tableau pour la reponse
        detailsCrees.push({
          produit: produit.libelle,
          poids: detailSauvegarde.poids,
          prixKg: prixKg,
          montant: detailSauvegarde.montant
        });
      }

      // ETAPE 11 : Retourner le resultat
      return {
        success: true,
        message: 'Vente creee avec succes',
        data: {
          venteId: achatSauvegarde.id,
          client: client ? {
            id: client.id,
            nom: client.nomPrenom,
            numero: client.numero
          } : null,
          poidsTotal: achatSauvegarde.poidsTotal,
          montantTotal: achatSauvegarde.montantTotal,
          nombrePesees: detailsCrees.length,
          details: detailsCrees,
          paiement: paiementSauvegarde ? {
            id: paiementSauvegarde.id,
            montantDu: paiementSauvegarde.montantDu,
            montantPaye: paiementSauvegarde.montantPaye,
            solde: paiementSauvegarde.solde,
            modalitePaiement: modalitePaiement.libelle || modalitePaiement.id
          } : null
        }
      };
    });
  }

  // async venteParJour(query: any) {
  //   const manager = getManager();
  //   const { dateJour } = query;

  //   const ventesDuJour = await manager.createQueryBuilder(AchatEntity, 'achat')
  //     .select([
  //       "achat",
  //       "client",
  //       "typeClient",
  //       "detailAchat",
  //       "produit",
  //       "utilisateur"
  //     ])
  //     .leftJoin("achat.utilisateur", "utilisateur")
  //     .leftJoin("achat.client", "client")
  //     .leftJoin("client.typeClient", "typeClient")
  //     .leftJoin("achat.detailsAchat", "detailAchat")
  //     .leftJoin("detailAchat.produit", "produit")
  //     .where('achat.geler = 0')
  //     .andWhere('TO_DAYS(achat.dateCreation) = TO_DAYS(:dateJour)', { dateJour })
  //     .getMany();

  //   // Ajouter le nombre de pesées pour chaque vente
  //   const resultatsAvecPesees = ventesDuJour.map(achat => {
  //     // Compter le nombre de pesées (détails d'achat)
  //     const nombrePesees = achat.detailsAchat?.length || 0;

  //     // Retourner l'achat avec la propriété nombrePesees ajoutée
  //     return {
  //       ...achat,
  //       nombrePesees: nombrePesees
  //     };
  //   });

  //   return resultatsAvecPesees;
  // }

  // async venteParMois(query: any) {
  //   const manager = getManager();
  //   const { mois, annee } = query;

  //   const moisInt = parseInt(mois);
  //   const anneeInt = parseInt(annee);

  //   const ventesDuMois = await manager.createQueryBuilder(AchatEntity, 'achat')
  //     .select([
  //       "achat",
  //       "client",
  //       "typeClient",
  //       "detailAchat",
  //       "produit",
  //       "utilisateur"
  //     ])
  //     .leftJoin("achat.utilisateur", "utilisateur")
  //     .leftJoin("achat.client", "client")
  //     .leftJoin("client.typeClient", "typeClient")
  //     .leftJoin("achat.detailsAchat", "detailAchat")
  //     .leftJoin("detailAchat.produit", "produit")
  //     .where('achat.geler = 0')
  //     .andWhere('MONTH(achat.dateCreation) = :mois', { mois: moisInt })
  //     .andWhere('YEAR(achat.dateCreation) = :annee', { annee: anneeInt })
  //     .getMany();

  //   // Ajouter le nombre de pesées pour chaque vente
  //   const resultatsAvecPesees = ventesDuMois.map(achat => {
  //     // Compter le nombre de pesées (détails d'achat)
  //     const nombrePesees = achat.detailsAchat?.length || 0;

  //     // Retourner l'achat avec la propriété nombrePesees ajoutée
  //     return {
  //       ...achat,
  //       nombrePesees: nombrePesees
  //     };
  //   });

  //   return resultatsAvecPesees;
  // }

  // async venteParAnnee(query: any) {
  //   const manager = getManager();
  //   const { annee } = query;

  //   const anneeInt = parseInt(annee);

  //   const ventesDeLAnnee = await manager.createQueryBuilder(AchatEntity, 'achat')
  //     .select([
  //       "achat",
  //       "client",
  //       "typeClient",
  //       "detailAchat",
  //       "produit",
  //       "utilisateur"
  //     ])
  //     .leftJoin("achat.utilisateur", "utilisateur")
  //     .leftJoin("achat.client", "client")
  //     .leftJoin("client.typeClient", "typeClient")
  //     .leftJoin("achat.detailsAchat", "detailAchat")
  //     .leftJoin("detailAchat.produit", "produit")
  //     .where('achat.geler = 0')
  //     .andWhere('YEAR(achat.dateCreation) = :annee', { annee: anneeInt })
  //     .getMany();

  //   // Ajouter le nombre de pesées pour chaque vente
  //   const resultatsAvecPesees = ventesDeLAnnee.map(achat => {
  //     // Compter le nombre de pesées (détails d'achat)
  //     const nombrePesees = achat.detailsAchat?.length || 0;

  //     // Retourner l'achat avec la propriété nombrePesees ajoutée
  //     return {
  //       ...achat,
  //       nombrePesees: nombrePesees
  //     };
  //   });

  //   return resultatsAvecPesees;
  // }

  // async venteParSemaine(query: any) {
  //   const manager = getManager();
  //   const { date } = query;

  //   // Calculer le numéro de semaine ISO (semaine commence le lundi)
  //   // Utiliser MySQL WEEK() avec mode 1 (ISO standard)
  //   const ventesDeLaSemaine = await manager.createQueryBuilder(AchatEntity, 'achat')
  //     .select([
  //       "achat",
  //       "client",
  //       "typeClient",
  //       "detailAchat",
  //       "produit",
  //       "utilisateur"
  //     ])
  //     .leftJoin("achat.utilisateur", "utilisateur")
  //     .leftJoin("achat.client", "client")
  //     .leftJoin("client.typeClient", "typeClient")
  //     .leftJoin("achat.detailsAchat", "detailAchat")
  //     .leftJoin("detailAchat.produit", "produit")
  //     .where('achat.geler = 0')
  //     .andWhere('WEEK(achat.dateCreation, 1) = WEEK(:date, 1)', { date: date })
  //     .andWhere('YEAR(achat.dateCreation) = YEAR(:date)', { date: date })
  //     .getMany();

  //   // Ajouter le nombre de pesées pour chaque vente
  //   const resultatsAvecPesees = ventesDeLaSemaine.map(achat => {
  //     // Compter le nombre de pesées (détails d'achat)
  //     const nombrePesees = achat.detailsAchat?.length || 0;

  //     // Retourner l'achat avec la propriété nombrePesees ajoutée
  //     return {
  //       ...achat,
  //       nombrePesees: nombrePesees
  //     };
  //   });

  //   return resultatsAvecPesees;
  // }

  async listeVentes() {
    const manager = getManager();
    const ventes = await manager.createQueryBuilder(AchatEntity, 'achat')
      .select([
        "achat",
        "client",
        "typeClient",
        "detailAchat",
        "produit",
        "paiement",
        "modalitePaiement"

      ])
      .leftJoin("achat.client", "client")
      .leftJoin("client.typeClient", "typeClient")
      .leftJoin("achat.detailsAchat", "detailAchat")
      .leftJoin("detailAchat.produit", "produit")
      .leftJoin("achat.paiement", "paiement")
      .leftJoin("paiement.modalitePaiement", "modalitePaiement")
      .where('achat.geler = 0')
      .orderBy('achat.dateCreation', 'DESC')
      .getMany();

    // Ajouter le nombre de pesées pour chaque vente
    const resultatsAvecPesees = ventes.map(achat => {
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

  async listeVentesByPeriodicite(searchData: any) {
    try {
      console.log('Paramètres de recherche reçus:', searchData);

      // Extraire les paramètres de recherche depuis l'objet searchData
      const { periodicite, dateJour, dateDebut, dateFin, semaine, mois, annee } = searchData;

      // Créer un gestionnaire de requête TypeORM
      const manager = getManager();

      // Construire la requête de base pour récupérer les achats
      const query = manager.createQueryBuilder(AchatEntity, 'achat')
        .select([
          "achat",
          "client",
          "typeClient",
          "detailAchat",
          "produit",
          "paiement",
          "modalitePaiement"
        ])
        // Joindre les tables liées pour récupérer toutes les informations
        .leftJoin("achat.client", "client")
        .leftJoin("client.typeClient", "typeClient")
        .leftJoin("achat.detailsAchat", "detailAchat")
        .leftJoin("detailAchat.produit", "produit")
        .leftJoin("achat.paiements", "paiement")
        .leftJoin("paiement.modalitePaiement", "modalitePaiement")
        .where('achat.geler = 0');

      // Appliquer le filtre selon la périodicité demandée
      if (periodicite === 'jour' && dateJour) {
        // FILTRE PAR JOUR : récupérer les ventes d'un jour précis
        console.log('Filtre par jour:', dateJour);
        query.andWhere('DATE(achat.dateCreation) = DATE(:dateJour)', {
          dateJour: new Date(dateJour).toISOString().split('T')[0]
        });
      } else if (periodicite === 'semaine' && dateDebut && dateFin) {
        // FILTRE PAR SEMAINE : récupérer les ventes entre deux dates
        console.log('Filtre par semaine:', dateDebut, 'à', dateFin);
        query.andWhere('DATE(achat.dateCreation) >= DATE(:dateDebut) AND DATE(achat.dateCreation) <= DATE(:dateFin)', {
          dateDebut: new Date(dateDebut).toISOString().split('T')[0],
          dateFin: new Date(dateFin).toISOString().split('T')[0]
        });
      } else if (periodicite === 'mois' && mois && annee) {
        // FILTRE PAR MOIS : récupérer les ventes d'un mois précis
        console.log('Filtre par mois:', mois, annee);

        // Convertir mois et annee en nombres entiers

        const moisNum = parseInt(mois);
        const anneeNum = parseInt(annee);

        query.andWhere('EXTRACT(MONTH FROM achat.dateCreation) = :mois AND EXTRACT(YEAR FROM achat.dateCreation) = :annee', {
          mois: moisNum,
          annee: anneeNum
        });
      } else if (periodicite === 'annee' && annee) {
        // FILTRE PAR ANNEE : récupérer les ventes d'une année précise
        console.log('Filtre par année:', annee);
        const anneeNum = parseInt(annee);

        query.andWhere('EXTRACT(YEAR FROM achat.dateCreation) = :annee', {
          annee: anneeNum
        });
      } else {
        console.log('Aucun filtre appliqué ou paramètres manquants');
      }

      // Trier les résultats par date de création, du plus récent au plus ancien
      query.orderBy('achat.dateCreation', 'DESC');

      // Exécuter la requête et récupérer tous les résultats
      const ventes = await query.getMany();
      console.log(`Nombre de ventes trouvées: ${ventes.length}`);

      // Pour chaque vente, calculer les totaux et ajouter des informations supplémentaires
      const resultatsAvecPesees = ventes.map(achat => {
        // Récupérer les détails (pesées) de cet achat
        // || [] signifie : si detailsAchat est null ou undefined, utiliser un tableau vide
        const details = achat.detailsAchat || [];
        // Calculer le poids total : additionner tous les poids de toutes les pesées
        const poidsTotal = details.reduce((total, detail) =>
          total + (Number(detail.poids) || 0), 0);

        // Calculer le montant total : additionner tous les montants de toutes les pesées
        const montantTotal = details.reduce((total, detail) =>
          total + (Number(detail.montant) || 0), 0);

        // Compter le nombre de pesées (c'est simplement la longueur du tableau)
        const nombrePesees = details.length;

        // Récupérer la liste des produits utilisés dans cette vente

        const produits = details.map(d => d.produit?.libelle).filter(Boolean);

        // Créer un tableau avec seulement les produits uniques (sans doublons)

        const produitsUniques = [...new Set(produits)];

        // Récupérer les paiements liés à cet achat (tels que dans la table paiement_pai)
        const paiements = (achat as any).paiements || [];

        // Préparer une liste détaillée des paiements sans faire de sommes ici
        const listePaiements = paiements.map(p => ({
          id: p.id,
          montantDu: p.montantDu,
          montantPaye: p.montantPaye,
          solde: p.solde,
          dateCreation: p.dateCreation,
          modalitePaiement: p.modalitePaiement ? {
            id: p.modalitePaiement.id,
            libelle: (p.modalitePaiement as any).libelle || null
          } : null
        }));

        // Retourner l'achat avec toutes les informations calculées ajoutées
        return {
          ...achat,  // Copier toutes les propriétés de l'achat original
          nombrePesees: nombrePesees,
          poidsTotal: poidsTotal,
          montantTotal: montantTotal,
          // Informations sur le produit
          produitPrincipal: produitsUniques[0] || 'Non spécifié',
          produitsListe: produitsUniques,
          // Informations sur les paiements (brutes, sans calculs de sommes)
          paiements: listePaiements,
        };
      });

      return resultatsAvecPesees;

    } catch (error) {
      console.error('Erreur dans listeVentesByPeriodicite:', error);
      console.error('Stack trace:', error.stack);
      throw new Error(`Erreur lors de la récupération des ventes: ${error.message}`);
    }
  }

  async paiementsParJour(query: any) {
    const manager = getManager();
    const { dateJour } = query;

    const paiements = await manager.createQueryBuilder(PaiementEntity, 'paiement')
      .select([
        'paiement',
        'achat',
        'client',
        'utilisateur',
        'modalitePaiement',
      ])
      .leftJoin('paiement.achat', 'achat')
      .leftJoin('achat.client', 'client')
      .leftJoin('achat.utilisateur', 'utilisateur')
      .leftJoin('paiement.modalitePaiement', 'modalitePaiement')
      .where('paiement.geler = 0')
      .andWhere('DATE(paiement.dateCreation) = DATE(:dateJour)', { dateJour })
      .orderBy('paiement.dateCreation', 'ASC')
      .getMany();

    return paiements;
  }

  async paiementsParSemaine(query: any) {
    const manager = getManager();
    const { date } = query;

    // Calculer le numéro de semaine ISO de laemaine commence le lundi 1

    const paiements = await manager.createQueryBuilder(PaiementEntity, 'paiement')
      .select([
        'paiement',
        'achat',
        'client',
        'utilisateur',
        'modalitePaiement',
      ])
      .leftJoin('paiement.achat', 'achat')
      .leftJoin('achat.client', 'client')
      .leftJoin('achat.utilisateur', 'utilisateur')
      .leftJoin('paiement.modalitePaiement', 'modalitePaiement')
      .where('paiement.geler = 0')
      .andWhere('WEEK(paiement.dateCreation, 1) = WEEK(:date, 1)', { date })
      .andWhere('YEAR(paiement.dateCreation) = YEAR(:date)', { date })
      .orderBy('paiement.dateCreation', 'ASC')
      .getMany();

    return paiements;
  }

  async paiementsParMois(query: any) {
    const manager = getManager();
    const { mois, annee } = query;

    const moisInt = parseInt(mois);
    const anneeInt = parseInt(annee);

    const paiements = await manager.createQueryBuilder(PaiementEntity, 'paiement')
      .select([
        'paiement',
        'achat',
        'client',
        'utilisateur',
        'modalitePaiement',
      ])
      .leftJoin('paiement.achat', 'achat')
      .leftJoin('achat.client', 'client')
      .leftJoin('achat.utilisateur', 'utilisateur')
      .leftJoin('paiement.modalitePaiement', 'modalitePaiement')
      .where('paiement.geler = 0')
      .andWhere('MONTH(paiement.dateCreation) = :mois', { mois: moisInt })
      .andWhere('YEAR(paiement.dateCreation) = :annee', { annee: anneeInt })
      .orderBy('paiement.dateCreation', 'ASC')
      .getMany();

    return paiements;
  }

  async paiementsParAnnee(query: any) {
    const manager = getManager();
    const { annee } = query;

    const anneeInt = parseInt(annee);

    const paiements = await manager.createQueryBuilder(PaiementEntity, 'paiement')
      .select([
        'paiement',
        'achat',
        'client',
        'utilisateur',
        'modalitePaiement',
      ])
      .leftJoin('paiement.achat', 'achat')
      .leftJoin('achat.client', 'client')
      .leftJoin('achat.utilisateur', 'utilisateur')
      .leftJoin('paiement.modalitePaiement', 'modalitePaiement')
      .where('paiement.geler = 0')
      .andWhere('YEAR(paiement.dateCreation) = :annee', { annee: anneeInt })
      .orderBy('paiement.dateCreation', 'ASC')
      .getMany();

    return paiements;
  }
}






