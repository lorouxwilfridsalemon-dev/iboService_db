import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnonceImageEntity } from './annonce_image.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class AnnonceImageService {
  constructor(
    @InjectRepository(AnnonceImageEntity)
    private readonly annonceImageRepository: Repository<AnnonceImageEntity>,
  ) {}

  async save(annonceImage: object): Promise<Response> {
    const result = await this.annonceImageRepository.save(annonceImage as AnnonceImageEntity);
    return result;
  }

  async update(annonceImage: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.annonceImageRepository.save({
      ...response.data,
      ...annonceImage,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.annonceImageRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.annonceImageRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.annonceImageRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun annonceImage trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

