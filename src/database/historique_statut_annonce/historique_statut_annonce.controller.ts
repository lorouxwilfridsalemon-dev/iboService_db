import {Catch,Controller} from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { HistoriqueStatutAnnonceService } from './historique_statut_annonce.service';
import { HistoriqueStatutAnnonceDto } from './historique_statut_annonce.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Delete, Get, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('historiqueStatutAnnonce')
export class HistoriqueStatutAnnonceController {
  constructor(private readonly historiqueStatutAnnonceService: HistoriqueStatutAnnonceService) {}

  @Post()
  async save(@Body(new ValidationPipe()) historiqueStatutAnnonceDto: HistoriqueStatutAnnonceDto) {
    const result = await this.historiqueStatutAnnonceService.save(historiqueStatutAnnonceDto);
    return result;
  }

  @Put(':primaryKey') 
  async update(
    @Body(new ValidationPipe()) historiqueStatutAnnonceDto: HistoriqueStatutAnnonceDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
    ) {
    const result = await this.historiqueStatutAnnonceService.update(historiqueStatutAnnonceDto, primaryKey);
    return result;
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.historiqueStatutAnnonceService.delete(primaryKey);
    return result;
  }

  @Get()
  async find() {
    const result = await this.historiqueStatutAnnonceService.find({});
    return result;
  }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    const result = await this.historiqueStatutAnnonceService.find(findOption);
    return result;
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.historiqueStatutAnnonceService.findById(primaryKey);
    return result;
  }
}

