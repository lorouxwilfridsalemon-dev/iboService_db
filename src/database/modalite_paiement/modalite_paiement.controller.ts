import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseInterceptors } from '@nestjs/common';
import { ModalitePaiementService } from './modalite_paiement.service';
import { ModalitePaiementDto } from './modalite_paiement.dto';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';

@UseInterceptors(LoggingInterceptor)
@Controller('modalite-paiement')
export class ModalitePaiementController {
  constructor(private readonly modalitePaiementService: ModalitePaiementService) {}

  @Post()
  async create(@Body(ValidationPipe) modalitePaiementDto: ModalitePaiementDto) {
    return await this.modalitePaiementService.save(modalitePaiementDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return await this.modalitePaiementService.find(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.modalitePaiementService.findById({ id });
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body(ValidationPipe) modalitePaiementDto: ModalitePaiementDto) {
    return await this.modalitePaiementService.update(modalitePaiementDto, { id });
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.modalitePaiementService.delete({ id });
  }
}

