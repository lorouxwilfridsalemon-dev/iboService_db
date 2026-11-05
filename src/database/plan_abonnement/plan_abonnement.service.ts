// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { PlanAbonnementEntity } from './plan_abonnement.entity';
// import { isDefined } from 'class-validator';
// import { Response } from '../../core/shared/classes/response.class';
// import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

// @Injectable()
// export class PlanAbonnementService {
//   constructor(
//     @InjectRepository(PlanAbonnementEntity)
//     private readonly planRepository: Repository<PlanAbonnementEntity>,
//   ) {}

//   async save(plan: object): Promise<Response> {
//     const result = await this.planRepository.save(
//       plan as PlanAbonnementEntity,
//     );
//     return result;
//   }

//   async update(plan: object, primaryKey: object): Promise<Response> {
//     const existing: any = await this.findById(primaryKey);
//     const merged: any = {
//       ...existing,
//       ...plan,
//       ...primaryKey,
//     };
//     const result = await this.planRepository.save(merged);
//     return result;
//   }

//   // ==========================================================================
//   // DELETE — ✅ CORRIGÉ
//   // ==========================================================================
//   async delete(primaryKey: object): Promise<Response> {
//     // ✅ 1. Récupère l'enregistrement pour le retourner
//     const response: any = await this.findById(primaryKey);

//     // ✅ 2. Utilise findOne + remove pour plus de sûreté
//     //    (au lieu de delete qui peut échouer silencieusement)
//     await this.planRepository.remove(response);

//     return response;
//   }

//   async find(query: object): Promise<Response> {
//     const result = await this.planRepository.find(
//       TypeOrmHttpParamQuery(query),
//     );
//     return result;
//   }

//   async findById(primaryKey: object): Promise<Response> {
//     const result = await this.planRepository.findOne({
//       where: primaryKey,   // ✅ TypeORM 0.3+
//     });

//     if (!isDefined(result)) {
//       throw new HttpException(
//         {
//           status: {
//             code: HttpStatus.NOT_FOUND,
//             error: `Aucun plan d'abonnement trouvé`,
//           },
//         },
//         HttpStatus.NOT_FOUND,
//       );
//     }
//     return result;
//   }
// }


// // import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// // import { InjectRepository } from '@nestjs/typeorm';
// // import { Repository } from 'typeorm';
// // import { PlanAbonnementEntity } from './plan_abonnement.entity';
// // import { isDefined } from 'class-validator';
// // import { Response } from '../../core/shared/classes/response.class';
// // import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

// // @Injectable()
// // export class PlanAbonnementService {
// //   constructor(
// //     @InjectRepository(PlanAbonnementEntity)
// //     private readonly planRepository: Repository<PlanAbonnementEntity>,
// //   ) {}

// //   async save(plan: object): Promise<Response> {
// //     const result = await this.planRepository.save(
// //       plan as PlanAbonnementEntity,
// //     );
// //     return result;
// //   }

// //   async update(plan: object, primaryKey: object): Promise<Response> {
// //     const existing: any = await this.findById(primaryKey);
// //     const result = await this.planRepository.save({
// //       ...existing,
// //       ...plan,
// //     });
// //     return result;
// //   }

// //   async delete(primaryKey: object): Promise<Response> {
// //     const response: any = await this.findById(primaryKey);
// //     await this.planRepository.delete(primaryKey);
// //     return response;
// //   }

// //   async find(query: object): Promise<Response> {
// //     const result = await this.planRepository.find(
// //       TypeOrmHttpParamQuery(query),
// //     );
// //     return result;
// //   }

// //   async findById(primaryKey: object): Promise<Response> {
// //     const result = await this.planRepository.findOne(primaryKey);
// //     if (!isDefined(result)) {
// //       throw new HttpException(
// //         {
// //           status: {
// //             code: HttpStatus.NOT_FOUND,
// //             error: `Aucun plan d'abonnement trouvé`,
// //           },
// //         },
// //         HttpStatus.NOT_FOUND,
// //       );
// //     }
// //     return result;
// //   }
// // }


import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanAbonnementEntity } from './plan_abonnement.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class PlanAbonnementService {
  constructor(
    @InjectRepository(PlanAbonnementEntity)
    private readonly planRepository: Repository<PlanAbonnementEntity>,
  ) {}

  // ==========================================================================
  // CREATE
  // ==========================================================================
  async save(plan: object): Promise<Response> {
    const result = await this.planRepository.save(
      plan as PlanAbonnementEntity,
    );
    return result;
  }

  // ==========================================================================
  // UPDATE — ✅ CORRIGÉ
  // ==========================================================================
  async update(plan: object, primaryKey: object): Promise<Response> {
    // 1. Vérifie que l'enregistrement existe
    await this.findById(primaryKey);

    // 2. Extrait l'id
    const id = (primaryKey as any).id;

    if (!id) {
      throw new HttpException(
        {
          status: {
            code: HttpStatus.BAD_REQUEST,
            error: 'ID manquant pour la mise à jour',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // 3. Nettoie le body : retire id et champs système
    const { id: _ignoreId, ...planClean } = plan as any;

    // 4. Utilise update() — ne déclenche pas de validation d'entité complète
    await this.planRepository.update(id, planClean);

    // 5. Recharge et retourne l'entité mise à jour
    const result = await this.findById(primaryKey);
    return result;
  }

  // ==========================================================================
  // DELETE
  // ==========================================================================
  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    await this.planRepository.remove(response);
    return response;
  }

  // ==========================================================================
  // FIND
  // ==========================================================================
  async find(query: object): Promise<Response> {
    const result = await this.planRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.planRepository.findOne({
      where: primaryKey,
    });

    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: {
            code: HttpStatus.NOT_FOUND,
            error: `Aucun plan d'abonnement trouvé`,
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
} 