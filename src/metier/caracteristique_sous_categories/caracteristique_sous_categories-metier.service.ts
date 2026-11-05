import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaracteristiqueSousCategoriesEntity } from 'src/database/caracteristique_sous_categories/caracteristique_sous_categories.entity';
import { CaracteristiqueEntity } from '../../database/caracteristique/caracteristique.entity';
import { SousCategoriesEntity } from '../../database/sous_categories/sous_categories.entity';

@Injectable()
export class CaracteristiqueSousCategoriesMetierService {
  constructor(
    @InjectRepository(CaracteristiqueSousCategoriesEntity)
    private readonly liaisonRepository: Repository<CaracteristiqueSousCategoriesEntity>,

    @InjectRepository(CaracteristiqueEntity)
    private readonly caracteristiqueRepository: Repository<CaracteristiqueEntity>,

    @InjectRepository(SousCategoriesEntity)
    private readonly sousCategoriesRepository: Repository<SousCategoriesEntity>,
  ) {}

  /**
   * GET /metier/caracteristique-sous-categories
   * Liste toutes les liaisons actives, avec le nom de la
   * caractéristique ET celui de la sous-catégorie chargés — sans ça,
   * impossible d'afficher quoi que ce soit d'utile dans le tableau
   * (l'entité elle-même n'a ni "nom" ni "description", uniquement les
   * deux relations).
   */
  async findAll() {
    const liaisons = await this.liaisonRepository.find({
      where: { geler: 0 } as any,
      relations: ['caracteristique', 'sousCategorie'],
      order: { id: 'DESC' } as any,
    });

    return {
      etat: 'succes',
      message: 'Liaisons récupérées',
      data: liaisons.map((l) => this._formater(l)),
    };
  }

  /**
   * POST /metier/caracteristique-sous-categories
   * Crée une liaison entre une caractéristique et une sous-catégorie.
   */
  async create(dto: { caracteristiqueId: number; sousCategorieId: number }) {
    if (!dto.caracteristiqueId || !dto.sousCategorieId) {
      throw new BadRequestException(
        'Une caractéristique ET une sous-catégorie doivent être sélectionnées',
      );
    }

    const caracteristique = await this.caracteristiqueRepository.findOne({
      where: { id: dto.caracteristiqueId } as any,
    });
    if (!caracteristique) {
      throw new NotFoundException('Caractéristique introuvable');
    }

    const sousCategorie = await this.sousCategoriesRepository.findOne({
      where: { id: dto.sousCategorieId } as any,
    });
    if (!sousCategorie) {
      throw new NotFoundException('Sous-catégorie introuvable');
    }

    // ✅ Évite les doublons — pas la peine de lier deux fois la même
    // caractéristique à la même sous-catégorie.
    const existante = await this.liaisonRepository.findOne({
      where: {
        geler: 0,
        caracteristique: { id: dto.caracteristiqueId },
        sousCategorie: { id: dto.sousCategorieId },
      } as any,
    });
    if (existante) {
      throw new BadRequestException(
        'Cette caractéristique est déjà associée à cette sous-catégorie',
      );
    }

    let liaison = this.liaisonRepository.create({
      geler: 0,
      dateCreation: new Date(),
      idusrcreation: 1,
      caracteristique,
      sousCategorie,
    } as any);

    liaison = await this.liaisonRepository.save(liaison);

    const liaisonComplete = await this.liaisonRepository.findOne({
      where: { id: (liaison as any).id } as any,
      relations: ['caracteristique', 'sousCategorie'],
    });

    return {
      etat: 'succes',
      message: 'Liaison créée avec succès',
      data: this._formater(liaisonComplete),
    };
  }

  /**
   * DELETE /metier/caracteristique-sous-categories/:id
   * Suppression douce (geler = 1), cohérent avec le reste du projet.
   */
  async remove(id: number) {
    const liaison = await this.liaisonRepository.findOne({
      where: { id } as any,
    });
    if (!liaison) {
      throw new NotFoundException('Liaison introuvable');
    }

    liaison.geler = 1;
    await this.liaisonRepository.save(liaison);

    return {
      etat: 'succes',
      message: 'Liaison supprimée avec succès',
      data: null,
    };
  }

  private _formater(liaison: CaracteristiqueSousCategoriesEntity) {
    const caracteristique = (liaison as any).caracteristique;
    const sousCategorie = (liaison as any).sousCategorie;

    return {
      id: liaison.id,
      dateCreation: liaison.dateCreation,
      caracteristique: caracteristique
        ? { id: caracteristique.id, nom: caracteristique.nom }
        : null,
      sousCategorie: sousCategorie
        ? { id: sousCategorie.id, nom: sousCategorie.nom }
        : null,
    };
  }
}    