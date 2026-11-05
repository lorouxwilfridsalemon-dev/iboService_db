import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfilEntity } from './profil.entity';
import { Validator, isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class ProfilService {
    constructor(
        @InjectRepository(ProfilEntity) private readonly profilRepository: Repository<ProfilEntity>,
    ){}

    async save(profil: object): Promise<Response>{
        const result = await this.profilRepository.save( profil as ProfilEntity);
        return result;
    }
    
    async update(profil: object, primaryKey: object): Promise<Response>{
        const response: any = await this.findById(primaryKey);
        const result = await this.profilRepository.save({ ...response.data, ...profil });
        return result;
    }
    
    async delete(primaryKey: object): Promise<Response>{
        const response: any = await this.findById(primaryKey);
        const result: any = await this.profilRepository.delete(primaryKey);
        return response;
    }

    async find(query: object): Promise<Response> {
        const result = await this.profilRepository.find(TypeOrmHttpParamQuery(query));
        return result;
    }

    async findById(primaryKey: object): Promise<Response> {
        const result = await this.profilRepository.findOne(primaryKey);
        if (!isDefined(result)){
            throw (new HttpException({status : { code: HttpStatus.NOT_FOUND, error: `Aucun type prestataire trouvé `} }, HttpStatus.NOT_FOUND));
        }
        return result;
    }
}
