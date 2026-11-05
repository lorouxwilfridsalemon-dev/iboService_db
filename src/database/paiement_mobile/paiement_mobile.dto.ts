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
 * Opérateurs Mobile Money supportés.
 */
export enum OperateurMobile {
  ORANGE_MONEY = 'orange_money',
  MTN_MOMO = 'mtn_momo',
  WAVE = 'wave',
  MOOV_MONEY = 'moov_money',
}

/**
 * Statuts possibles d'un paiement mobile.
 */
export enum PaiementStatut {
  INITIE = 'initie',
  EN_COURS = 'en_cours',
  SUCCES = 'succes',
  ECHEC = 'echec',
  ANNULE = 'annule',
}

export class PaiementMobileDto {
  // =========================================================================
  // IDENTIFIANT
  // =========================================================================

  @IsOptional()
  @IsInt()
  readonly id: number;

  // =========================================================================
  // OPÉRATEUR
  // =========================================================================

  @IsEnum(OperateurMobile, {
    message: `L'opérateur doit être : ${Object.values(OperateurMobile).join(', ')}`,
  })
  readonly operateur: OperateurMobile;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly transactionIdOperateur: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly referenceOperateur: string;

  // =========================================================================
  // NUMÉROS
  // =========================================================================

  @IsString()
  @MaxLength(20)
  readonly numeroPayeur: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  readonly numeroBeneficiaire: string;

  // =========================================================================
  // MONTANTS
  // =========================================================================

  @IsInt()
  @Min(0)
  readonly montant: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly fraisOperateur: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly montantNet: number;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  readonly devise: string;

  // =========================================================================
  // STATUT
  // =========================================================================

  @IsOptional()
  @IsEnum(PaiementStatut, {
    message: `Le statut doit être : ${Object.values(PaiementStatut).join(', ')}`,
  })
  readonly statut: PaiementStatut;

  // =========================================================================
  // ERREURS
  // =========================================================================

  @IsOptional()
  @IsString()
  @MaxLength(50)
  readonly codeErreur: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly messageErreur: string;

  // =========================================================================
  // CALLBACK
  // =========================================================================

  @IsOptional()
  @IsString()
  readonly callbackData: string;

  // =========================================================================
  // DATES
  // =========================================================================

  @IsOptional()
  @IsDateString()
  readonly dateInitiation: string;

  @IsOptional()
  @IsDateString()
  readonly dateConfirmation: string;

  @IsOptional()
  @IsDateString()
  readonly dateCreation: string;

  // =========================================================================
  // RELATIONS
  // =========================================================================

  @IsInt()
  readonly transaction_id_trs: number;

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