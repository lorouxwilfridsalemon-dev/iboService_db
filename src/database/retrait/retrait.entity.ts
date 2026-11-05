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
import { PortefeuilleEntity } from '../portefeuille/portefeuille.entity';

/**
 * Entité Retrait.
 *
 * Représente une DEMANDE DE RETRAIT d'un utilisateur.
 * Chaque retrait est un mouvement de sortie d'argent du portefeuille
 * vers un compte externe (Orange Money, MTN, Wave, virement bancaire...).
 *
 * Un utilisateur peut avoir PLUSIEURS retraits (historique).
 *
 * Table : retrait_rtr
 * Convention : préfixe _rtr
 */
@Entity('retrait_rtr')
@Index('fx_idusrcreation_idx_rtr', ['idusrcreation'])
@Index('fx_geler_idx_rtr', ['geler'])
@Index('fx_date_demande_idx_rtr', ['dateDemande'])
@Index('fx_reference_idx_rtr', ['reference'], { unique: true })
@Index('fx_statut_idx_rtr', ['statut'])
export class RetraitEntity {
  // =========================================================================
  // IDENTIFIANT
  // =========================================================================

  @PrimaryGeneratedColumn(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'id_rtr',
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
   * Référence unique du retrait.
   * Format : RTR-2025-000123
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'reference_rtr',
      length: 50,
      scale: 0,
      nullable: false,
      unique: true,
    }),
  )
  reference: string;

  // =========================================================================
  // MONTANTS
  // =========================================================================

  /**
   * Montant demandé par l'utilisateur (en FCFA).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'montant_rtr',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  montant: number;

  /**
   * Frais de retrait prélevés (en FCFA).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'frais_rtr',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  frais: number;

  /**
   * Montant net reçu par l'utilisateur.
   * Formule : montant - frais
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'montant_net_rtr',
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
      name: 'devise_rtr',
      length: 3,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  devise: string;

  // =========================================================================
  // DESTINATAIRE
  // =========================================================================

  /**
   * Méthode de retrait choisie.
   * Valeurs : 'orange_money', 'mtn_momo', 'wave', 'moov', 'virement'
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'methode_rtr',
      length: 50,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  methode: string;

  /**
   * Numéro de destination (mobile money) ou IBAN (virement).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'numero_destination_rtr',
      length: 50,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  numeroDestination: string;

  /**
   * Nom du titulaire du compte destinataire.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'nom_destination_rtr',
      length: 100,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  nomDestination: string;

  // =========================================================================
  // STATUT
  // =========================================================================

  /**
   * Statut du retrait.
   * Valeurs : 'demande', 'en_cours', 'paye', 'refuse', 'echoue'
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'statut_rtr',
      length: 50,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  statut: string;

  // =========================================================================
  // RÉFÉRENCES DE PAIEMENT
  // =========================================================================

  /**
   * Référence de paiement externe (fournie par l'opérateur).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'reference_paiement_rtr',
      length: 100,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  referencePaiement: string;

  /**
   * Raison du refus (si le statut est 'refuse').
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'raison_refus_rtr',
      length: 500,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  raisonRefus: string;

  // =========================================================================
  // DATES
  // =========================================================================

  /**
   * Date de la demande de retrait.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_demande_rtr',
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  dateDemande: Date;

  /**
   * Date de traitement (passage au statut 'en_cours').
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_traitement_rtr',
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  dateTraitement: Date;

  /**
   * Date de paiement effectif (statut 'paye').
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_paiement_rtr',
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  datePaiement: Date;

  // =========================================================================
  // CHAMPS SYSTÈME
  // =========================================================================

  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'empty1_rtr',
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
      name: 'empty2_rtr',
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
      name: 'empty3_rtr',
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
      name: 'geler_rtr',
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
      name: 'idusrcreation_rtr',
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
   * Utilisateur qui demande le retrait.
   */
  @ManyToOne(() => UtilisateurEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'utilisateur_id_usr' })
  utilisateur: UtilisateurEntity;

  /**
   * Portefeuille depuis lequel le retrait est effectué.
   * Relation N..1 (plusieurs retraits pour un même portefeuille).
   */
  @ManyToOne(() => PortefeuilleEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'portefeuille_id_ptf' })
  portefeuille: PortefeuilleEntity;

  // =========================================================================
  // CONSTRUCTEUR
  // =========================================================================

  constructor(init?: Partial<RetraitEntity>) {
    Object.assign(this, init);
  }
} 