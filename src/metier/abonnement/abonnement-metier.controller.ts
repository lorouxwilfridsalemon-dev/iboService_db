

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { AbonnementMetierService } from './abonnement-metier.service';
import { SouscrireDto } from './dto/souscrire.dto';
import { AnnulerDto } from './dto/annuler.dto';
import { AbonnementDto } from './dto/abonnement.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('metier/abonnement')
export class AbonnementMetierController {
  constructor(
    private readonly abonnementMetierService: AbonnementMetierService,
  ) {}

  // =========================================================================
  // ROUTES PUBLIQUES
  // =========================================================================

  @Get('plans')
  async getPlans() {
    return this.abonnementMetierService.getPlans();
  }

  // =========================================================================
  // ROUTES UTILISATEUR
  // =========================================================================

  @Post('souscrire')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async souscrire(@Body() dto: SouscrireDto, @CurrentUser() user: any) {
    return this.abonnementMetierService.souscrire(dto.codePlan, user.id);
  }

  @Get('mon-abonnement')
  @UseGuards(JwtAuthGuard)
  async getMonAbonnement(@CurrentUser() user: any) {
    return this.abonnementMetierService.getMonAbonnement(user.id);
  }

  @Get('historique')
  @UseGuards(JwtAuthGuard)
  async getHistorique(@CurrentUser() user: any) {
    return this.abonnementMetierService.getHistorique(user.id);
  }

  @Post('annuler')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async annuler(@Body() dto: AnnulerDto, @CurrentUser() user: any) {
    return this.abonnementMetierService.annuler(dto.raison, user.id);
  }

  // =========================================================================
  // ✅ ROUTES ADMIN
  // =========================================================================

  /**
   * GET /metier/abonnement/admin/liste
   * Liste tous les abonnements avec filtres de périodicité.
   */
  @Get('admin/liste')
  @UseGuards(JwtAuthGuard)
  async listeAdmin(
    @Query('periodicite') periodicite?: string,
    @Query('dateJour') dateJour?: string,
    @Query('dateDebut') dateDebut?: string,
    @Query('dateFin') dateFin?: string,
    @Query('semaine') semaine?: string,
    @Query('mois') mois?: string,
    @Query('annee') annee?: string,
  ) {
    return this.abonnementMetierService.listeAdmin({
      periodicite,
      dateJour,
      dateDebut,
      dateFin,
      semaine: semaine ? parseInt(semaine, 10) : undefined,
      mois: mois ? parseInt(mois, 10) : undefined,
      annee: annee ? parseInt(annee, 10) : undefined,
    });
  }

  /**
   * GET /metier/abonnement/admin/stats
   * ✅ Statistiques globales des abonnements pour le dashboard.
   */
  @Get('admin/stats')
  @UseGuards(JwtAuthGuard)
  async statsDashboard(
    @Query('dateDebut') dateDebut?: string,
    @Query('dateFin') dateFin?: string,
  ) {
    return this.abonnementMetierService.getStatsDashboard(dateDebut, dateFin);
  }

  /**
   * POST /metier/abonnement/admin/creer
   * Création manuelle d'un abonnement par l'admin.
   */
  @Post('admin/creer')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async creerAdmin(
    @Body() dto: AbonnementDto,
    @CurrentUser() user: any,
  ) {
    return this.abonnementMetierService.creerAdmin(dto, user.id);
  }

  /**
   * PUT /metier/abonnement/admin/activer/:id
   * Active un abonnement (statut → actif).
   */
  @Put('admin/activer/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async activerAdmin(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.abonnementMetierService.activerAdmin(id, user.id);
  }

  /**
   * PUT /metier/abonnement/admin/annuler/:id
   * Annule un abonnement (admin).
   */
  @Put('admin/annuler/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async annulerAdmin(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.abonnementMetierService.annulerAdmin(id, user.id);
  }

  /**
   * DELETE /metier/abonnement/admin/:id
   * Supprime (soft delete) un abonnement.
   */
  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async supprimerAdmin(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.abonnementMetierService.supprimerAdmin(id, user.id);
  }

  // =========================================================================
  // ⚠️ ROUTES DE TEST (À SUPPRIMER EN PRODUCTION)
  // =========================================================================

  /**
   * POST /metier/abonnement/admin/simuler-paiement/:transactionId
   */
  @Post('admin/simuler-paiement/:transactionId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async simulerPaiement(
    @Param('transactionId', ParseIntPipe) transactionId: number,
  ) {
    return this.abonnementMetierService.simulerPaiement(transactionId);
  }
}