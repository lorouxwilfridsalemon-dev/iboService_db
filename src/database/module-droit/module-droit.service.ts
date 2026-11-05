import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleDroitEntity } from './module-droit.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class ModuleDroitService {
    constructor(
        @InjectRepository(ModuleDroitEntity) private readonly moduleDroitRepository: Repository<ModuleDroitEntity>,
    ){}

    async save(moduleDroit: object): Promise<Response>{
        const result = await this.moduleDroitRepository.save( moduleDroit as ModuleDroitEntity);
        return result;
    }
    
    async update(moduleDroit: object, primaryKey: object): Promise<Response>{
        const response: any = await this.findById(primaryKey);
        const result = await this.moduleDroitRepository.save({ ...response.data, ...moduleDroit });
        return result;
    }
    
    async delete(primaryKey: object): Promise<Response>{
        const response: any = await this.findById(primaryKey);
        const result: any = await this.moduleDroitRepository.delete(primaryKey);
        return response;
    }

    async find(query: object): Promise<Response> {
        const result = await this.moduleDroitRepository.find(TypeOrmHttpParamQuery(query));
        return result;
    }

    async findById(primaryKey: object): Promise<Response> {
        const result = await this.moduleDroitRepository.findOne(primaryKey);
        if (!isDefined(result)){
            throw (new HttpException({status : { code: HttpStatus.NOT_FOUND, error: `Aucun moduleDroit trouvé `} }, HttpStatus.NOT_FOUND));
        }
        return result;
    }
}
