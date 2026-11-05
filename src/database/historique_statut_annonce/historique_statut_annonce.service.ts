import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoriqueStatutAnnonceEntity } from './historique_statut_annonce.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class HistoriqueStatutAnnonceService {
  constructor(
    @InjectRepository(HistoriqueStatutAnnonceEntity)
    private readonly historiqueStatutAnnonceRepository: Repository<HistoriqueStatutAnnonceEntity>,
  ) {}

  async save(historiqueStatutAnnonce: object): Promise<Response> {
    const result = await this.historiqueStatutAnnonceRepository.save(historiqueStatutAnnonce as HistoriqueStatutAnnonceEntity);
    return result;
  }

  async update(historiqueStatutAnnonce: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.historiqueStatutAnnonceRepository.save({
      ...response.data,
      ...historiqueStatutAnnonce,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.historiqueStatutAnnonceRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.historiqueStatutAnnonceRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.historiqueStatutAnnonceRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun historiqueStatutAnnonce trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

