import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoriqueStatutReservationEntity } from './historique_statut_reservation.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class HistoriqueStatutReservationService {
  constructor(
    @InjectRepository(HistoriqueStatutReservationEntity)
    private readonly historiqueStatutReservationRepository: Repository<HistoriqueStatutReservationEntity>,
  ) {}

  async save(historiqueStatutReservation: object): Promise<Response> {
    const result = await this.historiqueStatutReservationRepository.save(historiqueStatutReservation as HistoriqueStatutReservationEntity);
    return result;
  }

  async update(historiqueStatutReservation: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.historiqueStatutReservationRepository.save({
      ...response.data,
      ...historiqueStatutReservation,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.historiqueStatutReservationRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.historiqueStatutReservationRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.historiqueStatutReservationRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun historiqueStatutReservation trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

