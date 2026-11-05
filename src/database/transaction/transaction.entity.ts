import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { UtilisateurEntity } from '../utilisateur/utilisateur.entity';
import { ReservationEntity } from '../reservation/reservation.entity';

/**
 * Entité Transaction.
 *
 * Représente TOUT mouvement financier dans l'application :
 * - Paiement d'une réservation
 * - Commission prélevée par la plateforme
 * - Remboursement d'un client
 * - Retrait du wallet d'un utilisateur
 * - Dépôt dans le wallet
 * - Achat d'un boost d'annonce
 * - Frais de vérification KYC
 * - Paiement d'un abonnement
 *
 * Table : transaction_trs
 * Convention : préfixe _trs (cohérent avec _ano, _usr, _res, etc.)
 */
@Entity('transaction_trs')
@Index('fx_idusrcreation_idx_trs', ['idusrcreation'])
@Index('fx_geler_idx_trs', ['geler'])
@Index('fx_date_creation_idx_trs', ['dateCreation'])
@Index('fx_reference_idx_trs', ['reference'], { unique: true })
@Index('fx_statut_idx_trs', ['statut'])
@Index('fx_type_idx_trs', ['type'])
export class TransactionEntity {
  // =========================================================================
  // IDENTIFIANT
  // =========================================================================

  @PrimaryGeneratedColumn(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'id_trs',
      length: 11,
      scale: 0,
      primary: true,
      nullable: false,
      unique: true,
    }),
  )
  id: number;

  // =========================================================================
  // IDENTIFICATION
  // =========================================================================

  /**
   * Référence unique et lisible par l'utilisateur.
   * Format : TRX-2025-000123
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'reference_trs',
      length: 50,
      scale: 0,
      nullable: false,
      unique: true,
    }),
  )
  reference: string;

  /**
   * Type de mouvement financier.
   * Valeurs possibles :
   * - 'paiement'       : Paiement d'une réservation
   * - 'commission'     : Commission prélevée par la plateforme
   * - 'remboursement'  : Remboursement d'un client
   * - 'retrait'        : Retrait du wallet
   * - 'depot'          : Dépôt dans le wallet
   * - 'boost'          : Achat d'un boost d'annonce
   * - 'verification'   : Frais de vérification KYC
   * - 'abonnement'     : Paiement d'un abonnement
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'type_trs',
      length: 50,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  type: string;

  // =========================================================================
  // MONTANTS
  // =========================================================================

  /**
   * Montant total de la transaction, AVANT commission.
   * Exprimé en unité monétaire (XOF = entier).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'montant_trs',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  montant: number;

  /**
   * Devise de la transaction (XOF par défaut).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'devise_trs',
      length: 3,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  devise: string;

  /**
   * Montant de la commission prélevée par la plateforme.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'montant_commission_trs',
      length: 11,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  montantCommission: number;

  /**
   * Pourcentage de commission appliqué (ex : 7.00 pour 7%).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'decimal',
      name: 'pourcentage_commission_trs',
      precision: 5,
      scale: 2,
      nullable: true,
      unique: false,
    }),
  )
  pourcentageCommission: number;

  /**
   * Montant net perçu par le bénéficiaire.
   * Formule : montant - montantCommission
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'montant_net_trs',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  montantNet: number;

  // =========================================================================
  // STATUT
  // =========================================================================

  /**
   * Statut de la transaction.
   * Valeurs possibles :
   * - 'en_attente' : Créée, en attente de confirmation
   * - 'en_cours'   : En cours de traitement
   * - 'succes'     : Confirmée avec succès
   * - 'echec'      : Échouée
   * - 'annule'     : Annulée
   * - 'rembourse'  : Remboursée
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'statut_trs',
      length: 50,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  statut: string;

  // =========================================================================
  // MÉTHODE DE PAIEMENT
  // =========================================================================

  /**
   * Méthode de paiement utilisée.
   * Valeurs possibles :
   * - 'orange_money' : Orange Money CI
   * - 'mtn_momo'     : MTN Mobile Money CI
   * - 'wave'         : Wave
   * - 'moov'         : Moov Money
   * - 'carte'        : Carte bancaire (Visa, Mastercard)
   * - 'especes'      : Espèces
   * - 'wallet'       : Portefeuille interne
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'methode_paiement_trs',
      length: 50,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  methodePaiement: string;

  /**
   * Référence externe fournie par l'opérateur (Orange, MTN, etc.).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'reference_externe_trs',
      length: 100,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  referenceExterne: string;

  /**
   * Référence opérateur (peut différer de la référence externe).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'reference_operateur_trs',
      length: 100,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  referenceOperateur: string;

  // =========================================================================
  // DÉTAILS
  // =========================================================================

  /**
   * Description libre de la transaction.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'description_trs',
      length: 255,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  description: string;

  /**
   * Métadonnées additionnelles au format JSON.
   * Exemple : { "operateur": "orange", "frais": 100 }
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'text',
      name: 'metadata_trs',
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  metadata: string;

  /**
   * Message d'erreur si la transaction a échoué.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'erreur_trs',
      length: 500,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  erreur: string;

  // =========================================================================
  // DATES
  // =========================================================================

  /**
   * Date de création de la transaction.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_creation_trs',
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  dateCreation: Date;

  /**
   * Date de validation (passage au statut 'succes').
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_validation_trs',
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  dateValidation: Date;

  /**
   * Date de remboursement (si applicable).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_remboursement_trs',
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  dateRemboursement: Date;

  // =========================================================================
  // CHAMPS SYSTÈME
  // =========================================================================

  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'empty1_trs',
      length: 100,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  empty1: string;

  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'empty2_trs',
      length: 100,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  empty2: string;

  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'empty3_trs',
      length: 100,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  empty3: string;

  /**
   * Indicateur de suppression logique (soft delete).
   * 0 = actif, 1 = gelé/supprimé
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'geler_trs',
      length: 1,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  geler: number;

  /**
   * Identifiant de l'utilisateur créateur.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'idusrcreation_trs',
      length: 11,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  idusrcreation: number;

  // =========================================================================
  // RELATIONS
  // =========================================================================

  /**
   * Utilisateur qui effectue le paiement (le payeur).
   */
  @ManyToOne(() => UtilisateurEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'utilisateur_id_usr' })
  utilisateur: UtilisateurEntity;

  /**
   * Utilisateur qui reçoit l'argent.
   * Peut être null dans le cas d'une commission pour la plateforme.
   */
  @ManyToOne(() => UtilisateurEntity, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'beneficiaire_id_usr' })
  beneficiaire: UtilisateurEntity;

  /**
   * Réservation associée à la transaction.
   * Peut être null pour un boost, un abonnement ou une vérification KYC.
   */
  @ManyToOne(() => ReservationEntity, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'reservation_id_res' })
  reservation: ReservationEntity;

  // =========================================================================
  // CONSTRUCTEUR
  // =========================================================================

  constructor(init?: Partial<TransactionEntity>) {
    Object.assign(this, init);
  }
}