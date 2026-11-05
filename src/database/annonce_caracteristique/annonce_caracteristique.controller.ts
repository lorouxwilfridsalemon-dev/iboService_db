import { Catch, Controller, Get, Query } from '@nestjs/common'; // ✅ Ajout de Query
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { AnnonceCaracteristiqueService } from './annonce_caracteristique.service';
import { AnnonceCaracteristiqueDto } from './annonce_caracteristique.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Delete, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('annonceCaracteristique')
export class AnnonceCaracteristiqueController {
  constructor(private readonly annonceCaracteristiqueService: AnnonceCaracteristiqueService) {}

  @Post()
  async save(@Body(new ValidationPipe()) annonceCaracteristiqueDto: AnnonceCaracteristiqueDto) {
    const result = await this.annonceCaracteristiqueService.save(annonceCaracteristiqueDto);
    return result;
  }

  @Put(':primaryKey') 
  async update(
    @Body(new ValidationPipe()) annonceCaracteristiqueDto: AnnonceCaracteristiqueDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
    ) {
    const result = await this.annonceCaracteristiqueService.update(annonceCaracteristiqueDto, primaryKey);
    return result;
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.annonceCaracteristiqueService.delete(primaryKey);
    return result;
  }

  // ✅ MODIFICATION ICI : Ajout du paramètre Query
  @Get()
  async find(@Query('annonceId') annonceId?: number) {
    if (annonceId) {
      // Si un annonceId est passé, on filtre par annonce
      const result = await this.annonceCaracteristiqueService.find({
        where: { annonce: { id: annonceId } },
        relations: ['caracteristique'],
      });
      return result;
    } else {
      // Sinon, on renvoie tout (comme avant)
      const result = await this.annonceCaracteristiqueService.find({});
      return result;
    }
  }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    const result = await this.annonceCaracteristiqueService.find(findOption);
    return result;
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.annonceCaracteristiqueService.findById(primaryKey);
    return result;
  }
}  



// import {Catch,Controller} from '@nestjs/common';
// import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
// import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
// import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
// import { AnnonceCaracteristiqueService } from './annonce_caracteristique.service';
// import { AnnonceCaracteristiqueDto } from './annonce_caracteristique.dto';
// import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
// import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
// import { Delete, Get, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
// import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';

// @Catch()
// @UseInterceptors(LoggingInterceptor)
// @Controller('annonceCaracteristique')
// export class AnnonceCaracteristiqueController {
//   constructor(private readonly annonceCaracteristiqueService: AnnonceCaracteristiqueService) {}

//   @Post()
//   async save(@Body(new ValidationPipe()) annonceCaracteristiqueDto: AnnonceCaracteristiqueDto) {
//     const result = await this.annonceCaracteristiqueService.save(annonceCaracteristiqueDto);
//     return result;
//   }

//   @Put(':primaryKey') 
//   async update(
//     @Body(new ValidationPipe()) annonceCaracteristiqueDto: AnnonceCaracteristiqueDto,
//     @Param('primaryKey', new ParseJsonPipe()) primaryKey,
//     ) {
//     const result = await this.annonceCaracteristiqueService.update(annonceCaracteristiqueDto, primaryKey);
//     return result;
//   }

//   @Delete(':primaryKey')
//   async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
//     const result = await this.annonceCaracteristiqueService.delete(primaryKey);
//     return result;
//   }

//   @Get()
//   async find() {
//     const result = await this.annonceCaracteristiqueService.find({});
//     return result;
//   }

//   @Get('query/:findOption')
//   async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
//     const result = await this.annonceCaracteristiqueService.find(findOption);
//     return result;
//   }

//   @Get(':primaryKey')
//   async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
//     const result = await this.annonceCaracteristiqueService.findById(primaryKey);
//     return result;
//   }
// }

