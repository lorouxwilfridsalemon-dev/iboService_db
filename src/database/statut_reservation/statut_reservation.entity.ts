

import { Column, Entity, Index, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { HistoriqueStatutReservationEntity } from '../historique_statut_reservation/historique_statut_reservation.entity';
// import { HistoriqueStatutReservationEntity } from '../historique_statut_reservation/historique_statut_reservation.entity';

/**
 * ✅ Table de référence (liste fermée) des statuts possibles pour une
 * réservation : "En attente", "Confirmée", "Annulée", "Terminée"...
 *
 * Ne remplace PAS la colonne `statut` (texte) déjà présente sur
 * ReservationEntity — celle-ci reste le moyen rapide de connaître le
 * statut ACTUEL (déjà utilisée partout dans le code existant). Cette
 * table sert uniquement de référence pour l'historique
 * (HistoriqueStatutReservationEntity, table `statut_reservation`).
 */
@Entity('statutreservation_ssr')
@Index('fx_idusrcreation_ssr', ['idusrcreation'])
@Index('fx_geler_idx_ssr', ['geler'])
export class StatutReservationEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_ssr', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'libelle_ssr', length: 100, scale: 0, nullable: false, unique: true }))
  libelle: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'description_ssr', length: 255, scale: 0, nullable: true, unique: false }))
  description: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_ssr', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_ssr', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_ssr', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_ssr', scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_ssr', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_ssr', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  @OneToMany(() => HistoriqueStatutReservationEntity, historique => historique.statutReservation)
  historiques: HistoriqueStatutReservationEntity[];

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}

