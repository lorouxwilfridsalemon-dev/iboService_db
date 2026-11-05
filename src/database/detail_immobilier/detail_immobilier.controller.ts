import {Catch,Controller} from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { DetailImmobilierService } from './detail_immobilier.service';
import { DetailImmobilierDto } from './detail_immobilier.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Delete, Get, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('detailImmobilier')
export class DetailImmobilierController {
  constructor(private readonly detailImmobilierService: DetailImmobilierService) {}

  @Post()
  async save(@Body(new ValidationPipe()) detailImmobilierDto: DetailImmobilierDto) {
    const result = await this.detailImmobilierService.save(detailImmobilierDto);
    return result;
  }

  @Put(':primaryKey')
  async update(
    @Body(new ValidationPipe()) detailImmobilierDto: DetailImmobilierDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
    ) {
    const result = await this.detailImmobilierService.update(detailImmobilierDto, primaryKey);
    return result;
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.detailImmobilierService.delete(primaryKey);
    return result;
  }

  @Get()
  async find() {
    const result = await this.detailImmobilierService.find({});
    return result;
  }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    const result = await this.detailImmobilierService.find(findOption);
    return result;
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.detailImmobilierService.findById(primaryKey);
    return result;
  }
}

