import { IsInt, IsIn, Min } from 'class-validator';

/**
 * DTO pour l'achat d'un boost.
 */
export class AcheterBoostDto {
  /**
   * Identifiant de l'annonce à booster.
   */
  @IsInt()
  @Min(1)
  readonly annonceId: number;

  /**
   * Durée du boost en mois.
   * Valeurs : 1 (500 FCFA) ou 6 (1 500 FCFA)
   */
  @IsInt()
  @IsIn([1, 6], {
    message: 'La durée doit être 1 mois ou 6 mois',
  })
  readonly dureeMois: number;
}