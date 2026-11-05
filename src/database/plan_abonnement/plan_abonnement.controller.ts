

import { Catch, Controller, Get, ParseIntPipe } from '@nestjs/common';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Delete, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { PlanAbonnementService } from './plan_abonnement.service';
import { PlanAbonnementDto } from './plan_abonnement.dto';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('plan-abonnement')
export class PlanAbonnementController {
  constructor(
    private readonly planAbonnementService: PlanAbonnementService,
  ) {}

  @Post()
  async save(@Body(new ValidationPipe()) dto: PlanAbonnementDto) {
    return this.planAbonnementService.save(dto);
  }

  // ✅ PUT avec id numérique simple
  @Put(':id')
  async update(
    @Body(new ValidationPipe()) dto: PlanAbonnementDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.planAbonnementService.update(dto, { id });
  }

  // ✅ DELETE avec id numérique simple
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    console.log('🗑️ DELETE reçu - id:', id);
    return this.planAbonnementService.delete({ id });
  }

  // ⚠️ Routes fixes AVANT la route paramétrée
  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    return this.planAbonnementService.find(findOption);
  }

  @Get()
  async find() {
    return this.planAbonnementService.find({});
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.planAbonnementService.findById({ id });
  }
}