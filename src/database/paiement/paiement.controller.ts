import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseInterceptors } from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { PaiementDto } from './paiement.dto';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';

@UseInterceptors(LoggingInterceptor)
@Controller('paiement')
export class PaiementController {
  constructor(private readonly paiementService: PaiementService) {}

  @Post()
  async create(@Body(ValidationPipe) paiementDto: PaiementDto) {
    return await this.paiementService.save(paiementDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return await this.paiementService.find(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.paiementService.findById({ id });
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body(ValidationPipe) paiementDto: PaiementDto) {
    return await this.paiementService.update(paiementDto, { id });
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.paiementService.delete({ id });
  }
}

