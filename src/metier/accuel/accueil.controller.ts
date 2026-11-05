  // import { Controller, Get, Param, Query } from '@nestjs/common';
  // import { AccueilMetierService } from './accueil.service';

  // @Controller('metier/accueil')
  // export class AccueilMetierController {

  //   constructor(
  //     private readonly accueilMetierService: AccueilMetierService,
  //   ) { }

  //   /**
  //    * GET /metier/accueil/annonces
  //    */
  //   @Get('annonces')
  //   async getAllAnnonces(
  //     @Query('categorieId') categorieId?: number,
  //     @Query('sousCategorieId') sousCategorieId?: number,
  //     @Query('limit') limit?: number,
  //   ) {
  //     return this.accueilMetierService.getAllAnnonces({
  //       categorieId: categorieId ? Number(categorieId) : undefined,
  //       sousCategorieId: sousCategorieId ? Number(sousCategorieId) : undefined,
  //       limit: limit ? Number(limit) : undefined,
  //     });
  //   }

  //   /**
  //    * GET /metier/accueil/videos/annonces 
  //    */
  //   @Get('videos/annonces')
  //   async getVideosAnnonces(@Query('limit') limit?: number) {
  //     return this.accueilMetierService.getVideosAnnonces(
  //       limit ? Number(limit) : undefined,
  //     );
  //   }

  //   /**
  //    * GET /metier/accueil/annonces/:id
  //    */
  //   @Get('annonces/:id')
  //   async getAnnonceById(@Param('id') id: number) {
  //     return this.accueilMetierService.getAnnonceById(id);
  //   }

  //   /**
  //    * GET /metier/accueil/rechercher?q=terme
  //    */
  //   @Get('rechercher')
  //   async rechercher(@Query('q') query: string) {
  //     return this.accueilMetierService.rechercherAnnonces(query);
  //   }

  //   /**
  //    * GET /metier/accueil/utilisateur/:id/annonces
  //    */
  //   @Get('utilisateur/:id/annonces')
  //   async getAnnoncesByUtilisateur(@Param('id') id: number) {
  //     return this.accueilMetierService.getAnnoncesByUtilisateur(id);
  //   }

  //   /**
  //    * GET /metier/accueil/adresses
  //    */
  //   @Get('adresses')
  //   async getAdresses() {
  //     return this.accueilMetierService.getAdressesUniques();
  //   }

  // }



import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AccueilMetierService } from './accueil.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// ✅ AJOUT : pour la nouvelle route sécurisée "mes annonces".
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('metier/accueil')
export class AccueilMetierController {

  constructor(
    private readonly accueilMetierService: AccueilMetierService,
  ) { }

  /**
   * GET /metier/accueil/annonces
   */
  @Get('annonces')
  async getAllAnnonces(
    @Query('categorieId') categorieId?: number,
    @Query('sousCategorieId') sousCategorieId?: number,
    @Query('limit') limit?: number,
  ) {
    return this.accueilMetierService.getAllAnnonces({
      categorieId: categorieId ? Number(categorieId) : undefined,
      sousCategorieId: sousCategorieId ? Number(sousCategorieId) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }


  /**
   * GET /metier/accueil/videos/annonces
   */
  @Get('videos/annonces')
  async getVideosAnnonces(@Query('limit') limit?: number) {
    return this.accueilMetierService.getVideosAnnonces(
      limit ? Number(limit) : undefined,
    );
  }

  /**
   * GET /metier/accueil/annonces/:id
   */
  @Get('annonces/:id')
  async getAnnonceById(@Param('id') id: number) {
    return this.accueilMetierService.getAnnonceById(id);
  }

  /**
   * GET /metier/accueil/rechercher?q=terme
   */
  @Get('rechercher')
  async rechercher(@Query('q') query: string) {
    return this.accueilMetierService.rechercherAnnonces(query);
  }

  /**
   * GET /metier/accueil/utilisateur/:id/annonces
   * ⚠️ Route publique existante — n'importe qui connaissant un ID peut
   * voir TOUTES les annonces (tous statuts) de cet utilisateur. Laissée
   * telle quelle pour ne pas casser un usage existant, mais ne pas
   * l'utiliser pour "Mes annonces" (voir route sécurisée ci-dessous).
   */
  @Get('utilisateur/:id/annonces')
  async getAnnoncesByUtilisateur(@Param('id') id: number) {
    return this.accueilMetierService.getAnnoncesByUtilisateur(id);
  }

  /**
   * ✅ NOUVEAU : GET /metier/accueil/mes-annonces
   * Version sécurisée — l'utilisateur est déduit du token JWT, jamais
   * d'un ID dans l'URL. C'est cette route que "Mes annonces" doit utiliser.
   */
  @Get('mes-annonces')
  @UseGuards(JwtAuthGuard)
  async mesAnnonces(@CurrentUser() user: any) {
    return this.accueilMetierService.getAnnoncesByUtilisateur(user.id);
  }

  /**
   * GET /metier/accueil/adresses
   */
  @Get('adresses')
  async getAdresses() {
    return this.accueilMetierService.getAdressesUniques();
  }

} 