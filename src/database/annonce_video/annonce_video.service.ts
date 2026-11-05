import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnonceVideoEntity } from './annonce_video.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class AnnonceVideoService {
  constructor(
    @InjectRepository(AnnonceVideoEntity)
    private readonly annonceVideoRepository: Repository<AnnonceVideoEntity>,
  ) {}

  async save(annonceVideo: object): Promise<Response> {
    const result = await this.annonceVideoRepository.save(annonceVideo as AnnonceVideoEntity);
    return result;
  }

  async update(annonceVideo: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.annonceVideoRepository.save({
      ...response.data,
      ...annonceVideo,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.annonceVideoRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.annonceVideoRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.annonceVideoRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun annonceVideo trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

