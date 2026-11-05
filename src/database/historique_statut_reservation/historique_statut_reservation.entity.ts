import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { StatutReservationEntity } from '../statut_reservation/statut_reservation.entity';
import { ReservationEntity } from '../reservation/reservation.entity';

/**
 * ✅ C'est LA table pivot demandée : "statut_reservation".
 *
 * ⚠️ IMPORTANT : contrairement à un pivot classique many-to-many (une
 * seule ligne par paire), celle-ci est pensée comme un HISTORIQUE — une
 * NOUVELLE ligne est ajoutée à CHAQUE changement de statut d'une même
 * réservation (jamais de mise à jour d'une ligne existante). Ça permet de
 * reconstituer tout le parcours : "créée le 10 (en_attente), confirmée le
 * 12, annulée le 15" — trois lignes pour UNE seule réservation.
 */
@Entity('statut_reservation')
@Index('fx_idusrcreation_str', ['idusrcreation'])
@Index('fx_geler_idx_str', ['geler'])
@Index('fx_date_creation_idx_str', ['dateCreation'])
export class HistoriqueStatutReservationEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_str', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  // ✅ Date à laquelle CE statut précis a été appliqué (peut différer de
  // date_creation_str si besoin de rejouer un historique importé, mais en
  // pratique les deux seront identiques la plupart du temps).
  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_changement_str', scale: 0, nullable: false, unique: false }))
  dateChangement: Date;

  // ✅ Optionnel : pourquoi ce changement (ex: motif d'annulation saisi
  // par le client ou le propriétaire).
  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'commentaire_str', length: 255, scale: 0, nullable: true, unique: false }))
  commentaire: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_str', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_str', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_str', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_str', scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_str', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_str', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  // --- Les deux clés étrangères du "pivot" ---

  @ManyToOne(() => StatutReservationEntity, statut => statut.historiques, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_ssr' })
  statutReservation: StatutReservationEntity;

  @ManyToOne(() => ReservationEntity, reservation => reservation.historiquesStatut, {
    nullable: false,
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_res' })
  reservation: ReservationEntity;

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}