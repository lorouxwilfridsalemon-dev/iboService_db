import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseInterceptors } from '@nestjs/common';
import { HistoriqueProduitService } from './historique_produit.service';
import { HistoriqueProduitDto } from './historique_produit.dto';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';

@UseInterceptors(LoggingInterceptor)
@Controller('historique-produit')
export class HistoriqueProduitController {
  constructor(private readonly historiqueProduitService: HistoriqueProduitService) {}

  @Post()
  async create(@Body(ValidationPipe) historiqueProduitDto: HistoriqueProduitDto) {
    return await this.historiqueProduitService.save(historiqueProduitDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return await this.historiqueProduitService.find(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.historiqueProduitService.findById({ id });
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body(ValidationPipe) historiqueProduitDto: HistoriqueProduitDto) {
    return await this.historiqueProduitService.update(historiqueProduitDto, { id });
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.historiqueProduitService.delete({ id });
  }
}

