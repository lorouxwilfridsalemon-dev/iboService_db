

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Query } from '@nestjs/common';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ReservationMetierService } from './reservation-metier.service';
import { ReserverDto } from './reserver.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('metier/reservation')
export class ReservationMetierController {
  constructor(
    private readonly reservationMetierService: ReservationMetierService,
  ) {}

  @Post('reserver')
  @UseGuards(JwtAuthGuard)
  async reserver(
    @Body(new ValidationPipe()) dto: ReserverDto,
    @CurrentUser() user: any,
  ) {
    return this.reservationMetierService.reserver(dto, user.id);
  }

  // ✅ AJOUT : GET /metier/reservation/admin/liste — dashboard web.
  @Get('admin/liste')
  async listeAdmin() {
    return this.reservationMetierService.listeReservationsAdmin();
  }

  @Put('admin/valider/:id')
  async validerAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.reservationMetierService.validerReservationAdmin(id);
  }

  @Put('admin/annuler/:id')
  async annulerAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.reservationMetierService.annulerReservationAdmin(id);
  }

  @Delete('admin/:id')
  async supprimerAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.reservationMetierService.supprimerReservationAdmin(id);
  }

  /**
   * ✅ AJOUT : POST /metier/reservation/admin/creer
   */
  @Post('admin/creer')
  async creerAdmin(@Body() body: any) {
    return this.reservationMetierService.creerReservationAdmin(body);
  }

  /**
   * ✅ CORRECTION ICI : Nous avons ajouté @UseGuards(JwtAuthGuard)
   * pour que le serveur puisse lire le token et authentifier l'utilisateur.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getReservations(
    @Query('type') type: string,
    @CurrentUser() user: any
  ) {
    if (type === 'mes-reservations') {
      return this.reservationMetierService.mesReservations(user.id);
    } else if (type === 'recues') {
      return this.reservationMetierService.reservationsRecues(user.id);
    }

    return {
      etat: 'echec',
      message: 'Type de réservation invalide. Utilisez "mes-reservations" ou "recues".'
    };
  }

  @Put('annuler/:id')
  @UseGuards(JwtAuthGuard)
  async annuler(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reservationMetierService.annulerReservation(Number(id), user.id);
  }

  @Put('valider/:id')
  @UseGuards(JwtAuthGuard)
  async valider(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reservationMetierService.validerReservation(Number(id), user.id);
  }
}