import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnonceCaracteristiqueEntity } from 'src/database/annonce_caracteristique/annonce_caracteristique.entity';
import { AnnonceEntity } from '../../database/annonce/annonce.entity';

@Injectable()
export class AnnonceCaracteristiqueMetierService {
  constructor(
    @InjectRepository(AnnonceCaracteristiqueEntity)
    private readonly annonceCaracteristiqueRepository: Repository<AnnonceCaracteristiqueEntity>,

    @InjectRepository(AnnonceEntity)
    private readonly annonceRepository: Repository<AnnonceEntity>,
  ) {}

  // ✅ Récupérer toutes les annonces-caractéristiques (avec relations)
  async findAll(): Promise<AnnonceCaracteristiqueEntity[]> {
    return this.annonceCaracteristiqueRepository.find({
      relations: ['caracteristique', 'annonce'],
      where: { geler: 0 },
      order: { dateCreation: 'DESC' }
    });
  }

  // ✅ Récupérer une par ID
  async findOne(id: number): Promise<AnnonceCaracteristiqueEntity> {
    const entity = await this.annonceCaracteristiqueRepository.findOne({
      where: { id, geler: 0 },
      relations: ['caracteristique', 'annonce']
    });
    if (!entity) {
      throw new NotFoundException(`AnnonceCaractéristique #${id} introuvable`);
    }
    return entity;
  }

  // ✅ Créer
  async create(data: Partial<AnnonceCaracteristiqueEntity>): Promise<AnnonceCaracteristiqueEntity> {
    const entity = this.annonceCaracteristiqueRepository.create(data);
    return this.annonceCaracteristiqueRepository.save(entity);
  }

  // ✅ Modifier (avec ID dans l'URL)
  async update(id: number, data: Partial<AnnonceCaracteristiqueEntity>): Promise<AnnonceCaracteristiqueEntity> {
    const entity = await this.findOne(id);
    Object.assign(entity, data);
    return this.annonceCaracteristiqueRepository.save(entity);
  }

  // ✅ Supprimer (logique = geler à 1)
  async delete(id: number): Promise<boolean> {
    const entity = await this.findOne(id);
    entity.geler = 1;
    await this.annonceCaracteristiqueRepository.save(entity);
    return true;
  }

  // ✅ Query avec filtre (pour le frontend)
  async query(queryParameter: any): Promise<AnnonceCaracteristiqueEntity[]> {
    // Exemple simplifié : tu peux adapter selon tes besoins
    const { where, order, relations } = queryParameter;
    return this.annonceCaracteristiqueRepository.find({
      where: { geler: 0, ...where },
      order: order || { dateCreation: 'DESC' },
      relations: relations || ['caracteristique', 'annonce']
    });
  }
}