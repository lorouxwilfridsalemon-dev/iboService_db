import { IsString, IsOptional, MaxLength } from 'class-validator';

/**
 * DTO pour l'annulation d'un abonnement.
 */
export class AnnulerDto {
  /**
   * Raison de l'annulation (optionnelle).
   */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly raison?: string;
} 