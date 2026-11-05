import {
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * DTO pour la création/modification manuelle d'un abonnement par l'admin.
 */
export class AbonnementDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  /**
   * ID de l'utilisateur qui souscrit l'abonnement.
   */
  @IsInt()
  readonly utilisateur_id_usr: number;

  /**
   * ID du plan d'abonnement.
   */
  @IsInt()
  readonly plan_id_pab: number;

  /**
   * Type de facturation (gratuit, mensuel, a_vie).
   */
  @IsOptional()
  @IsString()
  @MaxLength(20)
  readonly typeFacturation: string;

  @IsOptional()
  @IsDateString()
  readonly dateDebut: string;

  @IsOptional()
  @IsDateString()
  readonly dateFin: string;

  @IsOptional()
  @IsDateString()
  readonly dateProchainPaiement: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly montantPaye: number;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  readonly devise: string;

  /**
   * Statut de l'abonnement.
   * Valeurs : 'en_attente', 'actif', 'expire', 'annule', 'suspendu'
   */
  @IsOptional()
  @IsString()
  @MaxLength(50)
  readonly statut: string;

  @IsOptional()
  @IsInt()
  readonly autoRenouvellement: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly annoncesUtilisees: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly boostsUtilises: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly raisonAnnulation: string;
} 