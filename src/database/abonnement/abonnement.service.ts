import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbonnementEntity } from './abonnement.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class AbonnementService {
  constructor(
    @InjectRepository(AbonnementEntity)
    private readonly abonnementRepository: Repository<AbonnementEntity>,
  ) {}

  async save(abonnement: object): Promise<Response> {
    const result = await this.abonnementRepository.save(
      abonnement as AbonnementEntity,
    );
    return result;
  }

  async update(abonnement: object, primaryKey: object): Promise<Response> {
    const existing: any = await this.findById(primaryKey);
    const result = await this.abonnementRepository.save({
      ...existing,
      ...abonnement,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    await this.abonnementRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.abonnementRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.abonnementRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: {
            code: HttpStatus.NOT_FOUND,
            error: `Aucun abonnement trouvé`,
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
} 