import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { EtatMetierService } from './etat.service';

@Controller('metier/etat')
@UseInterceptors(LoggingInterceptor)
export class EtatMetierController {
  constructor(
    private readonly etatMetierService: EtatMetierService,
  ) {}

  /**
   * GET /metier/etat/jour?date=2025-11-01
   * Récupère les statistiques de ventes pour un jour spécifique
   */
  @Get('jour')
  async getEtatJour(@Query('date') date: string) {
    return await this.etatMetierService.getEtatJour(date);
  }

  /**
   * GET /metier/etat/semaine?date=2025-11-01
   * Récupère les statistiques de ventes pour une semaine
   */
  @Get('semaine')
  async getEtatSemaine(@Query('date') date: string) {
    return await this.etatMetierService.getEtatSemaine(date);
  }

  /**
   * GET /metier/etat/mois?mois=11&annee=2025
   * Récupère les statistiques de ventes pour un mois
   */
  @Get('mois')
  async getEtatMois(
    @Query('mois') mois: number,
    @Query('annee') annee: number,
  ) {
    return await this.etatMetierService.getEtatMois(mois, annee);
  }

  /**
   * GET /metier/etat/annee?annee=2025
   * Récupère les statistiques de ventes pour une année
   */
  @Get('annee')
  async getEtatAnnee(@Query('annee') annee: number) {
    return await this.etatMetierService.getEtatAnnee(annee);
  }
}

