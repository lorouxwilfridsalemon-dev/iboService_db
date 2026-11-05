import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SousCategoriesEntity } from './sous_categories.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class SousCategoriesService {
  constructor(
    @InjectRepository(SousCategoriesEntity)
    private readonly sousCategoriesRepository: Repository<SousCategoriesEntity>,
  ) {}

  async save(sousCategories: object): Promise<Response> {
    const result = await this.sousCategoriesRepository.save(sousCategories as SousCategoriesEntity);
    return result;
  }

  async update(sousCategories: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.sousCategoriesRepository.save({
      ...response.data,
      ...sousCategories,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.sousCategoriesRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.sousCategoriesRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.sousCategoriesRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun sousCategories trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

