import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalisationEntity } from './localisation.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class LocalisationService {
  constructor(
    @InjectRepository(LocalisationEntity)
    private readonly localisationRepository: Repository<LocalisationEntity>,
  ) {}

  async save(localisation: object): Promise<Response> {
    const result = await this.localisationRepository.save(localisation as LocalisationEntity);
    return result;
  }

  async update(localisation: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.localisationRepository.save({
      ...response.data,
      ...localisation,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.localisationRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.localisationRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.localisationRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun localisation trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

