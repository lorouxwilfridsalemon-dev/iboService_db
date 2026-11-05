import {
  IsString,
  IsInt,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * Types de facturation d'un abonnement.
 */
export enum TypeFacturation {
  GRATUIT = 'gratuit',
  MENSUEL = 'mensuel',
  A_VIE = 'a_vie',
}

/**
 * Statuts possibles d'un abonnement.
 */
export enum AbonnementStatut {
  EN_ATTENTE = 'en_attente',
  ACTIF = 'actif',
  EXPIRE = 'expire',
  ANNULE = 'annule',
  SUSPENDU = 'suspendu',
}

export class AbonnementDto {
  // =========================================================================
  // IDENTIFIANT
  // =========================================================================

  @IsOptional()
  @IsInt()
  readonly id: number;

  // =========================================================================
  // IDENTIFICATION
  // =========================================================================

  @IsOptional()
  @IsString()
  @MaxLength(50)
  readonly reference: string;

  // =========================================================================
  // PÉRIODE
  // =========================================================================

  @IsEnum(TypeFacturation, {
    message: `Le type de facturation doit être : ${Object.values(TypeFacturation).join(', ')}`,
  })
  readonly typeFacturation: TypeFacturation;

  @IsDateString()
  readonly dateDebut: string;

  /**
   * Date de fin — null pour un abonnement "à vie".
   */
  @IsOptional()
  @IsDateString()
  readonly dateFin: string;

  @IsOptional()
  @IsDateString()
  readonly dateProchainPaiement: string;

  // =========================================================================
  // MONTANTS
  // =========================================================================

  @IsInt()
  @Min(0)
  readonly montantPaye: number;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  readonly devise: string;

  // =========================================================================
  // STATUT
  // =========================================================================

  @IsOptional()
  @IsEnum(AbonnementStatut, {
    message: `Le statut doit être : ${Object.values(AbonnementStatut).join(', ')}`,
  })
  readonly statut: AbonnementStatut;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly autoRenouvellement: number;

  @IsOptional()
  @IsDateString()
  readonly dateAnnulation: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly raisonAnnulation: string;

  // =========================================================================
  // COMPTEURS D'USAGE
  // =========================================================================

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly annoncesUtilisees: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly boostsUtilises: number;

  // =========================================================================
  // DATES SYSTÈME
  // =========================================================================

  @IsOptional()
  @IsDateString()
  readonly dateCreation: string;

  @IsOptional()
  @IsDateString()
  readonly dateModification: string;

  // =========================================================================
  // RELATIONS
  // =========================================================================

  @IsInt()
  readonly utilisateur_id_usr: number;

  @IsInt()
  readonly plan_id_pab: number;

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