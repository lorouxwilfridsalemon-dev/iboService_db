import { Catch, Controller, InternalServerErrorException } from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { ProduitService } from './produit.service';
import { ProduitDto } from './produit.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Delete, Get, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('produit')
export class ProduitController {
  constructor(private readonly produitService: ProduitService) { }

  @Post()
  async save(@Body(new ValidationPipe()) produitDto: ProduitDto) {
    const result = await this.produitService.save(produitDto);
    return result;
  }

  @Put(':primaryKey')
  async update(
    @Body(new ValidationPipe()) produitDto: ProduitDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
  ) {
    const result = await this.produitService.update(produitDto, primaryKey);
    return result;
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.produitService.delete(primaryKey);
    return result;
  }

  @Get()
  async find() {
    const result = await this.produitService.find({});
    return result;
  }

  // @Get('query/:findOption')
  // async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
  //   console.log('findOption', findOption);

  //   const result = await this.produitService.find(findOption);
  //   return result;
  // }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    const result = await this.produitService.find(findOption);
    return result;
  }


  // @Get('query/:findOption')
  // async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
  //   try {
  //     const result = await this.produitService.find(findOption);
  //     return result;
  //   } catch (error) {
  //     throw new InternalServerErrorException({
  //       message: 'Erreur lors de la récupération des produits',
  //       detail: error.message,
  //     });
  //   }
  // }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.produitService.findById(primaryKey);
    return result;
  }
}

