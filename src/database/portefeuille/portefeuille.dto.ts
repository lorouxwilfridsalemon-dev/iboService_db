import {
  IsString,
  IsInt,
  IsOptional,
  IsDateString,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * Opérateurs mobile money disponibles en Côte d'Ivoire.
 */
export enum OperateurMobileMoney {
  ORANGE = 'orange',
  MTN = 'mtn',
  WAVE = 'wave',
  MOOV = 'moov',
}

export class PortefeuilleDto {
  // =========================================================================
  // IDENTIFIANT
  // =========================================================================

  @IsOptional()
  @IsInt()
  readonly id: number;

  // =========================================================================
  // SOLDES
  // =========================================================================

  /**
   * Solde disponible pour retrait.
   */
  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Le solde disponible doit être positif ou nul' })
  readonly soldeDisponible: number;

  /**
   * Solde en attente.
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly soldeEnAttente: number;

  /**
   * Solde bloqué.
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly soldeBloque: number;

  /**
   * Total cumulé gagné.
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly totalGagne: number;

  /**
   * Total cumulé retiré.
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly totalRetire: number;

  /**
   * Devise. Par défaut : XOF.
   */
  @IsOptional()
  @IsString()
  @MaxLength(3)
  readonly devise: string;

  // =========================================================================
  // COORDONNÉES DE RETRAIT
  // =========================================================================

  @IsOptional()
  @IsString()
  @MaxLength(50)
  readonly iban: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  readonly numeroMobileMoney: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  readonly operateurMobileMoney: string;

  /**
   * Seuil minimum de retrait (FCFA).
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly seuilRetraitMin: number;

  // =========================================================================
  // DATES
  // =========================================================================

  @IsOptional()
  @IsDateString()
  readonly dateCreation: string;

  @IsOptional()
  @IsDateString()
  readonly dateDerniereTransaction: string;

  @IsOptional()
  @IsDateString()
  readonly dateDernierRetrait: string;

  // =========================================================================
  // RELATIONS
  // =========================================================================

  /**
   * Identifiant de l'utilisateur propriétaire du portefeuille.
   */
  @IsOptional()
  @IsInt()
  readonly utilisateur_id_usr: number;

  // =========================================================================
  // CHAMPS SYSTÈME
  // =========================================================================

  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly empty1: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly empty2: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly empty3: string;

  @IsOptional()
  @IsInt()
  readonly geler: number;

  @IsOptional()
  @IsInt()
  readonly idusrcreation: number;
}