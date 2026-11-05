import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatutAnnonceEntity } from './statut_annonce.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class StatutAnnonceService {
  constructor(
    @InjectRepository(StatutAnnonceEntity)
    private readonly statutAnnonceRepository: Repository<StatutAnnonceEntity>,
  ) {}

  async save(statutAnnonce: object): Promise<Response> {
    const result = await this.statutAnnonceRepository.save(statutAnnonce as StatutAnnonceEntity);
    return result;
  }

  async update(statutAnnonce: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.statutAnnonceRepository.save({
      ...response.data,
      ...statutAnnonce,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.statutAnnonceRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.statutAnnonceRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.statutAnnonceRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun statutAnnonce trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

