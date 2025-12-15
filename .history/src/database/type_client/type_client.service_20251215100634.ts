import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeClientEntity } from './type_client.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class TypeClientService {
  constructor(
    @InjectRepository(TypeClientEntity)
    private readonly typeClientRepository: Repository<TypeClientEntity>,
  ) { }

  async save(typeClient: object): Promise<Response> {
    const result = await this.typeClientRepository.save(typeClient as TypeClientEntity);
    return result;
  }

  async update(typeClient: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.typeClientRepository.save({
      ...response.data,
      ...typeClient,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.typeClientRepository.delete(primaryKey);
    return response;
  }

  // async find(query: object): Promise<Response> {
  //   const result = await this.typeClientRepository.find(
  //     TypeOrmHttpParamQuery(query),
  //   );
  //   return result;
  // }
  async findById(primaryKey: object): Promise<Response> {
    const result = await this.typeClientRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun type client trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }



  // async findById(primaryKey: object): Promise<Response> {
  //   const result = await this.typeClientRepository.findOne(primaryKey);
  //   if (!isDefined(result)) {
  //     throw new HttpException(
  //       {
  //         status: { code: HttpStatus.NOT_FOUND, error: `Aucun type client trouvé` },
  //       },
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  //   return result;
  // }
}

