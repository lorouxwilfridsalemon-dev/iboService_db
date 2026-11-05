import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { FavoriMetierService } from './favori-metier.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
// import { FavoriMetierService } from './favori-metier.service';

/**
 * Toutes les routes sont protegees par JWT des le depart - l'utilisateur
 * est identifie via le token (@CurrentUser()), jamais via un parametre
 * d'URL ou le corps de la requete (lecon tiree du module reservation).
 */
@Controller('metier/favori')
export class FavoriMetierController {
  constructor(private readonly favoriMetierService: FavoriMetierService) {}

  /**
   * POST /metier/favori/toggle/:annonceId
   * Ajoute ou retire l'annonce des favoris de l'utilisateur connecte.
   */
  @Post('toggle/:annonceId')
  @UseGuards(JwtAuthGuard)
  async toggle(
    @Param('annonceId') annonceId: string,
    @CurrentUser() user: any,
  ) {
    return this.favoriMetierService.toggleFavori(Number(annonceId), user.id);
  }

  /**
   * GET /metier/favori/est-favori/:annonceId
   * Indique si cette annonce est deja en favori (pour l'etat initial du
   * coeur dans AnnonceDetailPage).
   */
  @Get('est-favori/:annonceId')
  @UseGuards(JwtAuthGuard)
  async estFavori(
    @Param('annonceId') annonceId: string,
    @CurrentUser() user: any,
  ) {
    return this.favoriMetierService.estFavori(Number(annonceId), user.id);
  }

  /**
   * GET /metier/favori/mes-favoris
   */
  @Get('mes-favoris')
  @UseGuards(JwtAuthGuard)
  async mesFavoris(@CurrentUser() user: any) {
    return this.favoriMetierService.mesFavoris(user.id);
  }
}