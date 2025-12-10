import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModalitePaiementEntity } from './modalite_paiement.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class ModalitePaiementService {
  constructor(
    @InjectRepository(ModalitePaiementEntity)
    private readonly modalitePaiementRepository: Repository<ModalitePaiementEntity>,
  ) {}

  async save(modalitePaiement: object): Promise<Response> {
    const result = await this.modalitePaiementRepository.save(modalitePaiement as ModalitePaiementEntity);
    return result;
  }

  async update(modalitePaiement: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.modalitePaiementRepository.save({
      ...response.data,
      ...modalitePaiement,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.modalitePaiementRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.modalitePaiementRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.modalitePaiementRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucune modalité de paiement trouvée` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

