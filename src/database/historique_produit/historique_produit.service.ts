import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoriqueProduitEntity } from './historique_produit.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class HistoriqueProduitService {
  constructor(
    @InjectRepository(HistoriqueProduitEntity)
    private readonly historiqueProduitRepository: Repository<HistoriqueProduitEntity>,
  ) {}

  async save(historiqueProduit: object): Promise<Response> {
    const result = await this.historiqueProduitRepository.save(historiqueProduit as HistoriqueProduitEntity);
    return result;
  }

  async update(historiqueProduit: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.historiqueProduitRepository.save({
      ...response.data,
      ...historiqueProduit,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.historiqueProduitRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.historiqueProduitRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.historiqueProduitRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun historique produit trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

