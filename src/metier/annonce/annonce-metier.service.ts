import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnnonceEntity } from 'src/database/annonce/annonce.entity';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { SousCategoriesEntity } from '../../database/sous_categories/sous_categories.entity';
import { AnnonceCaracteristiqueEntity } from '../../database/annonce_caracteristique/annonce_caracteristique.entity';
import { AbonnementEntity } from 'src/database/abonnement/abonnement.entity';
import { AnnonceVideoEntity } from 'src/database/annonce_video/annonce_video.entity';
import { AnnonceImageEntity } from 'src/database/annonce_image/annonce_image.entity';
import { HistoriqueStatutAnnonceEntity } from 'src/database/historique_statut_annonce/historique_statut_annonce.entity';
import { StatutAnnonceEntity } from 'src/database/statut_annonce/statut_annonce.entity';
import { UtilisateurEntity } from 'src/database/utilisateur/utilisateur.entity';

// ✅ Constante unique du statut "actif"
const STATUT_ACTIF = 'Actives';

@Injectable()
export class AnnonceMetierService {
  constructor(
    @InjectRepository(AnnonceEntity)
    private readonly annonceRepository: Repository<AnnonceEntity>,
  ) {}

  // =========================================================================
  // LISTE
  // =========================================================================

  async getListeAnnonceAll(params?: any) {
    const queryBuilder = this.annonceRepository
      .createQueryBuilder('annonce')
      .select(['annonce', 'utilisateur', 'sousCategorie', 'categorie', 'images'])
      .leftJoin('annonce.utilisateur', 'utilisateur')
      .leftJoin('annonce.sousCategorie', 'sousCategorie')
      .leftJoin('sousCategorie.categorie', 'categorie')
      .leftJoin('annonce.images', 'images')
      .where('annonce.geler = 0');

    if (params?.periodicite) {
      switch (params.periodicite) {
        case 'jour':
          if (params.dateJour) {
            const dateDebut = new Date(params.dateJour);
            dateDebut.setHours(0, 0, 0, 0);
            const dateFin = new Date(params.dateJour);
            dateFin.setHours(23, 59, 59, 999);

            queryBuilder.andWhere(
              'annonce.dateCreation BETWEEN :dateDebut AND :dateFin',
              { dateDebut, dateFin },
            );
          }
          break;

        case 'semaine':
          if (params.dateDebut && params.dateFin) {
            const dateDebut = new Date(params.dateDebut);
            dateDebut.setHours(0, 0, 0, 0);
            const dateFin = new Date(params.dateFin);
            dateFin.setHours(23, 59, 59, 999);

            queryBuilder.andWhere(
              'annonce.dateCreation BETWEEN :dateDebut AND :dateFin',
              { dateDebut, dateFin },
            );
          } else if (params.semaine && params.annee) {
            const dateDebut = this._getDateOfWeek(
              parseInt(params.annee),
              parseInt(params.semaine),
            );
            const dateFin = new Date(dateDebut);
            dateFin.setDate(dateFin.getDate() + 6);
            dateFin.setHours(23, 59, 59, 999);

            queryBuilder.andWhere(
              'annonce.dateCreation BETWEEN :dateDebut AND :dateFin',
              { dateDebut, dateFin },
            );
          }
          break;

        case 'mois':
          if (params.mois && params.annee) {
            const mois = parseInt(params.mois) - 1;
            const annee = parseInt(params.annee);
            const dateDebut = new Date(annee, mois, 1);
            const dateFin = new Date(annee, mois + 1, 0, 23, 59, 59, 999);

            queryBuilder.andWhere(
              'annonce.dateCreation BETWEEN :dateDebut AND :dateFin',
              { dateDebut, dateFin },
            );
          }
          break;

        case 'annee':
          if (params.annee) {
            const annee = parseInt(params.annee);
            const dateDebut = new Date(annee, 0, 1);
            const dateFin = new Date(annee, 11, 31, 23, 59, 59, 999);

            queryBuilder.andWhere(
              'annonce.dateCreation BETWEEN :dateDebut AND :dateFin',
              { dateDebut, dateFin },
            );
          }
          break;
      }
    }

    queryBuilder
      .orderBy('annonce.dateCreation', 'DESC')
      .addOrderBy('images.order_image', 'ASC');

    const annonces = await queryBuilder.getMany();

    return {
      etat: 'succes',
      message: 'Annonces récupérées',
      data: annonces.map((a) => this._formaterListe(a)),
    };
  }

  private _getDateOfWeek(annee: number, semaine: number): Date {
    const date = new Date(annee, 0, 1);
    const dayOfWeek = date.getDay();
    const daysToAdd = (semaine - 1) * 7 - dayOfWeek + 1;
    date.setDate(date.getDate() + daysToAdd);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  // =========================================================================
  // DÉTAIL
  // =========================================================================

  async findById(id: number) {
    const annonce = await this.annonceRepository
      .createQueryBuilder('annonce')
      .select([
        'annonce',
        'utilisateur',
        'sousCategorie',
        'categorie',
        'images',
        'videos',
        'avis',
        'annonceCaracteristiques',
        'caracteristique',
      ])
      .leftJoin('annonce.utilisateur', 'utilisateur')
      .leftJoin('annonce.sousCategorie', 'sousCategorie')
      .leftJoin('sousCategorie.categorie', 'categorie')
      .leftJoin('annonce.images', 'images')
      .leftJoin('annonce.videos', 'videos')
      .leftJoin('annonce.avis', 'avis')
      .leftJoin('annonce.annonceCaracteristiques', 'annonceCaracteristiques')
      .leftJoin('annonceCaracteristiques.caracteristique', 'caracteristique')
      .where('annonce.geler = 0')
      .andWhere('annonce.id = :id', { id })
      .getOne();

    if (!annonce) {
      throw new NotFoundException('Annonce introuvable');
    }

    return {
      etat: 'succes',
      message: 'Annonce récupérée',
      data: this._formaterDetail(annonce),
    };
  }

  // =========================================================================
  // MODIFICATION
  // =========================================================================

  async modifier(id: number, updateData: any) {
    return this.annonceRepository.manager.transaction(async (manager) => {
      const annonce = await manager.findOne(AnnonceEntity, {
        where: { id } as any,
      });
      if (!annonce) {
        throw new NotFoundException('Annonce introuvable');
      }

      let sousCategorie: SousCategoriesEntity | undefined;
      if (updateData.sousCategorieId) {
        const trouvee = await manager.findOne(SousCategoriesEntity, {
          where: { id: updateData.sousCategorieId } as any,
        });
        if (!trouvee) {
          throw new NotFoundException('Sous-catégorie introuvable');
        }
        sousCategorie = trouvee;
      }

      await manager.update(
        AnnonceEntity,
        { id } as any,
        {
          titre: updateData.titre,
          description: updateData.description,
          prix: updateData.prix ?? 0,
          type_prix: updateData.typePrix ?? annonce.type_prix,
          adresse: updateData.adresse,
          longitude: updateData.longitude ?? annonce.longitude,
          latitude: updateData.latitude ?? annonce.latitude,
          nombre_chambres:
            updateData.nombreChambres ?? annonce.nombre_chambres,
          nombre_douches: updateData.nombreDouches ?? annonce.nombre_douches,
          nombre_salon: updateData.nombreSalon ?? annonce.nombre_salon,
          type_location: updateData.typeLocation ?? annonce.type_location,
          caution_mois:
            updateData.cautionMois !== undefined
              ? String(updateData.cautionMois)
              : annonce.caution_mois,
          avance_mois:
            updateData.avanceMois !== undefined
              ? String(updateData.avanceMois)
              : annonce.avance_mois,
          frais_visite: updateData.fraisVisite ?? annonce.frais_visite,
          est_meuble: updateData.estMeuble ?? annonce.est_meuble,
          est_automatique:
            updateData.estAutomatique ?? annonce.est_automatique,
          a_gps: updateData.aGps ?? annonce.a_gps,
          ...(sousCategorie ? { sousCategorie } : {}),
        },
      );

      if (Array.isArray(updateData.caracteristiquesIds)) {
        await manager.delete(AnnonceCaracteristiqueEntity, {
          annonce: { id } as any,
        });

        for (const carId of updateData.caracteristiquesIds) {
          if (carId) {
            const lien = manager.create(AnnonceCaracteristiqueEntity, {
              valeur: 'Oui',
              geler: 0,
              dateCreation: new Date(),
              idusrcreation: annonce.idusrcreation,
              annonce: { id } as any,
              caracteristique: { id: Number(carId) } as any,
            });
            await manager.save(AnnonceCaracteristiqueEntity, lien);
          }
        }
      }

      return {
        etat: 'succes',
        message: 'Annonce modifiée avec succès',
        data: null,
      };
    });
  }

  // =========================================================================
  // VALIDER / REFUSER / SUPPRIMER
  // =========================================================================

  async valider(id: number) {
    const annonce = await this.annonceRepository.findOne({
      where: { id } as any,
    });
    if (!annonce) {
      throw new NotFoundException('Annonce introuvable');
    }
    annonce.statut = 'Actives';
    await this.annonceRepository.save(annonce);
    return {
      etat: 'succes',
      message: 'Annonce validée avec succès',
      data: null,
    };
  }

  async refuser(id: number) {
    const annonce = await this.annonceRepository.findOne({
      where: { id } as any,
    });
    if (!annonce) {
      throw new NotFoundException('Annonce introuvable');
    }
    annonce.statut = 'Réfusées';
    await this.annonceRepository.save(annonce);
    return {
      etat: 'succes',
      message: 'Annonce refusée avec succès',
      data: null,
    };
  }

  async supprimer(id: number) {
    const annonce = await this.annonceRepository.findOne({
      where: { id } as any,
    });
    if (!annonce) {
      throw new NotFoundException('Annonce introuvable');
    }
    annonce.geler = 1;
    await this.annonceRepository.save(annonce);
    return {
      etat: 'succes',
      message: 'Annonce supprimée avec succès',
      data: null,
    };
  }

  // =========================================================================
  // PUBLICATION
  // =========================================================================

  async publierAnnonce(
    annonceData: any,
    images: Express.Multer.File[] = [],
    videos: Express.Multer.File[] = [],
    cvFile: Express.Multer.File | null = null,
    pieceFile: Express.Multer.File | null = null,
  ) {
    return await this.annonceRepository.manager.transaction(async (manager) => {
      const now = new Date();
      const idUsr = Number(
        annonceData.id_usr || annonceData.idusrcreation || 1,
      );

      // ÉTAPE 0 : Vérifier les limites
      await this._verifierLimites(
        manager,
        idUsr,
        images?.length ?? 0,
        videos?.length ?? 0,
      );

      // ÉTAPE 1 : Sous-catégorie
      const idSca = Number(annonceData.id_sca);
      if (!idSca) {
        throw new NotFoundException('Sous-catégorie obligatoire');
      }

      const sousCategorie = await manager.findOne(SousCategoriesEntity, {
        where: { id: idSca },
        relations: ['categorie'],
      });

      if (!sousCategorie) {
        throw new NotFoundException(
          `Sous-catégorie avec l'ID ${idSca} non trouvée`,
        );
      }

      const categorieNom = sousCategorie.categorie?.nom || '';

      // ÉTAPE 2 : Utilisateur
      const utilisateur = await manager.findOne(UtilisateurEntity, {
        where: { id: idUsr },
      });

      if (!utilisateur) {
        throw new NotFoundException('Utilisateur introuvable');
      }

      // ÉTAPE 3 : Type de prix
      let typePrix = '1';
      if (annonceData.type_prix || annonceData.typePrix) {
        typePrix = String(annonceData.type_prix || annonceData.typePrix);
      }

      // ÉTAPE 4 : Créer l'annonce
      const annonce = manager.create(AnnonceEntity, {
        titre: annonceData.titre || '',
        prix: Number(annonceData.prix) || 0,
        description: annonceData.description || '',
        type_prix: typePrix,
        statut: STATUT_ACTIF,
        date_publication: now,
        longitude: Number(annonceData.longitude) || 0,
        latitude: Number(annonceData.latitude) || 0,
        adresse: annonceData.adresse || '',
        nombre_chambres:
          Number(annonceData.nombre_chambres || annonceData.chambres) || 0,
        nombre_douches:
          Number(annonceData.nombre_douches || annonceData.douches) || 0,
        nombre_salon:
          Number(annonceData.nombre_salon || annonceData.salons) || 0,
        type_location:
          annonceData.type_location ||
          annonceData.typeLocation ||
          'Location simple',
        caution_mois: String(
          annonceData.caution_mois || annonceData.cautionMois || 0,
        ),
        avance_mois: String(
          annonceData.avance_mois || annonceData.avanceMois || 0,
        ),
        frais_visite:
          Number(annonceData.frais_visite || annonceData.fraisEntree) || 0,
        est_meuble: this._toBoolean(
          annonceData.est_meuble ?? annonceData.meuble,
        ),
        est_automatique: this._toBoolean(
          annonceData.est_automatique ?? annonceData.automatique,
        ),
        a_gps: this._toBoolean(annonceData.a_gps ?? annonceData.gps),
        doc_cv: cvFile?.filename ?? null,
        piece: pieceFile?.filename ?? null,
        empty1: '',
        empty2: '',
        empty3: '',
        geler: 0,
        dateCreation: now,
        idusrcreation: idUsr,
        sousCategorie,
        utilisateur,
      });

      const annonceSauvee = await manager.save(AnnonceEntity, annonce);

      // ÉTAPE 5 : Historique
      try {
        const statutActif = await manager.findOne(StatutAnnonceEntity, {
          where: { libelle: STATUT_ACTIF },
        });
        if (statutActif) {
          const histo = manager.create(HistoriqueStatutAnnonceEntity, {
            dateChangement: now,
            commentaire: 'Annonce publiée',
            geler: 0,
            dateCreation: now,
            idusrcreation: idUsr,
            statutAnnonce: statutActif,
            annonce: annonceSauvee,
          });
          await manager.save(HistoriqueStatutAnnonceEntity, histo);
        }
      } catch (error) {
        console.error('❌ Historique statut :', error);
      }

      // ÉTAPE 6 : Images
      const imagesSauvees: any[] = [];
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i];
          const image = manager.create(AnnonceImageEntity, {
            nom: file.filename,
            order_image: String(i + 1),
            geler: 0,
            dateCreation: now,
            idusrcreation: idUsr,
            annonce: annonceSauvee,
          });
          const saved = await manager.save(AnnonceImageEntity, image);
          imagesSauvees.push({
            id: saved.id,
            nom: saved.nom,
            order_image: saved.order_image,
          });
        }
      }

      // ÉTAPE 7 : Vidéos
      const videosSauvees: any[] = [];
      if (videos && videos.length > 0) {
        for (const file of videos) {
          const video = manager.create(AnnonceVideoEntity, {
            nom: file.originalname,
            url_video: file.path,
            description:
              annonceData.videoDescription || 'Vidéo de présentation',
            geler: 0,
            dateCreation: now,
            idusrcreation: idUsr,
            annonce: annonceSauvee,
          });
          const saved = await manager.save(AnnonceVideoEntity, video);
          videosSauvees.push({
            id: saved.id,
            nom: saved.nom,
            url: saved.url_video,
          });
        }
      }

      // ÉTAPE 8 : Caractéristiques
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
        } catch {
          console.warn('⚠️ Impossible de parser caracteristiques');
        }
      }

      const caracteristiquesSauvees: any[] = [];
      for (const carId of caracteristiquesArray) {
        if (carId) {
          const lien = manager.create(AnnonceCaracteristiqueEntity, {
            valeur: 'Oui',
            geler: 0,
            dateCreation: now,
            idusrcreation: idUsr,
            annonce: annonceSauvee,
            caracteristique: { id: Number(carId) } as any,
          });
          const saved = await manager.save(
            AnnonceCaracteristiqueEntity,
            lien,
          );
          caracteristiquesSauvees.push(saved);
        }
      }

      // ÉTAPE 9 : Retour
      return {
        success: true,
        etat: 'succes',
        message: 'Annonce publiée avec succès',
        data: {
          annonceId: annonceSauvee.id,
          titre: annonceSauvee.titre,
          prix: annonceSauvee.prix,
          typePrix,
          categorie: categorieNom,
          sousCategorie: sousCategorie.nom,
          images: imagesSauvees,
          videos: videosSauvees,
          caracteristiques: caracteristiquesSauvees,
        },
      };
    });
  }

  // =========================================================================
  // VÉRIFICATION DES LIMITES D'ABONNEMENT
  // =========================================================================

  private async _verifierLimites(
    manager: any,
    idUsr: number,
    nombrePhotos: number,
    nombreVideos: number,
  ): Promise<void> {
    const maintenant = new Date();

    const abonnement = await manager.findOne(AbonnementEntity, {
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
          dateFin: MoreThanOrEqual(maintenant),
          geler: 0,
        },
      ],
      relations: ['plan'],
      order: { dateCreation: 'DESC' },
    });

    if (!abonnement || !abonnement.plan) {
      throw new ForbiddenException(
        'Vous devez avoir un abonnement actif pour publier une annonce.',
      );
    }

    const plan = abonnement.plan;

    // Limite annonces
    const nombreAnnoncesActuelles = await manager.count(AnnonceEntity, {
      where: { utilisateur: { id: idUsr }, geler: 0 },
    });

    const limiteAnnonces = plan.nbAnnoncesMax;
    const estIllimite = limiteAnnonces >= 999999;

    if (!estIllimite && nombreAnnoncesActuelles >= limiteAnnonces) {
      throw new ForbiddenException(
        `Vous avez atteint la limite de ${limiteAnnonces} annonces de votre forfait "${plan.nom}".`,
      );
    }

    // Limite photos
    const limitePhotos = plan.nbPhotosMax;
    const photosIllimitees = limitePhotos >= 999999;

    if (!photosIllimitees && nombrePhotos > limitePhotos) {
      throw new ForbiddenException(
        `Votre forfait "${plan.nom}" permet ${limitePhotos} photos par annonce maximum.`,
      );
    }

    // Limite vidéos
    const videosAutorisees = plan.videoAutorisee === 1;

    if (!videosAutorisees && nombreVideos > 0) {
      throw new ForbiddenException(
        `Les vidéos ne sont pas autorisées avec le forfait "${plan.nom}".`,
      );
    }

    // Gratuit : 1 vidéo max
    if (plan.code === 'gratuit' && nombreVideos > 1) {
      throw new ForbiddenException(
        `Le forfait GRATUIT permet 1 vidéo par annonce maximum.`,
      );
    }
  }

  // =========================================================================
  // HELPERS
  // =========================================================================

  private _nettoyerCheminFichier(cheminFichier: string): string {
    if (!cheminFichier) return '';
    return cheminFichier
      .replace(/\\/g, '/')
      .replace(/^\/+/, '')
      .replace(/^.*uploads\//, '');
  }

  private _prixFormatte(annonce: AnnonceEntity): {
    sansPrix: boolean;
    prixFormatte: string | null;
  } {
    let uniteAffichee = 'FCFA';
    switch (annonce.type_prix) {
      case '1':
        uniteAffichee += ' / jour';
        break;
      case '2':
        uniteAffichee += ' / mois';
        break;
      case '3':
        uniteAffichee += ' / nuitée';
        break;
      case '4':
        uniteAffichee += ' / intervention';
        break;
    }
    const sansPrix = !annonce.prix || annonce.prix <= 0;
    return {
      sansPrix,
      prixFormatte: sansPrix
        ? null
        : `${(annonce.prix ?? 0).toLocaleString('fr-FR')} ${uniteAffichee}`,
    };
  }

  private _formaterListe(annonce: AnnonceEntity) {
    const proprietaire = (annonce as any).utilisateur;
    const sousCategorie = (annonce as any).sousCategorie;
    const categorie = sousCategorie?.categorie;
    const nomProprietaire = proprietaire
      ? [proprietaire.prenom, proprietaire.nom].filter((v) => !!v).join(' ')
      : 'Utilisateur inconnu';
    const { sansPrix, prixFormatte } = this._prixFormatte(annonce);

    return {
      id: annonce.id,
      titre: annonce.titre,
      prix: annonce.prix,
      sansPrix,
      prixFormatte,
      statut: annonce.statut,
      dateCreation: annonce.dateCreation,
      categorie: categorie
        ? { id: categorie.id, nom: categorie.nom }
        : null,
      sousCategorie: sousCategorie
        ? { id: sousCategorie.id, nom: sousCategorie.nom }
        : null,
      proprietaire: proprietaire
        ? {
            id: proprietaire.id,
            nom: nomProprietaire,
            contact: proprietaire.contact,
          }
        : null,
      images:
        (annonce as any).images?.map((img: any) => ({
          id: img.id,
          nom: this._nettoyerCheminFichier(img.nom),
          ordre: img.order_image,
        })) || [],
    };
  }

  private _formaterDetail(annonce: AnnonceEntity) {
    const proprietaire = (annonce as any).utilisateur;
    const sousCategorie = (annonce as any).sousCategorie;
    const categorie = sousCategorie?.categorie;
    const nomProprietaire = proprietaire
      ? [proprietaire.prenom, proprietaire.nom].filter((v) => !!v).join(' ')
      : 'Utilisateur inconnu';
    const { sansPrix, prixFormatte } = this._prixFormatte(annonce);

    return {
      id: annonce.id,
      titre: annonce.titre,
      description: annonce.description,
      prix: annonce.prix,
      typePrix: annonce.type_prix,
      sansPrix,
      prixFormatte,
      statut: annonce.statut,
      adresse: annonce.adresse,
      dateCreation: annonce.dateCreation,
      longitude: annonce.longitude,
      latitude: annonce.latitude,
      typeLocation: annonce.type_location,
      conditionsLocation: {
        cautionMois: annonce.caution_mois,
        avanceMois: annonce.avance_mois,
        fraisVisite: annonce.frais_visite,
      },
      categorie: categorie
        ? { id: categorie.id, nom: categorie.nom }
        : null,
      sousCategorie: sousCategorie
        ? { id: sousCategorie.id, nom: sousCategorie.nom }
        : null,
      proprietaire: proprietaire
        ? {
            id: proprietaire.id,
            nom: nomProprietaire,
            contact: proprietaire.contact, 
            email: proprietaire.email,
          }
        : null,
      images:
        (annonce as any).images?.map((img: any) => ({
          id: img.id,
          nom: this._nettoyerCheminFichier(img.nom),
          ordre: img.order_image,
        })) || [],
      videos:
        (annonce as any).videos?.map((v: any) => ({
          id: v.id,
          nom: v.nom,
          description: v.description,
          cheminVideo: this._nettoyerCheminFichier(v.url_video),
        })) || [],
      avis:
        (annonce as any).avis?.map((av: any) => ({
          id: av.id,
          nom: av.nom,
          description: av.description,
          dateCreation: av.dateCreation,
        })) || [],
      nombreAvis: (annonce as any).avis?.length || 0,
      caracteristiques:
        (annonce as any).annonceCaracteristiques?.map((ac: any) => ({
          id: ac.id,
          caracteristiqueId: ac.caracteristique?.id,
          nom: ac.caracteristique?.nom || 'Caractéristique',
          valeur: ac.valeur || 'Oui',
        })) || [],
      nombreChambres: annonce.nombre_chambres,
      nombreDouches: annonce.nombre_douches,
      nombreSalon: annonce.nombre_salon,
      estMeuble: annonce.est_meuble,
      estAutomatique: annonce.est_automatique,
      aGps: annonce.a_gps,
      docCv: annonce.doc_cv
        ? this._nettoyerCheminFichier(annonce.doc_cv)
        : null,
      piece: annonce.piece
        ? this._nettoyerCheminFichier(annonce.piece)
        : null,
    };
  }

  // =========================================================================
  // HELPER : Conversion booléenne
  // =========================================================================

  private _toBoolean(value: any): boolean {
    if (
      value === true ||
      value === 1 ||
      value === '1' ||
      value === 'true'
    ) {
      return true;
    }
    return false;
  }
}