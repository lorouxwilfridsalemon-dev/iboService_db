import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { TransactionEntity } from '../transaction/transaction.entity';

/**
 * Entité Paiement Mobile.
 *
 * Représente un paiement effectué via un opérateur Mobile Money
 * (Orange Money, MTN MoMo, Wave, Moov Money).
 *
 * Chaque paiement est lié à UNE transaction (transaction_trs).
 * C'est la trace technique du passage chez l'opérateur.
 *
 * Un paiement = une tentative unique.
 *
 * Table : paiement_mobile_pmb
 * Convention : préfixe _pmb
 */
@Entity('paiement_mobile_pmb')
@Index('fx_idusrcreation_idx_pmb', ['idusrcreation'])
@Index('fx_geler_idx_pmb', ['geler'])
@Index('fx_date_creation_idx_pmb', ['dateCreation'])
@Index('fx_statut_idx_pmb', ['statut'])
@Index('fx_operateur_idx_pmb', ['operateur'])
@Index('fx_transaction_idx_pmb', ['transaction'])
export class PaiementMobileEntity {
  // =========================================================================
  // IDENTIFIANT
  // =========================================================================

  @PrimaryGeneratedColumn(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'id_pmb',
      length: 11,
      scale: 0,
      primary: true,
      nullable: false,
      unique: true,
    }),
  )
  id: number;

  // =========================================================================
  // OPÉRATEUR
  // =========================================================================

  /**
   * Opérateur Mobile Money utilisé.
   * Valeurs : 'orange_money', 'mtn_momo', 'wave', 'moov_money'
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'operateur_pmb',
      length: 50,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  operateur: string;

  /**
   * Identifiant de la transaction chez l'opérateur.
   * Ex : 'OM-2025-ABC123'
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'transaction_id_operateur_pmb',
      length: 100,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  transactionIdOperateur: string;

  /**
   * Référence donnée par l'opérateur.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'reference_operateur_pmb',
      length: 100,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  referenceOperateur: string;

  // =========================================================================
  // NUMÉROS
  // =========================================================================

  /**
   * Numéro Mobile Money du payeur.
   * Ex : '07 89 45 12 33'
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'numero_payeur_pmb',
      length: 20,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  numeroPayeur: string;

  /**
   * Numéro Mobile Money du bénéficiaire (peut être null).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'numero_beneficiaire_pmb',
      length: 20,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  numeroBeneficiaire: string;

  // =========================================================================
  // MONTANTS
  // =========================================================================

  /**
   * Montant payé par l'utilisateur (FCFA).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'montant_pmb',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  montant: number;

  /**
   * Frais prélevés par l'opérateur (FCFA).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'frais_operateur_pmb',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  fraisOperateur: number;

  /**
   * Montant net reçu par la plateforme.
   * Formule : montant - fraisOperateur
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'montant_net_pmb',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  montantNet: number;

  /**
   * Devise (XOF par défaut).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'devise_pmb',
      length: 3,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  devise: string;

  // =========================================================================
  // STATUT
  // =========================================================================

  /**
   * Statut du paiement.
   * Valeurs possibles :
   * - 'initie'   : Paiement initié par l'utilisateur
   * - 'en_cours' : En attente de confirmation opérateur
   * - 'succes'   : Payé avec succès
   * - 'echec'    : Échec
   * - 'annule'   : Annulé
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'statut_pmb',
      length: 50,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  statut: string;

  // =========================================================================
  // ERREURS
  // =========================================================================

  /**
   * Code d'erreur retourné par l'opérateur (si échec).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'code_erreur_pmb',
      length: 50,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  codeErreur: string;

  /**
   * Message d'erreur lisible (si échec).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'message_erreur_pmb',
      length: 500,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  messageErreur: string;

  // =========================================================================
  // CALLBACK
  // =========================================================================

  /**
   * Données du callback de l'opérateur (JSON complet).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'text',
      name: 'callback_data_pmb',
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  callbackData: string;

  // =========================================================================
  // DATES
  // =========================================================================

  /**
   * Date d'initiation du paiement.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_initiation_pmb',
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  dateInitiation: Date;

  /**
   * Date de confirmation (statut final).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_confirmation_pmb',
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  dateConfirmation: Date;

  /**
   * Date de création de l'enregistrement.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_creation_pmb',
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  dateCreation: Date;

  // =========================================================================
  // CHAMPS SYSTÈME
  // =========================================================================

  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'empty1_pmb',
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
      name: 'empty2_pmb',
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
      name: 'empty3_pmb',
      length: 100,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  empty3: string;

  /**
   * Indicateur de suppression logique (soft delete).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'geler_pmb',
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
      name: 'idusrcreation_pmb',
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
   * Transaction associée à ce paiement mobile.
   * Relation 1..1 : un paiement mobile = une transaction.
   */
  @ManyToOne(() => TransactionEntity, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'transaction_id_trs' })
  transaction: TransactionEntity;

  // =========================================================================
  // CONSTRUCTEUR
  // =========================================================================

  constructor(init?: Partial<PaiementMobileEntity>) {
    Object.assign(this, init);
  }
} 