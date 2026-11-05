import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RetraitEntity } from './retrait.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class RetraitService {
  constructor(
    @InjectRepository(RetraitEntity)
    private readonly retraitRepository: Repository<RetraitEntity>,
  ) {}

  async save(retrait: object): Promise<Response> {
    const result = await this.retraitRepository.save(
      retrait as RetraitEntity,
    );
    return result;
  }

  async update(retrait: object, primaryKey: object): Promise<Response> {
    // ✅ CORRIGÉ : findById retourne l'entité directement (pas response.data)
    const existing: any = await this.findById(primaryKey);
    const result = await this.retraitRepository.save({
      ...existing,
      ...retrait,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    await this.retraitRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.retraitRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.retraitRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: {
            code: HttpStatus.NOT_FOUND,
            error: `Aucun retrait trouvé`,
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
} 