import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AchatEntity } from './achat.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class AchatService {
  constructor(
    @InjectRepository(AchatEntity)
    private readonly achatRepository: Repository<AchatEntity>,
  ) {}

  async save(achat: object): Promise<Response> {
    const result = await this.achatRepository.save(achat as AchatEntity);
    return result;
  }

  async update(achat: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.achatRepository.save({
      ...response.data,
      ...achat,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.achatRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.achatRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.achatRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun achat trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

