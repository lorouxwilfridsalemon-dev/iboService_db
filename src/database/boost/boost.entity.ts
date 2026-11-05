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
import { AnnonceEntity } from '../annonce/annonce.entity';

/**
 * Entité Boost.
 *
 * Représente l'achat d'une mise en avant d'une annonce.
 * Un utilisateur peut acheter PLUSIEURS boosts.
 *
 * Deux types de boost (selon votre doc) :
 * - 'top_liste'  : Annonce en tête (500 FCFA/mois ou 1500 FCFA/6 mois)
 * - 'en_avant'   : Annonce en tête + badge (même prix)
 *
 * Table : boost_bst
 * Convention : préfixe _bst
 */
@Entity('boost_bst')
@Index('fx_reference_idx_bst', ['reference'], { unique: true })
@Index('fx_idusrcreation_idx_bst', ['idusrcreation'])
@Index('fx_geler_idx_bst', ['geler'])
@Index('fx_date_creation_idx_bst', ['dateCreation'])
@Index('fx_statut_idx_bst', ['statut'])
@Index('fx_annonce_idx_bst', ['annonce'])
@Index('fx_utilisateur_idx_bst', ['utilisateur'])
export class BoostEntity {
  // =========================================================================
  // IDENTIFIANT
  // =========================================================================

  @PrimaryGeneratedColumn(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'id_bst',
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
   * Référence unique du boost.
   * Format : BST-2025-000123
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'reference_bst',
      length: 50,
      scale: 0,
      nullable: false,
      unique: true,
    }),
  )
  reference: string;

  /**
   * Type de boost.
   * Valeurs possibles :
   * - 'top_liste'  : Annonce en tête de liste
   * - 'en_avant'   : Annonce en tête + badge "En avant"
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'type_boost_bst',
      length: 50,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  typeBoost: string;

  // =========================================================================
  // DURÉE
  // =========================================================================

  /**
   * Durée du boost en heures.
   * - 720 heures = 30 jours (1 mois)
   * - 4320 heures = 180 jours (6 mois)
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'duree_heures_bst',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  dureeHeures: number;

  /**
   * Date de début du boost.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_debut_bst',
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  dateDebut: Date;

  /**
   * Date de fin du boost.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_fin_bst',
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  dateFin: Date;

  // =========================================================================
  // MONTANTS
  // =========================================================================

  /**
   * Montant payé (en FCFA).
   * - 500 FCFA pour 1 mois
   * - 1500 FCFA pour 6 mois
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'montant_paye_bst',
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
      name: 'devise_bst',
      length: 3,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  devise: string;

  /**
   * Le boost est-il offert (via abonnement) ?
   * 0 = payant, 1 = offert
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'gratuit_bst',
      length: 1,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  gratuit: number;

  // =========================================================================
  // STATISTIQUES
  // =========================================================================

  /**
   * Nombre de vues de l'annonce pendant le boost.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'nb_vues_bst',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  nbVues: number;

  /**
   * Nombre de clics sur l'annonce pendant le boost.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'nb_clics_bst',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  nbClics: number;

  /**
   * Nombre de contacts initiés pendant le boost.
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'nb_contacts_bst',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  nbContacts: number;

  // =========================================================================
  // STATUT
  // =========================================================================

  /**
   * Statut du boost.
   * Valeurs :
   * - 'en_attente' : En attente de paiement
   * - 'actif'      : En cours
   * - 'expire'     : Terminé
   * - 'annule'     : Annulé
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'statut_bst',
      length: 50,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  statut: string;

  // =========================================================================
  // SYSTÈME
  // =========================================================================

  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_creation_bst',
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  dateCreation: Date;

  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'geler_bst',
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
      name: 'idusrcreation_bst',
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
   * Annonce boostée.
   */
  @ManyToOne(() => AnnonceEntity, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'annonce_id_ano' })
  annonce: AnnonceEntity;

  /**
   * Utilisateur qui a acheté le boost.
   */
  @ManyToOne(() => UtilisateurEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'utilisateur_id_usr' })
  utilisateur: UtilisateurEntity;

  // =========================================================================
  // CONSTRUCTEUR
  // =========================================================================

  constructor(init?: Partial<BoostEntity>) {
    Object.assign(this, init);
  }
} 