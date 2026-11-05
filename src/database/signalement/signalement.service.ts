import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignalementEntity } from './signalement.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class SignalementService {
  constructor(
    @InjectRepository(SignalementEntity)
    private readonly signalementRepository: Repository<SignalementEntity>,
  ) {}

  async save(signalement: object): Promise<Response> {
    const result = await this.signalementRepository.save(signalement as SignalementEntity);
    return result;
  }

  async update(signalement: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.signalementRepository.save({
      ...response.data,
      ...signalement,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.signalementRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.signalementRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.signalementRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun signalement trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

