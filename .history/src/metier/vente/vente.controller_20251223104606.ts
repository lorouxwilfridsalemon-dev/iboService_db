import { Body, Catch, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { VenteMetierService } from './vente.service';


//  * CONTROLLER DE VENTE

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('metier/vente')
export class VenteMetierController {

  constructor(
    private readonly venteMetierService: VenteMetierService,
  ) { }

  @Post('creerVente')
  async creerVente(@Body() venteData: any) {
    return await this.venteMetierService.creerVente(venteData);
  }

  // @Post('venteParJour')
  // async venteParJour(@Body() query: any) {
  //   return await this.venteMetierService.venteParJour(query);
  // }

  // @Post('venteParMois')
  // async venteParMois(@Body() query: any) {
  //   return await this.venteMetierService.venteParMois(query);
  // }

  // @Post('venteParAnnee')
  // async venteParAnnee(@Body() query: any) {
  //   return await this.venteMetierService.venteParAnnee(query);
  // }

  // @Post('venteParSemaine')
  // async venteParSemaine(@Body() query: any) {
  //   return await this.venteMetierService.venteParSemaine(query);
  // }

  @Post('ventes/periodicite')
  async getVentesByPeriodicite(@Body() searchData: any) {
    try {
      return await this.venteMetierService.listeVentesByPeriodicite(searchData);
    } catch (error) {
      console.error('Erreur dans getVentesByPeriodicite:', error);
      throw error;
    }
  }

  @Get('listeVentes')
  async listeVentes() {
    return await this.venteMetierService.listeVentes();
  }

  @Post('paiements/jour')
  async paiementsParJour(@Body() body: any) {
    return await this.venteMetierService.paiementsParJour(body);
  }

  @Post('paiements/semaine')
  async paiementsParSemaine(@Body() body: any) {
    return await this.venteMetierService.paiementsParSemaine(body);
  }

  @Post('paiements/mois')
  async paiementsParMois(@Body() body: any) {
    return await this.venteMetierService.paiementsParMois(body);
  }


  @Post('paiements/annee')
  async paiementsParAnnee(@Body() body: any) {
    return await this.venteMetierService.paiementsParAnnee(body);
  }
}



