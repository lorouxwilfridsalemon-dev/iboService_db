import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoostEntity } from './boost.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class BoostService {   // ✅ CORRIGÉ : service spécifique
  constructor(
    @InjectRepository(BoostEntity)
    private readonly boostRepository: Repository<BoostEntity>,
  ) {}

  async save(boost: object): Promise<Response> {
    const result = await this.boostRepository.save(
      boost as BoostEntity,
    );
    return result;
  }

  async update(boost: object, primaryKey: object): Promise<Response> {
    const existing: any = await this.findById(primaryKey);
    const result = await this.boostRepository.save({
      ...existing,
      ...boost,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    await this.boostRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.boostRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.boostRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: {
            code: HttpStatus.NOT_FOUND,
            error: `Aucun boost trouvé`,   
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
} 