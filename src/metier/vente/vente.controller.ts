import { Body, Catch, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { VenteMetierService } from './vente.service';

/**
 * CONTROLLER DE VENTE
 * 
 * Endpoints pour gérer les ventes de poisson
 */
@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('metier/vente')
export class VenteMetierController {
  
  constructor(
    private readonly venteMetierService: VenteMetierService,
  ) {}

  /**
   * POST /metier/vente/creer
   * 
   * Créer une nouvelle vente complète
   * 
   * DONNÉES ATTENDUES :
   * {
   *   "clientNom": "Jean Dupont",
   *   "clientNumero": "0612345678",
   *   "clientTypeClient": 1,
   *   "utilisateurId": 1,
   *   "supportId": 1,
   *   "details": [
   *     { "produitId": 1, "poids": 5.250, "prixKg": 30.00 },
   *     { "produitId": 2, "poids": 3.000, "prixKg": 25.00 }
   *   ]
   * }
   * 
   * RÉPONSE :
   * {
   *   "success": true,
   *   "message": "Vente créée avec succès",
   *   "data": {
   *     "venteId": 1,
   *     "client": { "id": 1, "nom": "Jean Dupont", ... },
   *     "montantTotal": 232.50,
   *     "nombreArticles": 2,
   *     "details": [...]
   *   }
   * }
   */
  @Post('creer')
  async creerVente(@Body() venteData: any) {
    return await this.venteMetierService.creerVente(venteData);
  }
}
