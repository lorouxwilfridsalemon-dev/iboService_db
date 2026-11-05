import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesEntity } from './categories.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private readonly categoriesRepository: Repository<CategoriesEntity>,
  ) {}

  async save(categories: object): Promise<Response> {
    const result = await this.categoriesRepository.save(categories as CategoriesEntity);
    return result;
  }

  async update(categories: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.categoriesRepository.save({
      ...response.data,
      ...categories,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.categoriesRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.categoriesRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.categoriesRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun categories trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

