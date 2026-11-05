import {Catch,Controller} from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { StatutAnnonceService } from './statut_annonce.service';
import { StatutAnnonceDto } from './statut_annonce.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Delete, Get, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('statutAnnonce')
export class StatutAnnonceController {
  constructor(private readonly statutAnnonceService: StatutAnnonceService) {}

  @Post()
  async save(@Body(new ValidationPipe()) statutAnnonceDto: StatutAnnonceDto) {
    const result = await this.statutAnnonceService.save(statutAnnonceDto);
    return result;
  }

  @Put(':primaryKey') 
  async update(
    @Body(new ValidationPipe()) statutAnnonceDto: StatutAnnonceDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
    ) {
    const result = await this.statutAnnonceService.update(statutAnnonceDto, primaryKey);
    return result;
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.statutAnnonceService.delete(primaryKey);
    return result;
  }

  @Get()
  async find() {
    const result = await this.statutAnnonceService.find({});
    return result;
  }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    const result = await this.statutAnnonceService.find(findOption);
    return result;
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.statutAnnonceService.findById(primaryKey);
    return result;
  }
}

