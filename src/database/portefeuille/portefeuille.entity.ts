import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { UtilisateurEntity } from '../utilisateur/utilisateur.entity';
// ✅ Import RetraitEntity décommenté (le fichier existe)
import { RetraitEntity } from '../retrait/retrait.entity';

/**
 * Entité Portefeuille (Wallet).
 *
 * Représente le portefeuille interne d'un utilisateur.
 * Il stocke les soldes disponibles pour retrait, les gains cumulés,
 * et les coordonnées de retrait préférées.
 *
 * Un utilisateur = UN portefeuille (relation 1..1 logique).
 *
 * Table : portefeuille_ptf
 * Convention : préfixe _ptf
 */
@Entity('portefeuille_ptf')
@Index('fx_idusrcreation_idx_ptf', ['idusrcreation'])
@Index('fx_geler_idx_ptf', ['geler'])
@Index('fx_date_creation_idx_ptf', ['dateCreation'])
@Index('fx_utilisateur_idx_ptf', ['utilisateur'], { unique: true })
export class PortefeuilleEntity {
  // =========================================================================
  // IDENTIFIANT
  // =========================================================================

  @PrimaryGeneratedColumn(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'id_ptf',
      length: 11,
      scale: 0,
      primary: true,
      nullable: false,
      unique: true,
    }),
  )
  id: number;

  // =========================================================================
  // SOLDES
  // =========================================================================

  /**
   * Solde disponible pour retrait immédiat.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'solde_disponible_ptf',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  soldeDisponible: number;

  /**
   * Solde en attente (réservations en cours, non encore validées).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'solde_en_attente_ptf',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  soldeEnAttente: number;

  /**
   * Solde bloqué (litiges en cours, vérifications).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'solde_bloque_ptf',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  soldeBloque: number;

  /**
   * Total cumulé gagné depuis la création du compte (historique).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'total_gagne_ptf',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  totalGagne: number;

  /**
   * Total cumulé retiré depuis la création du compte (historique).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'total_retire_ptf',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  totalRetire: number;

  /**
   * Devise du portefeuille (XOF par défaut).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'devise_ptf',
      length: 3,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  devise: string;

  // =========================================================================
  // COORDONNÉES DE RETRAIT
  // =========================================================================

  /**
   * IBAN pour les virements bancaires.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'iban_ptf',
      length: 50,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  iban: string;

  /**
   * Numéro mobile money pour les retraits (Orange, MTN, Wave, Moov).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'numero_mobile_money_ptf',
      length: 20,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  numeroMobileMoney: string;

  /**
   * Opérateur mobile money préféré.
   * Valeurs : 'orange', 'mtn', 'wave', 'moov'
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'operateur_mobile_money_ptf',
      length: 50,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  operateurMobileMoney: string;

  /**
   * Seuil minimum de retrait (en FCFA).
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'seuil_retrait_min_ptf',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  seuilRetraitMin: number;

  // =========================================================================
  // DATES
  // =========================================================================

  /**
   * Date de création du portefeuille.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_creation_ptf',
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  dateCreation: Date;

  /**
   * Date de la dernière transaction.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_derniere_transaction_ptf',
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  dateDerniereTransaction: Date;

  /**
   * Date du dernier retrait.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_dernier_retrait_ptf',
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  dateDernierRetrait: Date;

  // =========================================================================
  // CHAMPS SYSTÈME
  // =========================================================================

  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'empty1_ptf',
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
      name: 'empty2_ptf',
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
      name: 'empty3_ptf',
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
      name: 'geler_ptf',
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
      name: 'idusrcreation_ptf',
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
   * Utilisateur propriétaire du portefeuille.
   * Relation logique 1..1.
   * L'unicité est garantie par l'index unique fx_utilisateur_idx_ptf.
   */
  @ManyToOne(() => UtilisateurEntity, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'utilisateur_id_usr' })
  utilisateur: UtilisateurEntity;

  /**
   * Liste des retraits effectués depuis ce portefeuille.
   * Relation 1..N.
   */
  @OneToMany(() => RetraitEntity, retrait => retrait.portefeuille, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  retraits: RetraitEntity[];

  // =========================================================================
  // CONSTRUCTEUR
  // =========================================================================

  constructor(init?: Partial<PortefeuilleEntity>) {
    Object.assign(this, init);
  }
} 