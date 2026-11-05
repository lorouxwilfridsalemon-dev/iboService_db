import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetailImmobilierEntity } from './detail_immobilier.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class DetailImmobilierService {
  constructor(
    @InjectRepository(DetailImmobilierEntity)
    private readonly detailImmobilierRepository: Repository<DetailImmobilierEntity>,
  ) {}

  async save(detailImmobilier: object): Promise<Response> {
    const result = await this.detailImmobilierRepository.save(detailImmobilier as DetailImmobilierEntity);
    return result;
  }

  async update(detailImmobilier: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.detailImmobilierRepository.save({
      ...response.data,
      ...detailImmobilier,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.detailImmobilierRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.detailImmobilierRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.detailImmobilierRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun detailImmobilier trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

