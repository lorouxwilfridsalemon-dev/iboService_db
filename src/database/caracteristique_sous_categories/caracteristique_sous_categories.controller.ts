import { Catch, Controller, Get, Query, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { CaracteristiqueSousCategoriesService } from './caracteristique_sous_categories.service';
import { CaracteristiqueSousCategoriesDto } from './caracteristique_sous_categories.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('caracteristiqueSousCategories')
export class CaracteristiqueSousCategoriesController {
  constructor(
    private readonly caracteristiqueSousCategoriesService: CaracteristiqueSousCategoriesService,
  ) {}

  @Post()
  async save(@Body(new ValidationPipe()) caracteristiqueSousCategoriesDto: CaracteristiqueSousCategoriesDto) {
    const result = await this.caracteristiqueSousCategoriesService.save(caracteristiqueSousCategoriesDto);
    return result;
  }

  @Put(':primaryKey') 
  async update(
    @Body(new ValidationPipe()) caracteristiqueSousCategoriesDto: CaracteristiqueSousCategoriesDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
  ) {
    const result = await this.caracteristiqueSousCategoriesService.update(caracteristiqueSousCategoriesDto, primaryKey);
    return result;
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.caracteristiqueSousCategoriesService.delete(primaryKey);
    return result;
  }

  @Get()
  async find(@Query() query: any) {
    const result = await this.caracteristiqueSousCategoriesService.find(query);
    return result;
  }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    const result = await this.caracteristiqueSousCategoriesService.find(findOption);
    return result;  
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.caracteristiqueSousCategoriesService.findById(primaryKey);
    return result;
  }
} 






// import {Catch,Controller} from '@nestjs/common';
// import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
// import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
// import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
// import { CaracteristiqueSousCategoriesService } from './caracteristique_sous_categories.service';
// import { CaracteristiqueSousCategoriesDto } from './caracteristique_sous_categories.dto';
// import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
// import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
// import { Delete, Get, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
// import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';

// @Catch()
// @UseInterceptors(LoggingInterceptor)
// @Controller('caracteristiqueSousCategories')
// export class CaracteristiqueSousCategoriesController {
//   constructor(private readonly caracteristiqueSousCategoriesService: CaracteristiqueSousCategoriesService) {}

//   @Post()
//   async save(@Body(new ValidationPipe()) caracteristiqueSousCategoriesDto: CaracteristiqueSousCategoriesDto) {
//     const result = await this.caracteristiqueSousCategoriesService.save(caracteristiqueSousCategoriesDto);
//     return result;
//   }

//   @Put(':primaryKey') 
//   async update(
//     @Body(new ValidationPipe()) caracteristiqueSousCategoriesDto: CaracteristiqueSousCategoriesDto,
//     @Param('primaryKey', new ParseJsonPipe()) primaryKey,
//     ) {
//     const result = await this.caracteristiqueSousCategoriesService.update(caracteristiqueSousCategoriesDto, primaryKey);
//     return result;
//   }

//   @Delete(':primaryKey')
//   async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
//     const result = await this.caracteristiqueSousCategoriesService.delete(primaryKey);
//     return result;
//   }

//   @Get()
//   async find() {
//     const result = await this.caracteristiqueSousCategoriesService.find({});
//     return result;
//   }

//   @Get('query/:findOption')
//   async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
//     const result = await this.caracteristiqueSousCategoriesService.find(findOption);
//     return result;
//   }

//   @Get(':primaryKey')
//   async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
//     const result = await this.caracteristiqueSousCategoriesService.findById(primaryKey);
//     return result;
//   }
// }

