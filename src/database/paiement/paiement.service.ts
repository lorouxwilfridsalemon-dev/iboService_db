import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaiementEntity } from './paiement.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class PaiementService {
  constructor(
    @InjectRepository(PaiementEntity)
    private readonly paiementRepository: Repository<PaiementEntity>,
  ) {}

  async save(paiement: object): Promise<Response> {
    const result = await this.paiementRepository.save(paiement as PaiementEntity);
    return result;
  }

  async update(paiement: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.paiementRepository.save({
      ...response.data,
      ...paiement,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.paiementRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.paiementRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.paiementRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun paiement trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

