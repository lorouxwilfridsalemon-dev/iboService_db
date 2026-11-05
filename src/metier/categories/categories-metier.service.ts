



import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesEntity } from '../../database/categories/categories.entity';

@Injectable()
export class CategoriesMetierService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private readonly categoriesRepository: Repository<CategoriesEntity>,
  ) {}

  /**
   * GET /metier/categories/listeCategories
   */
  async listeCategories() {
    const categories = await this.categoriesRepository.find({
      where: { geler: 0 } as any,
      order: { id: 'DESC' } as any,
    });

    return {
      etat: 'succes',
      message: 'Catégories récupérées',
      data: categories,
    };
  }

  /**
   * ✅ AJOUT : POST /metier/categories/ajouterCategories
   * Évite complètement le DTO générique (CategoriesDto), qui exigeait
   * geler/dateCreation/idusrcreation du client — champs gérés ici
   * côté serveur.
   */
  async ajouterCategories(data: any, idUsrConnecte: number) {
    const categorie = this.categoriesRepository.create({
      nom: data.nom,
      description: data.description ?? null,
      geler: 0,
      dateCreation: new Date(),
      idusrcreation: idUsrConnecte,
    } as any);

    const sauvegarde = await this.categoriesRepository.save(categorie);

    return {
      etat: 'succes',
      message: 'Catégorie créée avec succès',
      data: sauvegarde,
    };
  }

  /**
   * ✅ AJOUT : PUT /metier/categories/modifierCategories/:id
   */
  async modifierCategories(id: number, data: any) {
    const categorie = await this.categoriesRepository.findOne({ where: { id } as any });
    if (!categorie) {
      throw new NotFoundException('Catégorie introuvable');
    }

    if (data.nom !== undefined) categorie.nom = data.nom;
    if (data.description !== undefined) categorie.description = data.description;

    const sauvegarde = await this.categoriesRepository.save(categorie);

    return {
      etat: 'succes',
      message: 'Catégorie modifiée avec succès',
      data: sauvegarde,
    };
  }

  /**
   * DELETE /metier/categories/supprimerCategories/:id
   * Suppression douce (geler = 1).
   */
  async supprimerCategories(id: number) {
    const categorie = await this.categoriesRepository.findOne({ where: { id } as any });
    if (!categorie) {
      throw new NotFoundException('Catégorie introuvable');
    }

    categorie.geler = 1;
    await this.categoriesRepository.save(categorie);

    return {
      etat: 'succes',
      message: 'Catégorie supprimée avec succès',
      data: null,
    };
  }
}