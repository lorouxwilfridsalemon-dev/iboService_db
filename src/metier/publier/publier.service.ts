

// import { Injectable } from '@nestjs/common';
// import { EntityManager } from 'typeorm';
// import { AnnonceEntity } from '../../database/annonce/annonce.entity';
// import { AnnonceImageEntity } from '../../database/annonce_image/annonce_image.entity';
// import { AnnonceVideoEntity } from '../../database/annonce_video/annonce_video.entity';
// import { LocalisationEntity } from '../../database/localisation/localisation.entity';
// import { SousCategoriesEntity } from '../../database/sous_categories/sous_categories.entity';
// import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
// import { AnnonceCaracteristiqueEntity } from '../../database/annonce_caracteristique/annonce_caracteristique.entity';
// import { CaracteristiqueEntity } from '../../database/caracteristique/caracteristique.entity';
// import { StatutAnnonceEntity } from '../../database/statut_annonce/statut_annonce.entity';
// import { HistoriqueStatutAnnonceEntity } from '../../database/historique_statut_annonce/historique_statut_annonce.entity';


// const STATUT_ACTIF = 'Actives';

// @Injectable()
// export class PublierMetierService {

//   constructor(
//     private readonly entityManager: EntityManager,
//   ) { }

//   async publierAnnonce(
//     annonceData: any,
//     images?: Express.Multer.File[],
//     videos?: Express.Multer.File[],
//     cvFile?: Express.Multer.File | null,
//     pieceFile?: Express.Multer.File | null, 
//   ) {
//     return await this.entityManager.transaction(async (entityManager) => {

//       const now = new Date();

//       // --- ÉTAPE 1 : Gérer la localisation ---
//       let localisation = null;
//       if (annonceData.adresse && annonceData.longitude && annonceData.latitude) {
//         localisation = entityManager.create(LocalisationEntity, {
//           adresse: annonceData.adresse || 'Non précisée',
//           longitude: annonceData.longitude || 0,
//           latitude: annonceData.latitude || 0,
//           geler: 0,
//           dateCreation: now,
//           idusrcreation: annonceData.idusrcreation || 1
//         });
//         localisation = await entityManager.save(LocalisationEntity, localisation);
//       }

//       // --- ÉTAPE 2 : Charger la sous-catégorie AVEC sa catégorie parente ---
//       const sousCategorie = await entityManager.findOne(SousCategoriesEntity, {
//         where: { id: annonceData.id_sca },
//         relations: ['categorie'],
//       });

//       if (!sousCategorie) {
//         throw new Error(`Sous-catégorie avec l'ID ${annonceData.id_sca} non trouvée`);
//       }

//       const categorieNom = sousCategorie.categorie?.nom || '';
//       console.log(`📂 Publication - Catégorie: "${categorieNom}" | Sous-catégorie: "${sousCategorie.nom}"`);

//       // --- ÉTAPE 3 : Charger l'utilisateur ---
//       const utilisateur = await entityManager.findOne(UtilisateurEntity, {
//         where: { id: annonceData.id_usr || annonceData.idusrcreation || 1 }
//       });

//       // --- ÉTAPE 4 : Déterminer le type de prix ---
//       let typePrix = '1';
//       if (annonceData.type_prix) {
//         typePrix = String(annonceData.type_prix);
//       } else if (annonceData.typeBien) {
//         switch (annonceData.typeBien) {
//           case 'Maison individuelle':
//           case 'Villa':
//           case 'Appartement':
//           case 'Studio':
//             typePrix = '2';
//             break;
//           case 'Résidence meublée':
//             typePrix = '3';
//             break;
//           case 'Plombier':
//           case 'Mécanicien':
//             typePrix = '4';
//             break;
//           default:
//             typePrix = '1';
//         }
//       }

//       // --- ÉTAPE 5 : Créer et sauvegarder l'annonce ---
//       const annonce = entityManager.create(AnnonceEntity, {
//         titre: annonceData.titre,
//         prix: annonceData.prix || 0,
//         description: annonceData.description || '',
//         type_prix: typePrix,
//         // ✅ CORRIGÉ : 'actif' → STATUT_ACTIF ('Actives') — cohérent
//         // avec la table de référence statutannonce_san ET avec le
//         // dashboard admin (AnnonceMetierService), qui filtrait sur
//         // 'Actives' sans jamais trouver les annonces fraîchement
//         // publiées (créées avec 'actif', minuscule).
//         statut: STATUT_ACTIF,
//         date_publication: now,
//         longitude: annonceData.longitude || 0,
//         latitude: annonceData.latitude || 0,
//         adresse: annonceData.adresse || '',
//         nombre_chambres: annonceData.chambres || 0,
//         nombre_douches: annonceData.douches || 0,
//         nombre_salon: annonceData.salons || 0,
//         type_location: annonceData.typeLocation || 'Location simple',
//         caution_mois: annonceData.cautionMois ? String(annonceData.cautionMois) : '0',
//         avance_mois: annonceData.avanceMois ? String(annonceData.avanceMois) : '0',
//         frais_visite: annonceData.fraisEntree || 0,
//         est_meuble: annonceData.meuble || false,
//         est_automatique: annonceData.automatique || false,
//         a_gps: annonceData.gps || false,
//         doc_cv: cvFile?.filename ?? null,
//         piece: pieceFile?.filename ?? null,
//         empty1: '',
//         empty2: '',
//         empty3: '',
//         geler: 0,
//         dateCreation: now,
//         idusrcreation: annonceData.idusrcreation || 1,
//         sousCategorie: sousCategorie,
//         utilisateur: utilisateur,
//       });

//       // ✅ SAUVEGARDE DE L'ANNONCE
//       const annonceSauvegarde = await entityManager.save(AnnonceEntity, annonce);

//       // ================================================================
//       // Historisation du statut initial ("Actives")
//       // ================================================================
//       try {
//         const statutActif = await entityManager.findOne(StatutAnnonceEntity, {
//           where: { libelle: STATUT_ACTIF },
//         });

//         if (statutActif) {
//           const historiqueStatut = entityManager.create(HistoriqueStatutAnnonceEntity, {
//             dateChangement: now,
//             commentaire: 'Annonce publiée',
//             geler: 0,
//             dateCreation: now,
//             idusrcreation: annonceData.idusrcreation || 1,
//             statutAnnonce: statutActif,
//             annonce: annonceSauvegarde,
//           });
//           await entityManager.save(HistoriqueStatutAnnonceEntity, historiqueStatut);
//         } else {
//           console.warn(
//             `⚠️ Statut "${STATUT_ACTIF}" introuvable dans statutannonce_san — ` +
//             'historique non créé. Avez-vous bien exécuté les INSERT SQL ' +
//             'des statuts de référence ?',
//           );
//         }
//       } catch (error) {
//         console.error('❌ Échec création historique statut annonce :', error);
//       }

//       // --- ÉTAPE 6 : Sauvegarder les IMAGES ---
//       const imagesSauvegardees = [];
//       if (images && images.length > 0) {
//         for (let i = 0; i < images.length; i++) {
//           const file = images[i];
//           const image = entityManager.create(AnnonceImageEntity, {
//             nom: file.filename,
//             order_image: String(i + 1),
//             geler: 0,
//             dateCreation: now,
//             idusrcreation: annonceData.idusrcreation || 1,
//             annonce: annonceSauvegarde,
//           });
//           const imgSauvee = await entityManager.save(AnnonceImageEntity, image);
//           imagesSauvegardees.push({
//             id: imgSauvee.id,
//             nom: imgSauvee.nom,
//             order_image: imgSauvee.order_image,
//           });
//         }
//       }

//       // --- ÉTAPE 7 : Sauvegarder les VIDÉOS ---
//       const videosSauvegardees = [];
//       if (videos && videos.length > 0) {
//         for (let i = 0; i < videos.length; i++) {
//           const file = videos[i];
//           const video = entityManager.create(AnnonceVideoEntity, {
//             nom: file.originalname,
//             url_video: file.path,
//             description: annonceData.videoDescription || 'Vidéo de présentation',
//             geler: 0,
//             dateCreation: now,
//             idusrcreation: annonceData.idusrcreation || 1,
//             annonce: annonceSauvegarde,
//           });
//           const vidSauvee = await entityManager.save(AnnonceVideoEntity, video);
//           videosSauvegardees.push({
//             id: vidSauvee.id,
//             nom: vidSauvee.nom,
//             url: vidSauvee.url_video,
//           });
//         }
//       }

//       // ================================================================
//       // ÉTAPE 8 : Enregistrer les Caractéristiques
//       // ================================================================
//       let caracteristiquesArray: any[] = [];
//       if (Array.isArray(annonceData.caracteristiques)) {
//         caracteristiquesArray = annonceData.caracteristiques;
//       } else if (typeof annonceData.caracteristiques === 'string' && annonceData.caracteristiques.trim().length > 0) {
//         try {
//           const parsed = JSON.parse(annonceData.caracteristiques);
//           if (Array.isArray(parsed)) {
//             caracteristiquesArray = parsed;
//           }
//         } catch (error) {
//           console.warn(
//             `⚠️ [Publier] Impossible de parser annonceData.caracteristiques ("${annonceData.caracteristiques}") :`,
//             error,
//           );
//         }
//       }

//       const caracteristiquesSauvegardees = [];
//       if (caracteristiquesArray.length > 0) {
//         for (const carId of caracteristiquesArray) {
//           if (carId) {
//             const lienCaracteristique = entityManager.create(AnnonceCaracteristiqueEntity, {
//               valeur: 'Oui',
//               geler: 0,
//               dateCreation: now,
//               idusrcreation: annonceData.idusrcreation || 1,
//               annonce: annonceSauvegarde,
//               caracteristique: { id: Number(carId) } as CaracteristiqueEntity,
//             });
//             const carSauvee = await entityManager.save(AnnonceCaracteristiqueEntity, lienCaracteristique);
//             caracteristiquesSauvegardees.push(carSauvee);
//           }
//         }
//       }

//       // --- ÉTAPE 9 : Retourner le résultat ---
//       return {
//         success: true,
//         message: 'Annonce publiée avec succès',
//         data: {
//           annonceId: annonceSauvegarde.id,
//           titre: annonceSauvegarde.titre,
//           prix: annonceSauvegarde.prix,
//           typePrix: typePrix,
//           categorie: categorieNom,
//           sousCategorie: sousCategorie.nom,
//           typeBien: annonceData.typeBien,
//           localisation: localisation ? {
//             id: localisation.id,
//             adresse: localisation.adresse,
//             ville: localisation.ville,
//           } : null,
//           images: imagesSauvegardees,
//           videos: videosSauvegardees,
//           docCv: annonceSauvegarde.doc_cv,
//           piece: annonceSauvegarde.piece,
//           caracteristiques: caracteristiquesSauvegardees
//         }
//       };
//     });
//   }
// }      


import {
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { EntityManager, MoreThanOrEqual } from 'typeorm';
import { AnnonceEntity } from '../../database/annonce/annonce.entity';
import { AnnonceImageEntity } from '../../database/annonce_image/annonce_image.entity';
import { AnnonceVideoEntity } from '../../database/annonce_video/annonce_video.entity';
import { LocalisationEntity } from '../../database/localisation/localisation.entity';
import { SousCategoriesEntity } from '../../database/sous_categories/sous_categories.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { AnnonceCaracteristiqueEntity } from '../../database/annonce_caracteristique/annonce_caracteristique.entity';
import { CaracteristiqueEntity } from '../../database/caracteristique/caracteristique.entity';
import { StatutAnnonceEntity } from '../../database/statut_annonce/statut_annonce.entity';
import { HistoriqueStatutAnnonceEntity } from '../../database/historique_statut_annonce/historique_statut_annonce.entity';
import { AbonnementEntity } from '../../database/abonnement/abonnement.entity';

// ✅ Valeur UNIQUE du statut "actif"
const STATUT_ACTIF = 'Actives';

@Injectable()
export class PublierMetierService {
  constructor(
    private readonly entityManager: EntityManager,
  ) {}

  // =========================================================================
  // VÉRIFICATION DES LIMITES D'ABONNEMENT
  // =========================================================================

  /**
   * Récupère l'abonnement actif d'un utilisateur.
   */
  private async getAbonnementActif(
    entityManager: EntityManager,
    idUsr: number,
  ): Promise<AbonnementEntity | null> {
    const maintenant = new Date();

    return entityManager.findOne(AbonnementEntity, {
      where: [
        {
          utilisateur: { id: idUsr },
          statut: 'actif',
          dateFin: null,
          geler: 0,
        },
        {
          utilisateur: { id: idUsr },
          statut: 'actif',
          dateFin: MoreThanOrEqual(maintenant) as any,
          geler: 0,
        },
      ],
      relations: ['plan'],
      order: { dateCreation: 'DESC' },
    });
  }

  /**
   * Vérifie toutes les limites AVANT la publication :
   * 1. Nombre d'annonces max
   * 2. Nombre de photos max
   * 3. Vidéos autorisées
   */
  private async verifierLimites(
    entityManager: EntityManager,
    idUsr: number,
    nombrePhotos: number,
    nombreVideos: number,
  ): Promise<void> {
    // 1️⃣ Récupérer l'abonnement actif
    const abonnement = await this.getAbonnementActif(entityManager, idUsr);

    if (!abonnement) {
      throw new ForbiddenException(
        'Vous devez avoir un abonnement actif pour publier une annonce.',
      );
    }

    const plan = abonnement.plan;

    if (!plan) {
      throw new ForbiddenException(
        'Votre abonnement est invalide. Contactez le support.',
      );
    }

    console.log(
      `📊 [Limite] Vérification pour user ${idUsr} - Plan: ${plan.code}`,
    );

    // 2️⃣ Vérifier la limite d'ANNONCES
    const nombreAnnoncesActuelles = await entityManager.count(AnnonceEntity, {
      where: {
        utilisateur: { id: idUsr },
        geler: 0,
      },
    });

    const limiteAnnonces = plan.nbAnnoncesMax;
    const estIllimite = limiteAnnonces >= 999999;

    console.log(
      `   Annonces : ${nombreAnnoncesActuelles}/${estIllimite ? '∞' : limiteAnnonces}`,
    );

    if (!estIllimite && nombreAnnoncesActuelles >= limiteAnnonces) {
      throw new ForbiddenException(
        `Vous avez atteint la limite de ${limiteAnnonces} annonces de votre forfait "${plan.nom}". ` +
          `Passez à un forfait supérieur pour publier plus d'annonces.`,
      );
    }

    // 3️⃣ Vérifier la limite de PHOTOS
    const limitePhotos = plan.nbPhotosMax;
    const photosIllimitees = limitePhotos >= 999999;

    console.log(
      `   Photos : ${nombrePhotos}/${photosIllimitees ? '∞' : limitePhotos}`,
    );

    if (!photosIllimitees && nombrePhotos > limitePhotos) {
      throw new ForbiddenException(
        `Votre forfait "${plan.nom}" permet ${limitePhotos} photos par annonce maximum. ` +
          `Vous avez essayé d'en ajouter ${nombrePhotos}.`,
      );
    }

    // 4️⃣ Vérifier la limite de VIDÉOS
    const videosAutorisees = plan.videoAutorisee === 1;

    console.log(
      `   Vidéos : ${nombreVideos} reçues, autorisées: ${videosAutorisees}`,
    );

    if (!videosAutorisees && nombreVideos > 0) {
      throw new ForbiddenException(
        `Les vidéos ne sont pas autorisées avec le forfait "${plan.nom}". ` +
          `Passez à un forfait supérieur pour activer les vidéos.`,
      );
    }

    // ✅ Pour le plan GRATUIT : 1 vidéo max par annonce
    if (plan.code === 'gratuit' && nombreVideos > 1) {
      throw new ForbiddenException(
        `Le forfait GRATUIT permet 1 vidéo par annonce maximum. ` +
          `Vous avez essayé d'en ajouter ${nombreVideos}. ` +
          `Passez à un forfait payant pour ajouter plus de vidéos.`,
      );
    }

    console.log(`✅ [Limite] Toutes les limites sont respectées`);
  }

  // =========================================================================
  // PUBLICATION D'ANNONCE
  // =========================================================================

  async publierAnnonce(
    annonceData: any,
    images?: Express.Multer.File[],
    videos?: Express.Multer.File[],
    cvFile?: Express.Multer.File | null,
    pieceFile?: Express.Multer.File | null,
  ) {
    return await this.entityManager.transaction(async (entityManager) => {
      const now = new Date();
      const idUsr = annonceData.id_usr || annonceData.idusrcreation || 1;

      // =========================================================
      // ✅ ÉTAPE 0 : VÉRIFIER LES LIMITES AVANT TOUT
      // =========================================================
      await this.verifierLimites(
        entityManager,
        idUsr,
        images?.length ?? 0,
        videos?.length ?? 0,
      );

      // --- ÉTAPE 1 : Gérer la localisation ---
      let localisation = null;
      if (annonceData.adresse && annonceData.longitude && annonceData.latitude) {
        localisation = entityManager.create(LocalisationEntity, {
          adresse: annonceData.adresse || 'Non précisée',
          longitude: annonceData.longitude || 0,
          latitude: annonceData.latitude || 0,
          geler: 0,
          dateCreation: now,
          idusrcreation: idUsr,
        });
        localisation = await entityManager.save(LocalisationEntity, localisation);
      }

      // --- ÉTAPE 2 : Charger la sous-catégorie ---
      const sousCategorie = await entityManager.findOne(SousCategoriesEntity, {
        where: { id: annonceData.id_sca },
        relations: ['categorie'],
      });

      if (!sousCategorie) {
        throw new Error(
          `Sous-catégorie avec l'ID ${annonceData.id_sca} non trouvée`,
        );
      }

      const categorieNom = sousCategorie.categorie?.nom || '';
      console.log(
        `📂 Publication - Catégorie: "${categorieNom}" | Sous-catégorie: "${sousCategorie.nom}"`,
      );

      // --- ÉTAPE 3 : Charger l'utilisateur ---
      const utilisateur = await entityManager.findOne(UtilisateurEntity, {
        where: { id: idUsr },
      });

      // --- ÉTAPE 4 : Déterminer le type de prix ---
      let typePrix = '1';
      if (annonceData.type_prix) {
        typePrix = String(annonceData.type_prix);
      } else if (annonceData.typeBien) {
        switch (annonceData.typeBien) {
          case 'Maison individuelle':
          case 'Villa':
          case 'Appartement':
          case 'Studio':
            typePrix = '2';
            break;
          case 'Résidence meublée':
            typePrix = '3';
            break;
          case 'Plombier':
          case 'Mécanicien':
            typePrix = '4';
            break;
          default:
            typePrix = '1';
        }
      }

      // --- ÉTAPE 5 : Créer l'annonce ---
      const annonce = entityManager.create(AnnonceEntity, {
        titre: annonceData.titre,
        prix: annonceData.prix || 0,
        description: annonceData.description || '',
        type_prix: typePrix,
        statut: STATUT_ACTIF,
        date_publication: now,
        longitude: annonceData.longitude || 0,
        latitude: annonceData.latitude || 0,
        adresse: annonceData.adresse || '',
        nombre_chambres: annonceData.chambres || 0,
        nombre_douches: annonceData.douches || 0,
        nombre_salon: annonceData.salons || 0,
        type_location: annonceData.typeLocation || 'Location simple',
        caution_mois: annonceData.cautionMois
          ? String(annonceData.cautionMois)
          : '0',
        avance_mois: annonceData.avanceMois
          ? String(annonceData.avanceMois)
          : '0',
        frais_visite: annonceData.fraisEntree || 0,
        est_meuble: annonceData.meuble || false,
        est_automatique: annonceData.automatique || false,
        a_gps: annonceData.gps || false,
        doc_cv: cvFile?.filename ?? null,
        piece: pieceFile?.filename ?? null,
        empty1: '',
        empty2: '',
        empty3: '',
        geler: 0,
        dateCreation: now,
        idusrcreation: idUsr,
        sousCategorie: sousCategorie,
        utilisateur: utilisateur,
      });

      const annonceSauvegarde = await entityManager.save(AnnonceEntity, annonce);

      // Historisation du statut initial
      try {
        const statutActif = await entityManager.findOne(StatutAnnonceEntity, {
          where: { libelle: STATUT_ACTIF },
        });

        if (statutActif) {
          const historiqueStatut = entityManager.create(
            HistoriqueStatutAnnonceEntity,
            {
              dateChangement: now,
              commentaire: 'Annonce publiée',
              geler: 0,
              dateCreation: now,
              idusrcreation: idUsr,
              statutAnnonce: statutActif,
              annonce: annonceSauvegarde,
            },
          );
          await entityManager.save(
            HistoriqueStatutAnnonceEntity,
            historiqueStatut,
          );
        }
      } catch (error) {
        console.error('❌ Échec création historique statut annonce :', error);
      }

      // --- ÉTAPE 6 : Sauvegarder les IMAGES ---
      const imagesSauvegardees = [];
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i];
          const image = entityManager.create(AnnonceImageEntity, {
            nom: file.filename,
            order_image: String(i + 1),
            geler: 0,
            dateCreation: now,
            idusrcreation: idUsr,
            annonce: annonceSauvegarde,
          });
          const imgSauvee = await entityManager.save(AnnonceImageEntity, image);
          imagesSauvegardees.push({
            id: imgSauvee.id,
            nom: imgSauvee.nom,
            order_image: imgSauvee.order_image,
          });
        }
      }

      // --- ÉTAPE 7 : Sauvegarder les VIDÉOS ---
      const videosSauvegardees = [];
      if (videos && videos.length > 0) {
        for (let i = 0; i < videos.length; i++) {
          const file = videos[i];
          const video = entityManager.create(AnnonceVideoEntity, {
            nom: file.originalname,
            url_video: file.path,
            description:
              annonceData.videoDescription || 'Vidéo de présentation',
            geler: 0,
            dateCreation: now,
            idusrcreation: idUsr,
            annonce: annonceSauvegarde,
          });
          const vidSauvee = await entityManager.save(
            AnnonceVideoEntity,
            video,
          );
          videosSauvegardees.push({
            id: vidSauvee.id,
            nom: vidSauvee.nom,
            url: vidSauvee.url_video,
          });
        }
      }

      // --- ÉTAPE 8 : Enregistrer les Caractéristiques ---
      let caracteristiquesArray: any[] = [];
      if (Array.isArray(annonceData.caracteristiques)) {
        caracteristiquesArray = annonceData.caracteristiques;
      } else if (
        typeof annonceData.caracteristiques === 'string' &&
        annonceData.caracteristiques.trim().length > 0
      ) {
        try {
          const parsed = JSON.parse(annonceData.caracteristiques);
          if (Array.isArray(parsed)) {
            caracteristiquesArray = parsed;
          }
        } catch (error) {
          console.warn(
            `⚠️ [Publier] Impossible de parser annonceData.caracteristiques`,
          );
        }
      }

      const caracteristiquesSauvegardees = [];
      if (caracteristiquesArray.length > 0) {
        for (const carId of caracteristiquesArray) {
          if (carId) {
            const lienCaracteristique = entityManager.create(
              AnnonceCaracteristiqueEntity,
              {
                valeur: 'Oui',
                geler: 0,
                dateCreation: now,
                idusrcreation: idUsr,
                annonce: annonceSauvegarde,
                caracteristique: {
                  id: Number(carId),
                } as CaracteristiqueEntity,
              },
            );
            const carSauvee = await entityManager.save(
              AnnonceCaracteristiqueEntity,
              lienCaracteristique,
            );
            caracteristiquesSauvegardees.push(carSauvee);
          }
        }
      }

      // --- ÉTAPE 9 : Retourner le résultat ---
      return {
        success: true,
        message: 'Annonce publiée avec succès',
        data: {
          annonceId: annonceSauvegarde.id,
          titre: annonceSauvegarde.titre,
          prix: annonceSauvegarde.prix,
          typePrix: typePrix,
          categorie: categorieNom,
          sousCategorie: sousCategorie.nom,
          typeBien: annonceData.typeBien,
          localisation: localisation
            ? {
                id: localisation.id,
                adresse: localisation.adresse,
                ville: localisation.ville,
              }
            : null,
          images: imagesSauvegardees,
          videos: videosSauvegardees,
          docCv: annonceSauvegarde.doc_cv,
          piece: annonceSauvegarde.piece,
          caracteristiques: caracteristiquesSauvegardees,
        },
      };
    });
  }
}