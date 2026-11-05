import { Catch, Controller, Get } from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Delete, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { BoostService } from './boost.service';
import { BoostDto } from './boost.dto';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('boost')   // ✅ CORRIGÉ : route boost
export class BoostController {   // ✅ CORRIGÉ
  constructor(
    private readonly boostService: BoostService,
  ) {}

  @Post()
  async save(@Body(new ValidationPipe()) dto: BoostDto) {
    return this.boostService.save(dto);
  }

  @Put(':primaryKey')
  async update(
    @Body(new ValidationPipe()) dto: BoostDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
  ) {
    return this.boostService.update(dto, primaryKey);
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    return this.boostService.delete(primaryKey);
  }

  @Get()
  async find() {
    return this.boostService.find({});
  }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    return this.boostService.find(findOption);
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    return this.boostService.findById(primaryKey);
  }
}