

import { Column, Entity, Index, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { HistoriqueStatutAnnonceEntity } from '../historique_statut_annonce/historique_statut_annonce.entity';
// import { HistoriqueStatutAnnonceEntity } from '../historique_statut_annonce/historique_statut_annonce.entity';

/**
 * ✅ Table de référence (liste fermée) des statuts possibles pour une
 * annonce : "Brouillon", "Actif", "Suspendu", "Expiré", "Supprimé"...
 *
 * Ne remplace PAS la colonne `statut` (texte) déjà présente sur
 * AnnonceEntity — même logique que pour les réservations : la colonne
 * texte reste la lecture rapide du statut ACTUEL, cette table sert de
 * référence pour l'historique (HistoriqueStatutAnnonceEntity, table
 * `statut_annonce`).
 */
@Entity('statutannonce_san')
@Index('fx_idusrcreation_san', ['idusrcreation'])
@Index('fx_geler_idx_san', ['geler'])
export class StatutAnnonceEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_san', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'libelle_san', length: 100, scale: 0, nullable: false, unique: true }))
  libelle: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'description_san', length: 255, scale: 0, nullable: true, unique: false }))
  description: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_san', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_san', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_san', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_san', scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_san', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_san', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  @OneToMany(() => HistoriqueStatutAnnonceEntity, historique => historique.statutAnnonce)
  historiques: HistoriqueStatutAnnonceEntity[];

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
} 

