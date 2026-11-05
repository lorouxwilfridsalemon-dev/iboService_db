import { Catch, Controller, Get } from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Delete, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { PaiementMobileService } from './paiement_mobile.service';
import { PaiementMobileDto } from './paiement_mobile.dto';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('paiement-mobile')   // ✅ CORRIGÉ : route dédiée
export class PaiementMobileController {
  constructor(
    private readonly paiementMobileService: PaiementMobileService,
  ) {}

  @Post()
  async save(@Body(new ValidationPipe()) dto: PaiementMobileDto) {
    return this.paiementMobileService.save(dto);
  }

  @Put(':primaryKey')
  async update(
    @Body(new ValidationPipe()) dto: PaiementMobileDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
  ) {
    return this.paiementMobileService.update(dto, primaryKey);
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    return this.paiementMobileService.delete(primaryKey);
  }

  @Get()
  async find() {
    return this.paiementMobileService.find({});
  }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    return this.paiementMobileService.find(findOption);
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    return this.paiementMobileService.findById(primaryKey);
  }
}