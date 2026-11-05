import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatutReservationEntity } from './statut_reservation.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class StatutReservationService {
  constructor(
    @InjectRepository(StatutReservationEntity)
    private readonly statutReservationRepository: Repository<StatutReservationEntity>,
  ) {}

  async save(statutReservation: object): Promise<Response> {
    const result = await this.statutReservationRepository.save(statutReservation as StatutReservationEntity);
    return result;
  }

  async update(statutReservation: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.statutReservationRepository.save({
      ...response.data,
      ...statutReservation,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.statutReservationRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.statutReservationRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.statutReservationRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun statutReservation trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

