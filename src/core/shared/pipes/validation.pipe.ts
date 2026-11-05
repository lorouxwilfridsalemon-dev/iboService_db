// import { BadRequestException, HttpException,HttpStatus } from '@nestjs/common';
// import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
// import { validate } from 'class-validator';
// import { plainToClass } from 'class-transformer';

// @Injectable()
// export class ValidationPipe implements PipeTransform<any> {
//     async transform(value, metadata: ArgumentMetadata) {
//         const { metatype } = metadata;
//         if (!metatype || !this.toValidate(metatype)) {
//             return value;
//         }
//         const object = plainToClass(metatype, value);
//         const errors = await validate(object);
//         if (errors.length > 0) {
//             throw new HttpException({
//               status:{ code : HttpStatus.BAD_REQUEST, error:"Les paramètres de la requète sont incorrectes" , message : errors }
//             },HttpStatus.BAD_REQUEST);
//         }
//         return value;
//     }

//     private toValidate(metatype): boolean {
//         const types = [String, Boolean, Number, Array, Object];
//         return !types.find(type => metatype === type);
//     }
// }

import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    // ✅ Log pour vérifier que CE pipe est bien appelé
    console.log('🔥 ValidationPipe custom appelé pour :', metatype?.name);

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // ✅ Transforme l'objet brut en instance de classe (pour que les décorateurs fonctionnent)
    const object = plainToInstance(metatype, value);

    const errors = await validate(object, {
      whitelist: false,
      forbidNonWhitelisted: false,
    });

    if (errors.length > 0) {
      // ✅ Extrait les erreurs détaillées champ par champ
      const detailedErrors = errors.map((err) => ({
        property: err.property,
        value: err.value,
        constraints: err.constraints,
      }));

      // ✅ LOG côté terminal NestJS
      console.error('🚨 ================================');
      console.error('🚨 Erreurs de validation DTO :');
      console.error(JSON.stringify(detailedErrors, null, 2));
      console.error('🚨 ================================');

      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation object failed',
        errors: detailedErrors,
      });
    }

    // ✅ Renvoie l'objet transformé (instance de la classe DTO)
    return object;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
} 