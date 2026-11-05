// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { AnnonceEntity } from '../../database/annonce/annonce.entity';
// import { CategoriesEntity } from '../../database/categories/categories.entity';
// import { SousCategoriesEntity } from '../../database/sous_categories/sous_categories.entity';
// import { AnnonceVideoEntity } from '../../database/annonce_video/annonce_video.entity';

// @Injectable()
// export class AccueilMetierService {
//   constructor(
//     @InjectRepository(AnnonceEntity)
//     private readonly annonceRepository: Repository<AnnonceEntity>,

//     @InjectRepository(CategoriesEntity)
//     private readonly categoriesRepository: Repository<CategoriesEntity>,

//     @InjectRepository(SousCategoriesEntity)
//     private readonly sousCategoriesRepository: Repository<SousCategoriesEntity>,

//     @InjectRepository(AnnonceVideoEntity)
//     private readonly annonceVideoRepository: Repository<AnnonceVideoEntity>,
//   ) {}

//   async getAllAnnonces(filtres?: {
//     categorieId?: number;
//     sousCategorieId?: number;
//     limit?: number;
//     statut?: string;
//   }) {
//     const queryBuilder = this.annonceRepository.createQueryBuilder('annonce')
//       .leftJoinAndSelect('annonce.sousCategorie', 'sousCategorie')
//       .leftJoinAndSelect('annonce.utilisateur', 'utilisateur')
//       .leftJoinAndSelect('annonce.images', 'images')
//       .leftJoinAndSelect('annonce.avis', 'avis')
//       .leftJoinAndSelect('annonce.videos', 'videos')
//       // ✅ AJOUT : sans ces deux jointures, formaterAnnonce() ne trouve
//       // jamais annonce.annonceCaracteristiques (toujours undefined), et
//       // la section "Caractéristiques & Équipements" affiche à tort
//       // "Aucune caractéristique renseignée" côté Flutter, même quand
//       // l'annonce en a réellement.
//       .leftJoinAndSelect('annonce.annonceCaracteristiques', 'annonceCaracteristiques')
//       .leftJoinAndSelect('annonceCaracteristiques.caracteristique', 'caracteristique')
//       .leftJoinAndSelect('sousCategorie.categorie', 'categorie')
//       .where('annonce.geler = :geler', { geler: 0 });

//     if (filtres?.statut) {
//       queryBuilder.andWhere('annonce.statut = :statut', { statut: filtres.statut });
//     } else {
//       queryBuilder.andWhere('annonce.statut = :statut', { statut: 'Actives' });
//     }

//     if (filtres?.categorieId) {
//       queryBuilder.andWhere('categorie.id = :categorieId', { categorieId: filtres.categorieId });
//     }

//     if (filtres?.sousCategorieId) {
//       queryBuilder.andWhere('sousCategorie.id = :sousCategorieId', { sousCategorieId: filtres.sousCategorieId });
//     }

//     if (filtres?.limit) {
//       queryBuilder.limit(filtres.limit);
//     }

//     queryBuilder.orderBy('annonce.date_publication', 'DESC');

//     const annonces = await queryBuilder.getMany();

//     return {
//       success: true,
//       count: annonces.length,
//       data: annonces.map(annonce => this.formaterAnnonce(annonce)),
//     };
//   }

//   async getAnnonceById(id: number) {
//     const annonce = await this.annonceRepository
//       .createQueryBuilder('annonce')
//       .leftJoinAndSelect('annonce.sousCategorie', 'sousCategorie')
//       .leftJoinAndSelect('sousCategorie.categorie', 'categorie')
//       .leftJoinAndSelect('annonce.utilisateur', 'utilisateur')
//       .leftJoinAndSelect('annonce.images', 'images')
//       .leftJoinAndSelect('annonce.avis', 'avis')
//       .leftJoinAndSelect('annonce.videos', 'videos')
//       .leftJoinAndSelect('annonce.annonceCaracteristiques', 'annonceCaracteristiques')
//       .leftJoinAndSelect('annonceCaracteristiques.caracteristique', 'caracteristique')
//       .where('annonce.id = :id', { id })
//       .andWhere('annonce.geler = :geler', { geler: 0 })
//       .getOne();

//     if (!annonce) {
//       return {
//         success: false,
//         message: 'Annonce non trouvée',
//       };
//     }

//     return {
//       success: true,
//       data: this.formaterAnnonce(annonce),
//     };
//   }

//   async getAnnoncesByCategorie(categorieId: number) {
//     return this.getAllAnnonces({ categorieId });
//   }

//   async getAnnoncesBySousCategorie(sousCategorieId: number) {
//     return this.getAllAnnonces({ sousCategorieId });
//   }

//   async rechercherAnnonces(query: string) {
//     const annonces = await this.annonceRepository.createQueryBuilder('annonce')
//       .leftJoinAndSelect('annonce.sousCategorie', 'sousCategorie')
//       .leftJoinAndSelect('sousCategorie.categorie', 'categorie')
//       .leftJoinAndSelect('annonce.utilisateur', 'utilisateur')
//       .leftJoinAndSelect('annonce.images', 'images')
//       .leftJoinAndSelect('annonce.avis', 'avis')
//       .leftJoinAndSelect('annonce.videos', 'videos')
//       // ✅ AJOUT : même correction que getAllAnnonces().
//       .leftJoinAndSelect('annonce.annonceCaracteristiques', 'annonceCaracteristiques')
//       .leftJoinAndSelect('annonceCaracteristiques.caracteristique', 'caracteristique')
//       .where('annonce.geler = :geler', { geler: 0 })
//       .andWhere('annonce.statut = :statut', { statut: 'Actives' })
//       .andWhere(
//         '(annonce.titre LIKE :query OR annonce.description LIKE :query OR annonce.adresse LIKE :query)',
//         { query: `%${query}%` }
//       )
//       .orderBy('annonce.date_publication', 'DESC')
//       .getMany();

//     return {
//       success: true,
//       count: annonces.length,
//       data: annonces.map(annonce => this.formaterAnnonce(annonce)),
//     };
//   }

//   async getAnnoncesByUtilisateur(utilisateurId: number) {
//     const annonces = await this.annonceRepository.find({
//       where: { utilisateur: { id: utilisateurId }, geler: 0 },
//       relations: [
//         'sousCategorie',
//         'sousCategorie.categorie',
//         'images',
//         'avis',
//         'videos',
//         // ✅ AJOUT : même correction, pour "Mes annonces".
//         'annonceCaracteristiques',
//         'annonceCaracteristiques.caracteristique',
//       ],
//       order: { date_publication: 'DESC' },
//     });

//     return {
//       success: true,
//       count: annonces.length,
//       data: annonces.map(annonce => this.formaterAnnonce(annonce)),
//     };
//   }

//   async getAdressesUniques() {
//     const result = await this.annonceRepository
//       .createQueryBuilder('annonce')
//       .select('annonce.adresse', 'adresse')
//       .where('annonce.geler = :geler', { geler: 0 })
//       .andWhere('annonce.statut = :statut', { statut: 'Actives' })
//       .andWhere('annonce.adresse IS NOT NULL')
//       .andWhere('annonce.adresse != ""')
//       .groupBy('annonce.adresse')
//       .orderBy('annonce.adresse', 'ASC')
//       .getRawMany();

//     return {
//       success: true,
//       data: result.map(item => item.adresse).filter(addr => addr && addr.trim() !== ''),
//     };
//   }

//   async getVideosAnnonces(limit?: number) {
//     const queryBuilder = this.annonceVideoRepository
//       .createQueryBuilder('video')
//       .leftJoinAndSelect('video.annonce', 'annonce')
//       .leftJoinAndSelect('annonce.sousCategorie', 'sousCategorie')
//       .leftJoinAndSelect('sousCategorie.categorie', 'categorie')
//       .leftJoinAndSelect('annonce.utilisateur', 'utilisateur')
//       .leftJoinAndSelect('annonce.avis', 'avis')
//       .where('video.geler = :geler', { geler: 0 })
//       .andWhere('annonce.geler = :geler2', { geler2: 0 })
//       .andWhere('annonce.statut = :statut', { statut: 'Actives' })
//       .orderBy('video.dateCreation', 'DESC');

//     if (limit) {
//       queryBuilder.limit(limit);
//     }

//     const videos = await queryBuilder.getMany();

//     return {
//       success: true,
//       count: videos.length,
//       data: videos.map(video => this.formaterVideoAnnonce(video)),
//     };
//   }

//   private formaterVideoAnnonce(video: AnnonceVideoEntity): any {
//     const annonce = video.annonce;
//     const categorieNom = annonce?.sousCategorie?.categorie?.nom || '';
//     const sousCategorieNom = annonce?.sousCategorie?.nom || '';

//     let prixUnite = 'FCFA';
//     switch (annonce?.type_prix) {
//       case '1': prixUnite += ' / jour'; break;
//       case '2': prixUnite += ' / mois'; break;
//       case '3': prixUnite += ' / nuitée'; break;
//       case '4': prixUnite += ' / intervention'; break;
//       default: break;
//     }

//     return {
//       id: video.id,
//       nom: video.nom,
//       description: video.description,
//       cheminVideo: this.nettoyerCheminFichier(video.url_video),
//       annonce: annonce
//         ? {
//             id: annonce.id,
//             titre: annonce.titre,
//             description: annonce.description,
//             prix: annonce.prix,
//             prixFormatte: `${annonce.prix} ${prixUnite}`,
//             adresse: annonce.adresse,
//             categorie: {
//               id: annonce.sousCategorie?.categorie?.id,
//               nom: categorieNom,
//             },
//             sousCategorie: {
//               id: annonce.sousCategorie?.id,
//               nom: sousCategorieNom,
//             },
//           }
//         : null,
//       utilisateur: annonce?.utilisateur
//         ? {
//             id: annonce.utilisateur.id,
//             nom: annonce.utilisateur.nom,
//             prenom: annonce.utilisateur.prenom,
//           }
//         : null,
//       nombreAvis: annonce?.avis?.length || 0,
//     };
//   }

//   private nettoyerCheminFichier(cheminFichier: string): string {
//     if (!cheminFichier) return '';
//     return cheminFichier
//       .replace(/\\/g, '/')
//       .replace(/^\/+/, '')
//       .replace(/^.*uploads\//, '');
//   }

//   private formaterAnnonce(annonce: AnnonceEntity): any {
//     const categorieNom = annonce.sousCategorie?.categorie?.nom || '';
//     const sousCategorieNom = annonce.sousCategorie?.nom || '';

//     let prixUnite = 'FCFA';
//     switch (annonce.type_prix) {
//       case '1': prixUnite += ' / jour'; break;
//       case '2': prixUnite += ' / mois'; break;
//       case '3': prixUnite += ' / nuitée'; break;
//       case '4': prixUnite += ' / intervention'; break;
//       default: break;
//     }

//     return {
//       id: annonce.id,
//       titre: annonce.titre,
//       prix: annonce.prix,
//       prixFormatte: `${annonce.prix} ${prixUnite}`,
//       type_prix: annonce.type_prix,
//       description: annonce.description,
//       statut: annonce.statut,
//       adresse: annonce.adresse,
//       longitude: annonce.longitude,
//       latitude: annonce.latitude,
//       date_publication: annonce.date_publication,
//       dateCreation: annonce.dateCreation,
//       categorie: {
//         id: annonce.sousCategorie?.categorie?.id,
//         nom: categorieNom,
//       },
//       sousCategorie: {
//         id: annonce.sousCategorie?.id,
//         nom: sousCategorieNom,
//       },
//       utilisateur: annonce.utilisateur
//         ? {
//             id: annonce.utilisateur.id,
//             nom: annonce.utilisateur.nom,
//             prenom: annonce.utilisateur.prenom,
//             contact: annonce.utilisateur.contact,
//             email: annonce.utilisateur.email,
//           }
//         : null,
//       images:
//         annonce.images?.map(img => ({
//           id: img.id,
//           nom: img.nom,
//           order_image: img.order_image,
//         })) || [],
//       avis:
//         annonce.avis?.map(av => ({
//           id: av.id,
//           nom: av.nom,
//           description: av.description,
//           dateCreation: av.dateCreation,
//         })) || [],
//       videos:
//         annonce.videos?.map(v => ({
//           id: v.id,
//           nom: v.nom,
//           description: v.description,
//           cheminVideo: this.nettoyerCheminFichier(v.url_video),
//         })) || [],
//       caracteristiques: annonce.annonceCaracteristiques?.map(ac => ({
//         id: ac.id,
//         nom: ac.caracteristique?.nom || 'Caractéristique',
//         valeur: ac.valeur || 'Oui',
//       })) || [],
//       nombre_chambres: annonce.nombre_chambres,
//       nombre_douches: annonce.nombre_douches,
//       nombre_salon: annonce.nombre_salon,
//       type_location: annonce.type_location,
//       caution_mois: annonce.caution_mois,
//       avance_mois: annonce.avance_mois,
//       frais_visite: annonce.frais_visite,
//       est_meuble: annonce.est_meuble,
//       est_automatique: annonce.est_automatique,
//       a_gps: annonce.a_gps,

//       // AJOUT : CV et piece d'identite (facultatifs)
//       docCv: annonce.doc_cv || null,
//       piece: annonce.piece || null,
//     }
//   }
// } 


import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnonceEntity } from '../../database/annonce/annonce.entity';
import { CategoriesEntity } from '../../database/categories/categories.entity';
import { SousCategoriesEntity } from '../../database/sous_categories/sous_categories.entity';
import { AnnonceVideoEntity } from '../../database/annonce_video/annonce_video.entity';

// ✅ AJOUT : même constante que PublierMetierService — 'Actives'
// (majuscule), plus jamais 'actif' (minuscule), pour rester cohérent
// avec la table de référence statutannonce_san et le dashboard admin.
const STATUT_ACTIF = 'Actives';

@Injectable()
export class AccueilMetierService {
  constructor(
    @InjectRepository(AnnonceEntity)
    private readonly annonceRepository: Repository<AnnonceEntity>,

    @InjectRepository(CategoriesEntity)
    private readonly categoriesRepository: Repository<CategoriesEntity>,

    @InjectRepository(SousCategoriesEntity)
    private readonly sousCategoriesRepository: Repository<SousCategoriesEntity>,

    @InjectRepository(AnnonceVideoEntity)
    private readonly annonceVideoRepository: Repository<AnnonceVideoEntity>,
  ) {}

  async getAllAnnonces(filtres?: {
    categorieId?: number;
    sousCategorieId?: number;
    limit?: number;
    statut?: string;
  }) {
    const queryBuilder = this.annonceRepository.createQueryBuilder('annonce')
      .leftJoinAndSelect('annonce.sousCategorie', 'sousCategorie')
      .leftJoinAndSelect('annonce.utilisateur', 'utilisateur')
      .leftJoinAndSelect('annonce.images', 'images')
      .leftJoinAndSelect('annonce.avis', 'avis')
      .leftJoinAndSelect('annonce.videos', 'videos')
      .leftJoinAndSelect('annonce.annonceCaracteristiques', 'annonceCaracteristiques')
      .leftJoinAndSelect('annonceCaracteristiques.caracteristique', 'caracteristique')
      .leftJoinAndSelect('sousCategorie.categorie', 'categorie')
      .where('annonce.geler = :geler', { geler: 0 });

    // ✅ CORRIGÉ : 'actif' → STATUT_ACTIF ('Actives') — avant, ce filtre
    // par défaut ne trouvait JAMAIS les annonces fraîchement publiées,
    // puisque publierAnnonce() les créait désormais avec 'Actives' mais
    // que ce filtre cherchait encore 'actif'.
    if (filtres?.statut) {
      queryBuilder.andWhere('annonce.statut = :statut', { statut: filtres.statut });
    } else {
      queryBuilder.andWhere('annonce.statut = :statut', { statut: STATUT_ACTIF });
    }

    if (filtres?.categorieId) {
      queryBuilder.andWhere('categorie.id = :categorieId', { categorieId: filtres.categorieId });
    }

    if (filtres?.sousCategorieId) {
      queryBuilder.andWhere('sousCategorie.id = :sousCategorieId', { sousCategorieId: filtres.sousCategorieId });
    }

    if (filtres?.limit) {
      queryBuilder.limit(filtres.limit);
    }

    queryBuilder.orderBy('annonce.date_publication', 'DESC');

    const annonces = await queryBuilder.getMany();

    return {
      success: true,
      count: annonces.length,
      data: annonces.map(annonce => this.formaterAnnonce(annonce)),
    };
  }

  async getAnnonceById(id: number) {
    const annonce = await this.annonceRepository
      .createQueryBuilder('annonce')
      .leftJoinAndSelect('annonce.sousCategorie', 'sousCategorie')
      .leftJoinAndSelect('sousCategorie.categorie', 'categorie')
      .leftJoinAndSelect('annonce.utilisateur', 'utilisateur')
      .leftJoinAndSelect('annonce.images', 'images')
      .leftJoinAndSelect('annonce.avis', 'avis')
      .leftJoinAndSelect('annonce.videos', 'videos')
      .leftJoinAndSelect('annonce.annonceCaracteristiques', 'annonceCaracteristiques')
      .leftJoinAndSelect('annonceCaracteristiques.caracteristique', 'caracteristique')
      .where('annonce.id = :id', { id })
      .andWhere('annonce.geler = :geler', { geler: 0 })
      .getOne();

    if (!annonce) {
      return {
        success: false,
        message: 'Annonce non trouvée',
      };
    }

    return {
      success: true,
      data: this.formaterAnnonce(annonce),
    };
  }

  async getAnnoncesByCategorie(categorieId: number) {
    return this.getAllAnnonces({ categorieId });
  }

  async getAnnoncesBySousCategorie(sousCategorieId: number) {
    return this.getAllAnnonces({ sousCategorieId });
  }

  async rechercherAnnonces(query: string) {
    const annonces = await this.annonceRepository.createQueryBuilder('annonce')
      .leftJoinAndSelect('annonce.sousCategorie', 'sousCategorie')
      .leftJoinAndSelect('sousCategorie.categorie', 'categorie')
      .leftJoinAndSelect('annonce.utilisateur', 'utilisateur')
      .leftJoinAndSelect('annonce.images', 'images')
      .leftJoinAndSelect('annonce.avis', 'avis')
      .leftJoinAndSelect('annonce.videos', 'videos')
      .leftJoinAndSelect('annonce.annonceCaracteristiques', 'annonceCaracteristiques')
      .leftJoinAndSelect('annonceCaracteristiques.caracteristique', 'caracteristique')
      .where('annonce.geler = :geler', { geler: 0 })
      // ✅ CORRIGÉ : 'actif' → STATUT_ACTIF.
      .andWhere('annonce.statut = :statut', { statut: STATUT_ACTIF })
      .andWhere(
        '(annonce.titre LIKE :query OR annonce.description LIKE :query OR annonce.adresse LIKE :query)',
        { query: `%${query}%` }
      )
      .orderBy('annonce.date_publication', 'DESC')
      .getMany();

    return {
      success: true,
      count: annonces.length,
      data: annonces.map(annonce => this.formaterAnnonce(annonce)),
    };
  }

  async getAnnoncesByUtilisateur(utilisateurId: number) {
    const annonces = await this.annonceRepository.find({
      where: { utilisateur: { id: utilisateurId }, geler: 0 },
      relations: [
        'sousCategorie',
        'sousCategorie.categorie',
        'images',
        'avis',
        'videos',
        'annonceCaracteristiques',
        'annonceCaracteristiques.caracteristique',
      ],
      order: { date_publication: 'DESC' },
    });

    return {
      success: true,
      count: annonces.length,
      data: annonces.map(annonce => this.formaterAnnonce(annonce)),
    };
  }

  async getAdressesUniques() {
    const result = await this.annonceRepository
      .createQueryBuilder('annonce')
      .select('annonce.adresse', 'adresse')
      .where('annonce.geler = :geler', { geler: 0 })
      // ✅ CORRIGÉ : 'actif' → STATUT_ACTIF.
      .andWhere('annonce.statut = :statut', { statut: STATUT_ACTIF })
      .andWhere('annonce.adresse IS NOT NULL')
      .andWhere('annonce.adresse != ""')
      .groupBy('annonce.adresse')
      .orderBy('annonce.adresse', 'ASC')
      .getRawMany();

    return {
      success: true,
      data: result.map(item => item.adresse).filter(addr => addr && addr.trim() !== ''),
    };
  }

  async getVideosAnnonces(limit?: number) {
    const queryBuilder = this.annonceVideoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.annonce', 'annonce')
      .leftJoinAndSelect('annonce.sousCategorie', 'sousCategorie')
      .leftJoinAndSelect('sousCategorie.categorie', 'categorie')
      .leftJoinAndSelect('annonce.utilisateur', 'utilisateur')
      .leftJoinAndSelect('annonce.avis', 'avis')
      .where('video.geler = :geler', { geler: 0 })
      .andWhere('annonce.geler = :geler2', { geler2: 0 })
      // ✅ CORRIGÉ : 'actif' → STATUT_ACTIF.
      .andWhere('annonce.statut = :statut', { statut: STATUT_ACTIF })
      .orderBy('video.dateCreation', 'DESC');

    if (limit) {
      queryBuilder.limit(limit);
    }

    const videos = await queryBuilder.getMany();

    return {
      success: true,
      count: videos.length,
      data: videos.map(video => this.formaterVideoAnnonce(video)),
    };
  }

  private formaterVideoAnnonce(video: AnnonceVideoEntity): any {
    const annonce = video.annonce;
    const categorieNom = annonce?.sousCategorie?.categorie?.nom || '';
    const sousCategorieNom = annonce?.sousCategorie?.nom || '';

    let prixUnite = 'FCFA';
    switch (annonce?.type_prix) {
      case '1': prixUnite += ' / jour'; break;
      case '2': prixUnite += ' / mois'; break;
      case '3': prixUnite += ' / nuitée'; break;
      case '4': prixUnite += ' / intervention'; break;
      default: break;
    }

    return {
      id: video.id,
      nom: video.nom,
      description: video.description,
      cheminVideo: this.nettoyerCheminFichier(video.url_video),
      annonce: annonce
        ? {
            id: annonce.id,
            titre: annonce.titre,
            description: annonce.description,
            prix: annonce.prix,
            prixFormatte: `${annonce.prix} ${prixUnite}`,
            adresse: annonce.adresse,
            categorie: {
              id: annonce.sousCategorie?.categorie?.id,
              nom: categorieNom,
            },
            sousCategorie: {
              id: annonce.sousCategorie?.id,
              nom: sousCategorieNom,
            },
          }
        : null,
      utilisateur: annonce?.utilisateur
        ? {
            id: annonce.utilisateur.id,
            nom: annonce.utilisateur.nom,
            prenom: annonce.utilisateur.prenom,
          }
        : null,
      nombreAvis: annonce?.avis?.length || 0,
    };
  }

  private nettoyerCheminFichier(cheminFichier: string): string {
    if (!cheminFichier) return '';
    return cheminFichier
      .replace(/\\/g, '/')
      .replace(/^\/+/, '')
      .replace(/^.*uploads\//, '');
  }

  private formaterAnnonce(annonce: AnnonceEntity): any {
    const categorieNom = annonce.sousCategorie?.categorie?.nom || '';
    const sousCategorieNom = annonce.sousCategorie?.nom || '';

    let prixUnite = 'FCFA';
    switch (annonce.type_prix) {
      case '1': prixUnite += ' / jour'; break;
      case '2': prixUnite += ' / mois'; break;
      case '3': prixUnite += ' / nuitée'; break;
      case '4': prixUnite += ' / intervention'; break;
      default: break;
    }

    return {
      id: annonce.id,
      titre: annonce.titre,
      prix: annonce.prix,
      prixFormatte: `${annonce.prix} ${prixUnite}`,
      type_prix: annonce.type_prix,
      description: annonce.description,
      statut: annonce.statut,
      adresse: annonce.adresse,
      longitude: annonce.longitude,
      latitude: annonce.latitude,
      date_publication: annonce.date_publication,
      dateCreation: annonce.dateCreation,
      categorie: {
        id: annonce.sousCategorie?.categorie?.id,
        nom: categorieNom,
      },
      sousCategorie: {
        id: annonce.sousCategorie?.id,
        nom: sousCategorieNom,
      },
      utilisateur: annonce.utilisateur
        ? {
            id: annonce.utilisateur.id,
            nom: annonce.utilisateur.nom,
            prenom: annonce.utilisateur.prenom,
            contact: annonce.utilisateur.contact,
            email: annonce.utilisateur.email,
          }
        : null,
      images:
        annonce.images?.map(img => ({
          id: img.id,
          nom: img.nom,
          order_image: img.order_image,
        })) || [],
      avis:
        annonce.avis?.map(av => ({
          id: av.id,
          nom: av.nom,
          description: av.description,
          dateCreation: av.dateCreation,
        })) || [],
      videos:
        annonce.videos?.map(v => ({
          id: v.id,
          nom: v.nom,
          description: v.description,
          cheminVideo: this.nettoyerCheminFichier(v.url_video),
        })) || [],
      caracteristiques: annonce.annonceCaracteristiques?.map(ac => ({
        id: ac.id,
        nom: ac.caracteristique?.nom || 'Caractéristique',
        valeur: ac.valeur || 'Oui',
      })) || [],
      nombre_chambres: annonce.nombre_chambres,
      nombre_douches: annonce.nombre_douches,
      nombre_salon: annonce.nombre_salon,
      type_location: annonce.type_location,
      caution_mois: annonce.caution_mois,
      avance_mois: annonce.avance_mois,
      frais_visite: annonce.frais_visite,
      est_meuble: annonce.est_meuble,
      est_automatique: annonce.est_automatique,
      a_gps: annonce.a_gps,
      docCv: annonce.doc_cv || null,
      piece: annonce.piece || null,
    }
  }
} 