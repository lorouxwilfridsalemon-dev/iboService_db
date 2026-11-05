import {Catch,Controller} from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { CaracteristiqueService } from './caracteristique.service';
import { CaracteristiqueDto } from './caracteristique.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Delete, Get, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('caracteristique')
export class CaracteristiqueController {
  constructor(private readonly caracteristiqueService: CaracteristiqueService) {}

  @Post()
  async save(@Body(new ValidationPipe()) caracteristiqueDto: CaracteristiqueDto) {
    const result = await this.caracteristiqueService.save(caracteristiqueDto);
    return result;
  }

  @Put(':primaryKey') 
  async update(
    @Body(new ValidationPipe()) caracteristiqueDto: CaracteristiqueDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
    ) {
    const result = await this.caracteristiqueService.update(caracteristiqueDto, primaryKey);
    return result;
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.caracteristiqueService.delete(primaryKey);
    return result;
  }

  @Get()
  async find() {
    const result = await this.caracteristiqueService.find({});
    return result;
  }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    const result = await this.caracteristiqueService.find(findOption);
    return result;
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.caracteristiqueService.findById(primaryKey);
    return result;
  }
}

