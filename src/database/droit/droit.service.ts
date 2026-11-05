import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DroitEntity } from './droit.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class DroitService {
    constructor(
        @InjectRepository(DroitEntity) private readonly droitRepository: Repository<DroitEntity>,
    ){}

    async save(droit: object): Promise<Response>{
        const result = await this.droitRepository.save( droit as DroitEntity);
        return result;
    }
    
    async update(droit: object, primaryKey: object): Promise<Response>{
        const response: any = await this.findById(primaryKey);
        const result = await this.droitRepository.save({ ...response.data, ...droit });
        return result;
    }
    
    async delete(primaryKey: object): Promise<Response>{
        const response: any = await this.findById(primaryKey);
        const result: any = await this.droitRepository.delete(primaryKey);
        return response;
        // return result;
    }

    async find(query: object): Promise<Response> {
        
        const result = await this.droitRepository.find(TypeOrmHttpParamQuery(query));
        return result;
    }

    async findById(primaryKey: object): Promise<Response> {
        const result = await this.droitRepository.findOne(primaryKey);
        if (!isDefined(result)){
            throw (new HttpException({status : { code: HttpStatus.NOT_FOUND, error: `Aucun droit trouvé `} }, HttpStatus.NOT_FOUND));
        }
        return result;
    }
}
