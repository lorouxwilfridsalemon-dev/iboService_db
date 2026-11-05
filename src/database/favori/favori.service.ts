import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriEntity } from './favori.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class FavoriService {
  constructor(
    @InjectRepository(FavoriEntity)
    private readonly favoriRepository: Repository<FavoriEntity>,
  ) {}

  async save(favori: object): Promise<Response> {
    const result = await this.favoriRepository.save(favori as FavoriEntity);
    return result;
  }

  async update(favori: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.favoriRepository.save({
      ...response.data,
      ...favori,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.favoriRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.favoriRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.favoriRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun favori trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

