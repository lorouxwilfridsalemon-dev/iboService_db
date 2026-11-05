
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaracteristiqueSousCategoriesEntity } from './caracteristique_sous_categories.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class CaracteristiqueSousCategoriesService {
  constructor(
    @InjectRepository(CaracteristiqueSousCategoriesEntity)
    private readonly repository: Repository<CaracteristiqueSousCategoriesEntity>,
  ) {}

  async save(data: object): Promise<Response> {
    const result = await this.repository.save(data as CaracteristiqueSousCategoriesEntity);
    return result;
  }

  async update(data: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.repository.save({
      ...response.data,
      ...data,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    await this.repository.delete(primaryKey);
    return response;
  }

  // ✅ CORRIGÉ : gère le paramètre sousCategorieId et force la relation
  async find(query: any): Promise<Response> {
    // 1. Construire les options manuellement pour forcer la relation
    const options: any = {
      relations: ['caracteristique'],
    };

    // 2. Si on a un sousCategorieId, on ajoute le filtre
    if (query && query.sousCategorieId) {
      const id = Number(query.sousCategorieId);
      options.where = {
        sousCategorie: { id: id },
      };
    }

    // 3. Exécuter la requête
    const result = await this.repository.find(options);
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const options: any = { where: primaryKey };
    options.relations = ['caracteristique'];
    const result = await this.repository.findOne(options);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucune liaison trouvée` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result; 
  }  
}   

