import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaiementMobileEntity } from './paiement_mobile.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class PaiementMobileService {
  constructor(
    @InjectRepository(PaiementMobileEntity)
    private readonly paiementMobileRepository: Repository<PaiementMobileEntity>,
  ) {}

  async save(paiement: object): Promise<Response> {
    const result = await this.paiementMobileRepository.save(
      paiement as PaiementMobileEntity,
    );
    return result;
  }

  async update(paiement: object, primaryKey: object): Promise<Response> {
    const existing: any = await this.findById(primaryKey);
    const result = await this.paiementMobileRepository.save({
      ...existing,
      ...paiement,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    await this.paiementMobileRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.paiementMobileRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.paiementMobileRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: {
            code: HttpStatus.NOT_FOUND,
            error: `Aucun paiement mobile trouvé`,   // ✅ CORRIGÉ
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}