import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriEntity } from '../../database/favori/favori.entity';
import { AnnonceEntity } from '../../database/annonce/annonce.entity';

@Injectable()
export class FavoriMetierService { 
  constructor(
    @InjectRepository(FavoriEntity)
    private readonly favoriRepository: Repository<FavoriEntity>,

    @InjectRepository(AnnonceEntity)
    private readonly annonceRepository: Repository<AnnonceEntity>,
  ) {}

  /**
   * ✅ Bascule (toggle) : si l'annonce est déjà en favori pour cet
   * utilisateur, on la retire ; sinon on l'ajoute. Un seul endpoint pour
   * le cœur ❤️ de AnnonceDetailPage — pas besoin de connaître l'état
   * actuel côté client avant d'appeler cette route.
   *
   * ⚠️ idUsrConnecte vient du token JWT (@CurrentUser()), jamais du
   * client — impossible de mettre un favori "au nom" de quelqu'un d'autre.
   */
  async toggleFavori(annonceId: number, idUsrConnecte: number) {
    const annonce = await this.annonceRepository.findOne({
      where: { id: annonceId } as any,
    });
    if (!annonce) {
      throw new NotFoundException('Annonce introuvable');
    }

    const favoriExistant = await this.favoriRepository.findOne({
      where: {
        annonce: { id: annonceId } as any,
        idusrcreation: idUsrConnecte,
      },
    });

    if (favoriExistant) {
      // --- Déjà en favori → on le retire ---
      await this.favoriRepository.delete(favoriExistant.id);
      return {
        etat: 'succes',
        message: 'Retiré des favoris',
        data: { estFavori: false },
      };
    }

    // --- Pas encore en favori → on l'ajoute ---
    const nouveauFavori = this.favoriRepository.create({
      type: 'annonce',
      description: null,
      statut: 'actif',
      geler: 0,
      dateCreation: new Date(),
      idusrcreation: idUsrConnecte,
      annonce: { id: annonceId } as any,
    });
    await this.favoriRepository.save(nouveauFavori);

    return {
      etat: 'succes',
      message: 'Ajouté aux favoris',
      data: { estFavori: true },
    };
  }

  /**
   * ✅ Utile pour AnnonceDetailPage : savoir si le cœur doit s'afficher
   * plein ou vide au chargement de la page (sans avoir à charger toute
   * la liste des favoris pour ça).
   */
  async estFavori(annonceId: number, idUsrConnecte: number) {
    const favori = await this.favoriRepository.findOne({
      where: {
        annonce: { id: annonceId } as any,
        idusrcreation: idUsrConnecte,
      },
    });
    return {
      etat: 'succes',
      message: '',
      data: { estFavori: !!favori },
    };
  }

  /**
   * ✅ Liste des annonces mises en favori par l'utilisateur connecté,
   * avec les infos nécessaires à l'affichage (titre, image, prix,
   * adresse) — même logique de formatage que pour les réservations.
   */
  async mesFavoris(idUsrConnecte: number) {
    const favoris = await this.favoriRepository.find({
      where: { idusrcreation: idUsrConnecte },
      relations: [
        'annonce',
        'annonce.images',
        'annonce.sousCategorie',
        'annonce.sousCategorie.categorie',
      ],
      order: { dateCreation: 'DESC' } as any,
    });

    return {
      etat: 'succes',
      message: 'Favoris récupérés',
      data: favoris
        .filter((f) => (f as any).annonce != null) // annonce supprimée entre-temps
        .map((f) => this._formaterFavori(f)),
    };
  }

  private _formaterFavori(favori: FavoriEntity) {
    const annonce: any = (favori as any).annonce;
    const premiereImage = annonce?.images?.[0]?.nom ?? null;

    let prixUnite = 'FCFA';
    switch (annonce?.type_prix) {
      case '1': prixUnite += ' / jour'; break;
      case '2': prixUnite += ' / mois'; break;
      case '3': prixUnite += ' / nuitée'; break;
      case '4': prixUnite += ' / intervention'; break;
      default: break;
    }

    return {
      favoriId: favori.id,
      dateAjout: favori.dateCreation,
      annonce: {
        id: annonce?.id ?? null,
        titre: annonce?.titre ?? 'Annonce',
        adresse: annonce?.adresse ?? '',
        prix: annonce?.prix ?? 0,
        prixFormatte: annonce ? `${annonce.prix} ${prixUnite}` : '',
        imageNom: premiereImage,
        categorie: annonce?.sousCategorie?.categorie?.nom ?? '',
        sousCategorie: annonce?.sousCategorie?.nom ?? '',
      },
    };
  }
}