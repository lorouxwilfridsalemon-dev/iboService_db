import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AnnonceEntity } from '../../database/annonce/annonce.entity';
import { SousCategoriesEntity } from 'src/database/sous_categories/sous_categories.entity';
import { CategoriesEntity } from 'src/database/categories/categories.entity';

@Injectable()    
export class SousCategoriesMetierService {
  constructor(
    @InjectRepository(SousCategoriesEntity)
    private readonly sousCategoriesRepository: Repository<SousCategoriesEntity>,

    @InjectRepository(AnnonceEntity)
    private readonly annonceRepository: Repository<AnnonceEntity>,
  ) {}

  /**
   * GET /metier/sous-categories
   * GET /metier/sous-categories/getListeSousCategories (alias, celui
   * appelé par le frontend Angular).
   * Liste toutes les sous-catégories actives, avec leur catégorie
   * parente chargée et le nombre d'annonces qui l'utilisent.
   */
  async findAll() {
    const sousCategories = await this.sousCategoriesRepository.find({
      where: { geler: 0 } as any,
      relations: ['categorie'],
      order: { id: 'DESC' } as any,
    });

    const data = await Promise.all(
      sousCategories.map((sc) => this._formaterAvecNombreAnnonces(sc)),
    );

    return {
      etat: 'succes',
      message: 'Sous-catégories récupérées',
      data,
    };
  }

  /**
   * GET /metier/sous-categories/:id
   */
  async findById(id: number) {
    const sousCategorie = await this.sousCategoriesRepository.findOne({
      where: { id } as any,
      relations: ['categorie'],
    });

    if (!sousCategorie) {
      throw new NotFoundException('Sous-catégorie introuvable');
    }

    return {
      etat: 'succes',
      message: 'Sous-catégorie récupérée',
      data: await this._formaterAvecNombreAnnonces(sousCategorie),
    };
  }

  /**
   * GET /metier/sous-categories/categorie/:categorieId
   */
  async findByCategorie(categorieId: number) {
    const sousCategories = await this.sousCategoriesRepository.find({
      where: {
        geler: 0,
        categorie: { id: categorieId },
      } as any,
      relations: ['categorie'],
      order: { nom: 'ASC' } as any,
    });

    return {
      etat: 'succes',
      message: 'Sous-catégories de la catégorie récupérées',
      data: sousCategories.map((sc) => ({
        id: sc.id,
        nom: sc.nom,
        description: sc.description,
      })),
    };
  }

  /**
   * ✅ COMPLÉTÉ : POST /metier/sous-categories/ajouterSousCategories
   * Point d'entrée public — ouvre une transaction et délègue le
   * travail réel à saveAjouterSousCategories().
   */
  async ajouterSousCategories(sousCategoriesData: any) {
    const sousCategorieCree = await this.sousCategoriesRepository.manager.transaction(
      async (manager) => this.saveAjouterSousCategories(manager, sousCategoriesData),
    );

    return {
      etat: 'succes',
      message: 'Sous-catégorie créée avec succès',
      data: await this._formaterAvecNombreAnnonces(sousCategorieCree),
    };
  }

  /**
   * ✅ COMPLÉTÉ : construit et enregistre la nouvelle sous-catégorie.
   * Reçoit directement l'EntityManager de la transaction ouverte par
   * ajouterSousCategories(), pour que tout (recherche de la catégorie
   * + sauvegarde) se fasse dans la même transaction.
   */
  async saveAjouterSousCategories(manager: EntityManager, sousCategoriesData: any) {
    console.log('data front=>', sousCategoriesData);

    // ✅ On retrouve la catégorie parente à partir de son id — envoyé
    // par le formulaire Angular sous la forme { categorieId: X } ou
    // { categorie: { id: X } } (les deux formes sont gérées ici).
    const categorieId =
      sousCategoriesData.categorieId ?? sousCategoriesData.categorie?.id;

    if (!categorieId) {
      throw new NotFoundException(
        "Aucune catégorie parente n'a été fournie (categorieId manquant)",
      );
    }

    const categorie = await manager.findOne(CategoriesEntity, {
      where: { id: categorieId } as any,
    });
    if (!categorie) {
      throw new NotFoundException('Catégorie parente introuvable');
    }

    let sousCategoriesEntity = new SousCategoriesEntity({
      nom: sousCategoriesData.nom,
      description: sousCategoriesData.description ?? null,
      geler: 0,
      dateCreation: new Date(),
      idusrcreation: sousCategoriesData.idusrcreation ?? 1,
      categorie,
    });

    console.log('sousCategoriesEntity => ', sousCategoriesEntity);
    sousCategoriesEntity = await manager.save(sousCategoriesEntity);

    return sousCategoriesEntity;
  }

  /**
   * ✅ AJOUT : PUT /metier/sous-categories/modifierSousCategories/:id
   * Même principe que ajouterSousCategories() — évite complètement le
   * DTO générique (sous_categories.dto.ts), qui continuait à échouer
   * en modification malgré la correction de CategorieReferenceDto (le
   * message générique "Validation object failed" ne permettait pas de
   * diagnostiquer précisément quel champ posait encore souci).
   */
  async modifierSousCategories(id: number, sousCategoriesData: any) {
    const sousCategorie = await this.sousCategoriesRepository.findOne({
      where: { id } as any,
      relations: ['categorie'],
    });
    if (!sousCategorie) {
      throw new NotFoundException('Sous-catégorie introuvable');
    }

    if (sousCategoriesData.nom !== undefined) {
      sousCategorie.nom = sousCategoriesData.nom;
    }
    if (sousCategoriesData.description !== undefined) {
      sousCategorie.description = sousCategoriesData.description;
    }

    const categorieId =
      sousCategoriesData.categorieId ?? sousCategoriesData.categorie?.id;
    if (categorieId) {
      const categorie = await this.sousCategoriesRepository.manager.findOne(
        CategoriesEntity,
        { where: { id: categorieId } as any },
      );
      if (!categorie) {
        throw new NotFoundException('Catégorie parente introuvable');
      }
      (sousCategorie as any).categorie = categorie;
    }

    const sauvegarde = await this.sousCategoriesRepository.save(sousCategorie);

    return {
      etat: 'succes',
      message: 'Sous-catégorie modifiée avec succès',
      data: await this._formaterAvecNombreAnnonces(sauvegarde),
    };
  }

  /**
   * ✅ AJOUT : DELETE /metier/sous-categories/supprimerSousCategories/:id
   * Suppression DOUCE (geler = 1) plutôt que physique — la route
   * générique (DELETE /sousCategories/:id) fait une suppression
   * physique, qui échoue dès qu'une annonce référence encore cette
   * sous-catégorie (contrainte de clé étrangère onDelete: 'RESTRICT').
   * Cette approche évite le problème et permet un retour en arrière.
   */
  async supprimerSousCategories(id: number) {
    const sousCategorie = await this.sousCategoriesRepository.findOne({
      where: { id } as any,
    });
    if (!sousCategorie) {
      throw new NotFoundException('Sous-catégorie introuvable');
    }

    sousCategorie.geler = 1;
    await this.sousCategoriesRepository.save(sousCategorie);

    return {
      etat: 'succes',
      message: 'Sous-catégorie supprimée avec succès',
      data: null,
    };
  }

  /**
   * Compte les annonces (non gelées) qui utilisent cette sous-catégorie,
   * et formate la sous-catégorie pour l'affichage.
   */
  private async _formaterAvecNombreAnnonces(sousCategorie: SousCategoriesEntity) {
    const nombreAnnonces = await this.annonceRepository.count({
      where: {
        sousCategorie: { id: sousCategorie.id },
        geler: 0,
      } as any,
    });

    return {
      id: sousCategorie.id,
      nom: sousCategorie.nom,
      description: sousCategorie.description,
      geler: sousCategorie.geler,
      dateCreation: sousCategorie.dateCreation,
      categorie: (sousCategorie as any).categorie
        ? {
            id: (sousCategorie as any).categorie.id,
            nom: (sousCategorie as any).categorie.nom,
          }
        : null,
      nombreAnnonces,
    };
  }
}