import { Controller, Get, Query } from '@nestjs/common';
import { DashboardMetierService } from './dashboard.service';

@Controller('metier/dashboard')
export class DashboardMetierController {
  constructor(
    private readonly dashboardMetierService: DashboardMetierService,
  ) {}

  @Get('statistiques/jour')
  async statistiquesParJour(@Query() query: any) {
    return await this.dashboardMetierService.statistiquesParJour(query);
  }

  @Get('statistiques/semaine')
  async statistiquesParSemaine(@Query() query: any) {
    return await this.dashboardMetierService.statistiquesParSemaine(query);
  }

  @Get('statistiques/mois')
  async statistiquesParMois(@Query() query: any) {
    return await this.dashboardMetierService.statistiquesParMois(query);
  }

  @Get('statistiques/annee')
  async statistiquesParAnnee(@Query() query: any) {
    return await this.dashboardMetierService.statistiquesParAnnee(query);
  }

}

