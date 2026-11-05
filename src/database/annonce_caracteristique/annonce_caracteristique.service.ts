import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnonceCaracteristiqueEntity } from './annonce_caracteristique.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class AnnonceCaracteristiqueService {
  constructor(
    @InjectRepository(AnnonceCaracteristiqueEntity)
    private readonly annonceCaracteristiqueRepository: Repository<AnnonceCaracteristiqueEntity>,
  ) {}

  async save(annonceCaracteristique: object): Promise<Response> {
    const result = await this.annonceCaracteristiqueRepository.save(annonceCaracteristique as AnnonceCaracteristiqueEntity);
    return result;
  }

  async update(annonceCaracteristique: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.annonceCaracteristiqueRepository.save({
      ...response.data,
      ...annonceCaracteristique,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.annonceCaracteristiqueRepository.delete(primaryKey);
    return response;
  }

  // ✅ CORRECTION ICI
  async find(query: object): Promise<Response> {
    // 1. Convertir le query en options TypeORM
    const options = TypeOrmHttpParamQuery(query);
    
    // 2. Toujours charger la relation 'caracteristique'
    options.relations = ['caracteristique'];

    // 3. Exécuter la requête
    const result = await this.annonceCaracteristiqueRepository.find(options);
    return result;
  }

  // ✅ MÉTHODE SPÉCIFIQUE POUR RÉCUPÉRER LES CARACTÉRISTIQUES D'UNE ANNONCE
  async findByAnnonceId(annonceId: number): Promise<Response> {
    const result = await this.annonceCaracteristiqueRepository.find({
      where: { annonce: { id: annonceId } },
      relations: ['caracteristique'],
    });
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const options: any = { where: primaryKey };
    options.relations = ['caracteristique'];
    const result = await this.annonceCaracteristiqueRepository.findOne(options);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun annonceCaracteristique trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
} 




// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { AnnonceCaracteristiqueEntity } from './annonce_caracteristique.entity';
// import { isDefined } from 'class-validator';
// import { Response } from '../../core/shared/classes/response.class';
// import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

// @Injectable()
// export class AnnonceCaracteristiqueService {
//   constructor(
//     @InjectRepository(AnnonceCaracteristiqueEntity)
//     private readonly annonceCaracteristiqueRepository: Repository<AnnonceCaracteristiqueEntity>,
//   ) {}

//   async save(annonceCaracteristique: object): Promise<Response> {
//     const result = await this.annonceCaracteristiqueRepository.save(annonceCaracteristique as AnnonceCaracteristiqueEntity);
//     return result;
//   }

//   async update(annonceCaracteristique: object, primaryKey: object): Promise<Response> {
//     const response: any = await this.findById(primaryKey);
//     const result = await this.annonceCaracteristiqueRepository.save({
//       ...response.data,
//       ...annonceCaracteristique,
//     });
//     return result;
//   }

//   async delete(primaryKey: object): Promise<Response> {
//     const response: any = await this.findById(primaryKey);
//     const result: any = await this.annonceCaracteristiqueRepository.delete(primaryKey);
//     return response;
//   }

//   async find(query: object): Promise<Response> {
//     const result = await this.annonceCaracteristiqueRepository.find(
//       TypeOrmHttpParamQuery(query),
//     );
//     return result;
//   }

//   async findById(primaryKey: object): Promise<Response> {
//     const result = await this.annonceCaracteristiqueRepository.findOne(primaryKey);
//     if (!isDefined(result)) {
//       throw new HttpException(
//         {
//           status: { code: HttpStatus.NOT_FOUND, error: `Aucun annonceCaracteristique trouvé` },
//         },
//         HttpStatus.NOT_FOUND,
//       );
//     }
//     return result;
//   }
// }

