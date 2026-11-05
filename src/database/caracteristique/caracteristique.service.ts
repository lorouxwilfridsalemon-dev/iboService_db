import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaracteristiqueEntity } from './caracteristique.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class CaracteristiqueService {
  constructor(
    @InjectRepository(CaracteristiqueEntity)
    private readonly caracteristiqueRepository: Repository<CaracteristiqueEntity>,
  ) {}

  async save(caracteristique: object): Promise<Response> {
    const result = await this.caracteristiqueRepository.save(caracteristique as CaracteristiqueEntity);
    return result;
  }

  async update(caracteristique: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.caracteristiqueRepository.save({
      ...response.data,
      ...caracteristique,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.caracteristiqueRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.caracteristiqueRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.caracteristiqueRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun caracteristique trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

