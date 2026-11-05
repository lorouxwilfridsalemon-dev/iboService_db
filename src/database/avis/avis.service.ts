import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvisEntity } from './avis.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class AvisService {
  constructor(
    @InjectRepository(AvisEntity)
    private readonly avisRepository: Repository<AvisEntity>,
  ) {}

  async save(avis: object): Promise<Response> {
    const result = await this.avisRepository.save(avis as AvisEntity);
    return result;
  }

  async update(avis: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.avisRepository.save({
      ...response.data,
      ...avis,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.avisRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.avisRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.avisRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun avis trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

