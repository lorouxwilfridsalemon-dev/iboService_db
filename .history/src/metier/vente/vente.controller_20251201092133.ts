import { Body, Catch, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { VenteMetierService } from './vente.service';


// CONTROLLER DE VENTE

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('metier/vente')
export class VenteMetierController {

  constructor(
    private readonly venteMetierService: VenteMetierService,
  ) { }

  @Post('creer')
  async creerVente(@Body() venteData: any) {
    return await this.venteMetierService.creerVente(venteData);
  }
}
