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
// ✅ DÉCOMMENTÉ : le fichier plan_abonnement.entity.ts existe
import { PlanAbonnementEntity } from '../plan_abonnement/plan_abonnement.entity';

/**
 * Entité Abonnement.
 *
 * Représente l'ENGAGEMENT d'un utilisateur à un plan payant.
 *
 * Supporte les 3 formules du business model :
 * - Gratuit  : 0 FCFA, jamais d'expiration
 * - Mensuel  : 1 000 FCFA/mois, expiration dans 30 jours
 * - À vie    : 5 000 FCFA une fois, JAMAIS d'expiration
 *
 * Un utilisateur peut avoir PLUSIEURS abonnements dans le temps
 * (historique), mais un SEUL abonnement actif à un instant T.
 *
 * Table : abonnement_abn
 * Convention : préfixe _abn
 */
@Entity('abonnement_abn')
@Index('fx_idusrcreation_idx_abn', ['idusrcreation'])
@Index('fx_geler_idx_abn', ['geler'])
@Index('fx_date_creation_idx_abn', ['dateCreation'])
@Index('fx_reference_idx_abn', ['reference'], { unique: true })
@Index('fx_statut_idx_abn', ['statut'])
@Index('fx_utilisateur_idx_abn', ['utilisateur'])
export class AbonnementEntity {
  // =========================================================================
  // IDENTIFIANT
  // =========================================================================

  @PrimaryGeneratedColumn(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'id_abn',
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
   * Référence unique de l'abonnement.
   * Format : ABN-2025-000123
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'reference_abn',
      length: 50,
      scale: 0,
      nullable: false,
      unique: true,
    }),
  )
  reference: string;

  // =========================================================================
  // PÉRIODE
  // =========================================================================

  /**
   * Type de facturation.
   * Valeurs :
   * - 'gratuit'  : Plan gratuit (sans paiement)
   * - 'mensuel'  : Paiement mensuel
   * - 'a_vie'    : Paiement unique, à vie
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'type_facturation_abn',
      length: 20,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  typeFacturation: string;

  /**
   * Date de début de l'abonnement.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_debut_abn',
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  dateDebut: Date;

  /**
   * Date de fin de l'abonnement.
   * ⚠️ null pour un abonnement "à vie".
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_fin_abn',
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  dateFin: Date;

  /**
   * Date du prochain paiement (si auto-renouvellement activé).
   * null pour les abonnements "à vie" et "gratuit".
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_prochain_paiement_abn',
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  dateProchainPaiement: Date;

  // =========================================================================
  // MONTANTS
  // =========================================================================

  /**
   * Montant payé pour cette période d'abonnement (FCFA).
   * 0 pour le plan gratuit.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'montant_paye_abn',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  montantPaye: number;

  /**
   * Devise (XOF par défaut).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'devise_abn',
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
   * Statut de l'abonnement.
   * Valeurs : 'en_attente', 'actif', 'expire', 'annule', 'suspendu'
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'statut_abn',
      length: 50,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  statut: string;

  /**
   * Auto-renouvellement activé ?
   * 0 = non, 1 = oui
   * Toujours 0 pour les abonnements "à vie".
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'auto_renouvellement_abn',
      length: 1,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  autoRenouvellement: number;

  /**
   * Date d'annulation (si statut = 'annule').
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_annulation_abn',
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  dateAnnulation: Date;

  /**
   * Raison de l'annulation.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'raison_annulation_abn',
      length: 500,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  raisonAnnulation: string;

  // =========================================================================
  // COMPTEURS D'USAGE
  // =========================================================================

  /**
   * Nombre d'annonces publiées pendant cet abonnement.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'annonces_utilisees_abn',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  annoncesUtilisees: number;

  /**
   * Nombre de boosts utilisés pendant cet abonnement.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'boosts_utilises_abn',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  boostsUtilises: number;

  // =========================================================================
  // DATES SYSTÈME
  // =========================================================================

  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_creation_abn',
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  dateCreation: Date;

  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_modification_abn',
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  dateModification: Date;

  // =========================================================================
  // CHAMPS SYSTÈME
  // =========================================================================

  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'empty1_abn',
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
      name: 'empty2_abn',
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
      name: 'empty3_abn',
      length: 100,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  empty3: string;

  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'geler_abn',
      length: 1,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  geler: number;

  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'idusrcreation_abn',
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
   * Utilisateur qui a souscrit l'abonnement.
   */
  @ManyToOne(() => UtilisateurEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'utilisateur_id_usr' })
  utilisateur: UtilisateurEntity;

  /**
   * Plan souscrit.
   * ✅ Import PlanAbonnementEntity décommenté en haut.
   */
  @ManyToOne(() => PlanAbonnementEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'plan_id_pab' })
  plan: PlanAbonnementEntity;

  // =========================================================================
  // CONSTRUCTEUR
  // =========================================================================

  constructor(init?: Partial<AbonnementEntity>) {
    Object.assign(this, init);
  }
} 