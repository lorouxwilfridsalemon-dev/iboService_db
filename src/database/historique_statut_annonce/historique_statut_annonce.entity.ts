import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { StatutAnnonceEntity } from '../statut_annonce/statut_annonce.entity';
import { AnnonceEntity } from '../annonce/annonce.entity';

/**
 * ✅ Table pivot/historique pour les annonces — même principe que
 * HistoriqueStatutReservationEntity : une nouvelle ligne à chaque
 * changement de statut ("Brouillon" → "Actif" → "Suspendu"...), jamais de
 * mise à jour d'une ligne existante.
 */
@Entity('statut_annonce')
@Index('fx_idusrcreation_sat', ['idusrcreation'])
@Index('fx_geler_idx_sat', ['geler'])
@Index('fx_date_creation_idx_sat', ['dateCreation'])
export class HistoriqueStatutAnnonceEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_sat', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_changement_sat', scale: 0, nullable: false, unique: false }))
  dateChangement: Date;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'commentaire_sat', length: 255, scale: 0, nullable: true, unique: false }))
  commentaire: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_sat', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_sat', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_sat', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_sat', scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_sat', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_sat', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  @ManyToOne(() => StatutAnnonceEntity, statut => statut.historiques, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_san' })
  statutAnnonce: StatutAnnonceEntity;

  @ManyToOne(() => AnnonceEntity, annonce => annonce.historiquesStatut, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_ano' })
  annonce: AnnonceEntity;

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}