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

  async find(query: object): Promise<Response> {
    return await this.typeClientRepository.find(
      TypeOrmHttpParamQuery(query),
    );
  }

  async save(typeClient: object): Promise<Response> {
    return await this.typeClientRepository.save(typeClient as TypeClientEntity);
  }

  async update(typeClient: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    return await this.typeClientRepository.save({
      ...response,
      ...typeClient,
    });
  }

  async delete(primaryKey: object): Promise<Response> {
    await this.findById(primaryKey);
    await this.typeClientRepository.delete(primaryKey);
    return { success: true };
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.typeClientRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: {
            code: HttpStatus.NOT_FOUND,
            error: `Aucun type client trouvé`,
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
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


