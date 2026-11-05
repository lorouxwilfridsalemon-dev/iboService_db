import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleEntity } from './module.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class ModuleService {
    constructor(
        @InjectRepository(ModuleEntity) private readonly moduleRepository: Repository<ModuleEntity>,
    ){}

    async save(module: object): Promise<Response>{
        const result = await this.moduleRepository.save( module as ModuleEntity);
        return result;
    }
    
    async update(module: object, primaryKey: object): Promise<Response>{
        const response: any = await this.findById(primaryKey);
        const result = await this.moduleRepository.save({ ...response.data, ...module });
        return result;
    }
    
    async delete(primaryKey: object): Promise<Response>{
        const response: any = await this.findById(primaryKey);
        const result: any = await this.moduleRepository.delete(primaryKey);
        return response;
        // return result;
    }

    async find(query: object): Promise<Response> {
        
        const result = await this.moduleRepository.find(TypeOrmHttpParamQuery(query));
        return result;
    }

    async findById(primaryKey: object): Promise<Response> {
        const result = await this.moduleRepository.findOne(primaryKey);
        if (!isDefined(result)){
            throw (new HttpException({status : { code: HttpStatus.NOT_FOUND, error: `Aucun module trouvé `} }, HttpStatus.NOT_FOUND));
        }
        return result;
    }
}
