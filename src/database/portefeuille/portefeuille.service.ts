import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PortefeuilleEntity } from './portefeuille.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class PortefeuilleService { 
  constructor(
    @InjectRepository(PortefeuilleEntity)
    private readonly portefeuilleRepository: Repository<PortefeuilleEntity>,
  ) {}

  async save(portefeuille: object): Promise<Response> {
    const result = await this.portefeuilleRepository.save(
      portefeuille as PortefeuilleEntity,
    );
    return result;
  }

  async update(portefeuille: object, primaryKey: object): Promise<Response> {
    // ✅ CORRIGÉ : findById retourne l'entité directement (pas response.data)
    const existing: any = await this.findById(primaryKey);
    const result = await this.portefeuilleRepository.save({
      ...existing,
      ...portefeuille,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    await this.portefeuilleRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.portefeuilleRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.portefeuilleRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: {
            code: HttpStatus.NOT_FOUND,
            error: `Aucun portefeuille trouvé`,
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}