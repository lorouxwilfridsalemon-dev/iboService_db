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
 * Méthodes de retrait disponibles.
 */
export enum MethodeRetrait {
  ORANGE_MONEY = 'orange_money',
  MTN_MOMO = 'mtn_momo',
  WAVE = 'wave',
  MOOV = 'moov',
  VIREMENT = 'virement',
}

/**
 * Statuts possibles d'un retrait.
 */
export enum RetraitStatut {
  DEMANDE = 'demande',
  EN_COURS = 'en_cours',
  PAYE = 'paye',
  REFUSE = 'refuse',
  ECHOUE = 'echoue',
}

export class RetraitDto {
  // =========================================================================
  // IDENTIFIANT
  // =========================================================================

  @IsOptional()
  @IsInt()
  readonly id: number;

  // =========================================================================
  // IDENTIFICATION
  // =========================================================================

  /**
   * Référence unique du retrait.
   * Si non fournie, elle sera générée automatiquement par le service.
   */
  @IsOptional()
  @IsString()
  @MaxLength(50)
  readonly reference: string;

  // =========================================================================
  // MONTANTS
  // =========================================================================

  /**
   * Montant demandé (FCFA).
   */
  @IsInt()
  @Min(0, { message: 'Le montant doit être positif ou nul' })
  readonly montant: number;

  /**
   * Frais de retrait (FCFA).
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly frais: number;

  /**
   * Montant net reçu.
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly montantNet: number;

  /**
   * Devise. Par défaut : XOF.
   */
  @IsOptional()
  @IsString()
  @MaxLength(3)
  readonly devise: string;

  // =========================================================================
  // DESTINATAIRE
  // =========================================================================

  /**
   * Méthode de retrait.
   */
  @IsEnum(MethodeRetrait, {
    message: `La méthode doit être : ${Object.values(MethodeRetrait).join(', ')}`,
  })
  readonly methode: MethodeRetrait;

  /**
   * Numéro de destination (mobile money) ou IBAN.
   */
  @IsString()
  @MaxLength(50)
  readonly numeroDestination: string;

  /**
   * Nom du titulaire du compte destinataire.
   */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly nomDestination: string;

  // =========================================================================
  // STATUT
  // =========================================================================

  @IsOptional()
  @IsEnum(RetraitStatut, {
    message: `Le statut doit être : ${Object.values(RetraitStatut).join(', ')}`,
  })
  readonly statut: RetraitStatut;

  // =========================================================================
  // RÉFÉRENCES DE PAIEMENT
  // =========================================================================

  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly referencePaiement: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly raisonRefus: string;

  // =========================================================================
  // DATES
  // =========================================================================

  @IsOptional()
  @IsDateString()
  readonly dateDemande: string;

  @IsOptional()
  @IsDateString()
  readonly dateTraitement: string;

  @IsOptional()
  @IsDateString()
  readonly datePaiement: string;

  // =========================================================================
  // RELATIONS
  // =========================================================================

  @IsOptional()
  @IsInt()
  readonly utilisateur_id_usr: number;

  @IsOptional()
  @IsInt()
  readonly portefeuille_id_ptf: number;

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