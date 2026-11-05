import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaracteristiqueEntity } from '../../database/caracteristique/caracteristique.entity';

@Injectable()
export class CaracteristiquesMetierService {
  constructor(
    @InjectRepository(CaracteristiqueEntity)
    private readonly caracteristiqueRepository: Repository<CaracteristiqueEntity>,
  ) {}

  /**
   * ✅ DELETE /metier/caracteristiques/supprimerCaracteristiques/:id
   * Suppression DOUCE (geler = 1) — la route générique échouait avec
   * un 500 (Internal Server Error), très probablement parce que la
   * caractéristique est référencée par des sous-catégories/annonces
   * (contrainte de clé étrangère onDelete: 'RESTRICT'), en plus du bug
   * d'encodage de l'URL ('[object Object]').
   */
  async supprimerCaracteristiques(id: number) {
    const caracteristique = await this.caracteristiqueRepository.findOne({
      where: { id } as any,
    });
    if (!caracteristique) {
      throw new NotFoundException('Caractéristique introuvable');
    }

    caracteristique.geler = 1;
    await this.caracteristiqueRepository.save(caracteristique);

    return {
      etat: 'succes',
      message: 'Caractéristique supprimée avec succès',
      data: null,
    };
  }
}