import { Catch, Controller, Get } from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Delete, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { AbonnementService } from './abonnement.service';
import { AbonnementDto } from './abonnement.dto';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('abonnement')
export class AbonnementController {
  constructor(
    private readonly abonnementService: AbonnementService,
  ) {}

  @Post()
  async save(@Body(new ValidationPipe()) dto: AbonnementDto) {
    return this.abonnementService.save(dto);
  }

  @Put(':primaryKey')
  async update(
    @Body(new ValidationPipe()) dto: AbonnementDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
  ) {
    return this.abonnementService.update(dto, primaryKey);
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    return this.abonnementService.delete(primaryKey);
  }

  @Get()
  async find() {
    return this.abonnementService.find({});
  }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    return this.abonnementService.find(findOption);
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    return this.abonnementService.findById(primaryKey);
  }
  
} 