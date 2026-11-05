import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { AnnonceEntity } from '../annonce/annonce.entity'; // ✅ Import

@Entity('signalement_sig')
@Index('fx_idusrcreation_sig', ['idusrcreation'])
@Index('fx_geler_idx_sig', ['geler'])
@Index('fx_date_creation_idx_sig', ['dateCreation'])
export class SignalementEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_sig', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'type_sig', length: 100, scale: 0, nullable: true, unique: false }))
  type: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'description_sig', length: 100, scale: 0, nullable: true, unique: false }))
  description: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'statut_sig', length: 100, scale: 0, nullable: true, unique: false }))
  statut: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_sig', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_sig', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_sig', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  // ✅ CORRIGÉ : Suppression de length: 100
  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_sig', scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_sig', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_sig', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  // ✅ AJOUTER : Relation ManyToOne vers AnnonceEntity
  @ManyToOne(() => AnnonceEntity, annonce => annonce.signalements, { 
    nullable: true, 
    onDelete: 'RESTRICT', 
    onUpdate: 'CASCADE' 
  })
  @JoinColumn({ name: 'id_ano' }) // Colonne clé étrangère dans signalement_sig
  annonce: AnnonceEntity;

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}