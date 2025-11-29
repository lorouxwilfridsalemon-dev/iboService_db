import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetailAchatEntity } from './detail_achat.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class DetailAchatService {
  constructor(
    @InjectRepository(DetailAchatEntity)
    private readonly detailAchatRepository: Repository<DetailAchatEntity>,
  ) {}

  async save(detailAchat: object): Promise<Response> {
    const result = await this.detailAchatRepository.save(detailAchat as DetailAchatEntity);
    return result;
  }

  async update(detailAchat: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.detailAchatRepository.save({
      ...response.data,
      ...detailAchat,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.detailAchatRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.detailAchatRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.detailAchatRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun détail achat trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

