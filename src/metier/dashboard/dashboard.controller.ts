import { Controller, Get, Query, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { DashboardMetierService } from './dashboard.service'; 
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('metier/dashboard') 
export class DashboardMetierController {  
  constructor(private readonly dashboardMetierService: DashboardMetierService) {}

  @Get('annonces-periodicite')
  async annoncesParPeriodicite() { 
    return this.dashboardMetierService.annoncesParPeriodicite();
  }

  @Get('annonces-tendance')
  async annoncesTendance() {
    return this.dashboardMetierService.annoncesTendance12Mois();
  } 

  @Get('vue-ensemble')
  async vueEnsemble(
    @Query('dateDebut') dateDebut?: string,
    @Query('dateFin') dateFin?: string,
  ) {
    return this.dashboardMetierService.vueEnsemble(
      dateDebut ? new Date(dateDebut) : undefined,
      dateFin ? new Date(dateFin + 'T23:59:59') : undefined,
    );
  }

  /**
   * ✅ AJOUT : GET /metier/dashboard/mon-tableau-de-bord
   * Tableau de bord PERSONNEL, pour l'app mobile — protégé par JWT.
   */

  @Get('mon-tableau-de-bord')
  @UseGuards(JwtAuthGuard)
  async monTableauDeBord(@CurrentUser() user: any) {
    return this.dashboardMetierService.monTableauDeBord(user.id);
  }


}



// // import { Controller, Post, Body, HttpException, HttpStatus, Logger, Get } from '@nestjs/common';
// // import { DashboardMetierService } from './dashboard.service';

// // @Controller('metier/dashboard')
// // export class DashboardMetierController {
// //   private readonly logger = new Logger(DashboardMetierController.name);
  
// //   constructor(
// //     private readonly dashboardMetierService: DashboardMetierService,
// //   ) {}


// // }

// import { Controller, Get, Query } from '@nestjs/common';
// import { DashboardMetierService } from './dashboard.service';
// // import { DashboardMetierService } from './dashboard-metier.service';

// @Controller('metier/dashboard')
// export class DashboardMetierController {
//   constructor(private readonly dashboardMetierService: DashboardMetierService) {}

//   @Get('annonces-periodicite')
//   async annoncesParPeriodicite() {
//     return this.dashboardMetierService.annoncesParPeriodicite();
//   }

//   @Get('annonces-tendance')
//   async annoncesTendance() {
//     return this.dashboardMetierService.annoncesTendance12Mois();
//   }

//   /**
//    * ✅ MODIFIÉ : accepte maintenant ?dateDebut=YYYY-MM-DD&dateFin=YYYY-MM-DD
//    * en query params, tous deux optionnels.
//    */
//   @Get('vue-ensemble')
//   async vueEnsemble(
//     @Query('dateDebut') dateDebut?: string,
//     @Query('dateFin') dateFin?: string,
//   ) {
//     return this.dashboardMetierService.vueEnsemble(
//       dateDebut ? new Date(dateDebut) : undefined,
//       dateFin ? new Date(dateFin + 'T23:59:59') : undefined, // ✅ inclut toute la journée de fin
//     );
//   }
// } 