import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';

/**
 * Entité Plan d'Abonnement.
 *
 * Décrit les 3 formules disponibles dans IBO Service CI :
 * - Gratuit  : 0 FCFA, 1 annonce, pas de vidéo
 * - Mensuel  : 1 000 FCFA/mois, annonces illimitées + vidéo
 * - À vie    : 5 000 FCFA une fois, mêmes avantages que mensuel
 *
 * Table : plan_abonnement_pab
 * Convention : préfixe _pab
 */
@Entity('plan_abonnement_pab')
@Index('fx_code_idx_pab', ['code'], { unique: true })
@Index('fx_actif_idx_pab', ['actif'])
@Index('fx_ordre_idx_pab', ['ordre'])
export class PlanAbonnementEntity {   // ✅ CORRIGÉ : le nom de la classe
  // =========================================================================
  // IDENTIFIANT
  // =========================================================================

  @PrimaryGeneratedColumn(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'id_pab',
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
   * Code technique du plan (utilisé dans le code).
   * Valeurs : 'gratuit', 'mensuel', 'a_vie'
   */
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'code_pab',
      length: 50,
      scale: 0,
      nullable: false,
      unique: true,
    }),
  )
  code: string;

  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'nom_pab',
      length: 100,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  nom: string;

  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'description_pab',
      length: 255,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  description: string;

  // =========================================================================
  // PRIX
  // =========================================================================

  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'prix_pab',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  prix: number;

  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'devise_pab',
      length: 10,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  devise: string;

  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'type_facturation_pab',
      length: 20,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  typeFacturation: string;

  // =========================================================================
  // AVANTAGES
  // =========================================================================

  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'nb_annonces_max_pab',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  nbAnnoncesMax: number;

  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'video_autorisee_pab',
      length: 1,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  videoAutorisee: number;

  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'badge_actif_pab',
      length: 1,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  badgeActif: number;

  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'nb_photos_max_pab',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  nbPhotosMax: number;

  // =========================================================================
  // AFFICHAGE
  // =========================================================================

  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'ordre_pab',
      length: 11,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  ordre: number;

  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'populaire_pab',
      length: 1,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  populaire: number;

  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'couleur_pab',
      length: 20,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  couleur: string;

  // =========================================================================
  // SYSTÈME
  // =========================================================================

  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'actif_pab',
      length: 1,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  actif: number;

  // @Column(
  //   DefaultEntity.convertDataType({
  //     type: 'timestamp',
  //     name: 'date_creation_pab',
  //     scale: 0,
  //     nullable: false,
  //     unique: false,
  //   }),
  // )
  // dateCreation: Date;

  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_creation_pab',
      scale: 0,
      nullable: false,
      unique: false,
      default: () => 'CURRENT_TIMESTAMP',  
    }),
  )
  dateCreation: Date;

  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'geler_pab',
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
      name: 'idusrcreation_pab',
      length: 11,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  idusrcreation: number;

  // =========================================================================
  // CONSTRUCTEUR
  // =========================================================================

  constructor(init?: Partial<PlanAbonnementEntity>) {   // ✅ CORRIGÉ
    Object.assign(this, init);
  }
} 