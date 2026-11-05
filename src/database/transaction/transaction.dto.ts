import {
  IsString,
  IsInt,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * Types de transaction possibles.
 * Représente la nature du mouvement financier.
 */
export enum TransactionType {
  /** Paiement d'une réservation */
  PAIEMENT = 'paiement',

  /** Commission prélevée par la plateforme */
  COMMISSION = 'commission',

  /** Remboursement d'un client */
  REMBOURSEMENT = 'remboursement',

  /** Retrait du wallet vers un compte externe */
  RETRAIT = 'retrait',

  /** Dépôt dans le wallet */
  DEPOT = 'depot',

  /** Achat d'un boost d'annonce */
  BOOST = 'boost',

  /** Frais de vérification KYC */
  VERIFICATION = 'verification',

  /** Paiement d'un abonnement */
  ABONNEMENT = 'abonnement',
}

/**
 * Statuts possibles d'une transaction.
 */
export enum TransactionStatut {
  /** Créée mais pas encore confirmée */
  EN_ATTENTE = 'en_attente',

  /** En cours de traitement (attente opérateur) */
  EN_COURS = 'en_cours',

  /** Confirmée avec succès */
  SUCCES = 'succes',

  /** Échouée */
  ECHEC = 'echec',

  /** Annulée */
  ANNULE = 'annule',

  /** Remboursée */
  REMBOURSE = 'rembourse',
}

/**
 * Méthodes de paiement disponibles en Côte d'Ivoire.
 */
export enum MethodePaiement {
  /** Orange Money CI */
  ORANGE_MONEY = 'orange_money',

  /** MTN Mobile Money CI */
  MTN_MOMO = 'mtn_momo',

  /** Wave */
  WAVE = 'wave',

  /** Moov Money */
  MOOV = 'moov',

  /** Carte bancaire (Visa, Mastercard) */
  CARTE = 'carte',

  /** Espèces */
  ESPECES = 'especes',

  /** Portefeuille interne IBO Service */
  WALLET = 'wallet',
}

export class TransactionDto {
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
   * Référence unique de la transaction.
   * Si non fournie, elle sera générée automatiquement par le service.
   */
  @IsOptional()
  @IsString()
  @MaxLength(50)
  readonly reference: string;

  /**
   * Type de mouvement financier.
   */
  @IsEnum(TransactionType, {
    message: `Le type doit être l'une des valeurs : ${Object.values(TransactionType).join(', ')}`,
  })
  readonly type: TransactionType;

  // =========================================================================
  // MONTANTS
  // =========================================================================

  /**
   * Montant total de la transaction (avant commission).
   * En FCFA (XOF), entier positif.
   */
  @IsInt()
  @Min(0, { message: 'Le montant doit être positif ou nul' })
  readonly montant: number;

  /**
   * Devise. Par défaut : XOF.
   */
  @IsOptional()
  @IsString()
  @MaxLength(3)
  readonly devise: string;

  /**
   * Montant de la commission prélevée par la plateforme.
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly montantCommission: number;

  /**
   * Pourcentage de commission appliqué (ex : 7.00).
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly pourcentageCommission: number;

  /**
   * Montant net reçu par le bénéficiaire.
   * Si non fourni, calculé par le service : montant - montantCommission
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly montantNet: number;

  // =========================================================================
  // STATUT
  // =========================================================================

  /**
   * Statut de la transaction.
   * Si non fourni, 'en_attente' par défaut.
   */
  @IsOptional()
  @IsEnum(TransactionStatut, {
    message: `Le statut doit être l'une des valeurs : ${Object.values(TransactionStatut).join(', ')}`,
  })
  readonly statut: TransactionStatut;

  // =========================================================================
  // MÉTHODE DE PAIEMENT
  // =========================================================================

  /**
   * Méthode de paiement utilisée.
   */
  @IsOptional()
  @IsEnum(MethodePaiement, {
    message: `La méthode doit être l'une des valeurs : ${Object.values(MethodePaiement).join(', ')}`,
  })
  readonly methodePaiement: MethodePaiement;

  /**
   * Référence externe fournie par l'opérateur.
   */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly referenceExterne: string;

  /**
   * Référence opérateur.
   */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly referenceOperateur: string;

  // =========================================================================
  // DÉTAILS
  // =========================================================================

  /**
   * Description libre de la transaction.
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly description: string;

  /**
   * Métadonnées additionnelles au format JSON (stringifié).
   */
  @IsOptional()
  @IsString()
  readonly metadata: string;

  /**
   * Message d'erreur si la transaction a échoué.
   */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly erreur: string;

  // =========================================================================
  // DATES
  // =========================================================================

  @IsOptional()
  @IsDateString()
  readonly dateCreation: string;

  @IsOptional()
  @IsDateString()
  readonly dateValidation: string;

  @IsOptional()
  @IsDateString()
  readonly dateRemboursement: string;

  // =========================================================================
  // RELATIONS (IDs uniquement)
  // =========================================================================

  /**
   * Identifiant de l'utilisateur qui effectue le paiement.
   */
  @IsOptional()
  @IsInt()
  readonly utilisateur_id_usr: number;

  /**
   * Identifiant de l'utilisateur qui reçoit l'argent.
   */
  @IsOptional()
  @IsInt()
  readonly beneficiaire_id_usr: number;

  /**
   * Identifiant de la réservation associée.
   */
  @IsOptional()
  @IsInt()
  readonly reservation_id_res: number;

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