import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UtilisateurEntity } from './utilisateur.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class UtilisateurService {
    constructor(
        @InjectRepository(UtilisateurEntity) private readonly utilisateurRepository: Repository<UtilisateurEntity>,
    ){}  

    async save(utilisateur: object): Promise<Response>{
        const result = await this.utilisateurRepository.save( utilisateur as UtilisateurEntity);
        return result;
    }
    
    async update(utilisateur: object, primaryKey: object): Promise<Response>{
        console.log(utilisateur);
        
        const response: any = await this.findById(primaryKey);
        const result = await this.utilisateurRepository.save({ ...response.data, ...utilisateur });
        return result;
    }
    
    async delete(primaryKey: object): Promise<Response>{
        const response: any = await this.findById(primaryKey);
        const result: any = await this.utilisateurRepository.delete(primaryKey);
        return response;
        // return result;
    }

    async find(query: object): Promise<Response> {
        
        const result = await this.utilisateurRepository.find(TypeOrmHttpParamQuery(query));
        return result;
    } 

    async findById(primaryKey: object): Promise<Response> {
        const result = await this.utilisateurRepository.findOne(primaryKey);
        if (!isDefined(result)){
            throw (new HttpException({status : { code: HttpStatus.NOT_FOUND, error: `Aucun utilisateur trouvé `} }, HttpStatus.NOT_FOUND));
        }
        return result;
    }

    async findByEmail(email: string): Promise<UtilisateurEntity> {
        const result = await this.utilisateurRepository.find({email: email});
        if (!result[0]){
            throw (new HttpException({status : { code: HttpStatus.NOT_FOUND, error: `Aucun utilisateur trouvé `} }, HttpStatus.NOT_FOUND));
        }
        return result[0];
    }
}
