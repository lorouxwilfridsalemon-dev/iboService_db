import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { AnnonceEntity } from '../annonce/annonce.entity'; // ✅ Import

@Entity('avis_avi')
@Index('fx_idusrcreation_avi', ['idusrcreation'])
@Index('fx_geler_idx_avi', ['geler'])
@Index('fx_date_creation_idx_avi', ['dateCreation'])
export class AvisEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_avi', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  // ✅ CORRIGÉ : Type string (pas number)
  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'nom_avi', length: 100, scale: 0, nullable: true, unique: false }))
  nom: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'description_avi', length: 100, scale: 0, nullable: true, unique: false }))
  description: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_avi', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_avi', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_avi', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  // ✅ CORRIGÉ : Suppression de length: 100
  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_avi', scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_avi', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_avi', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  // ✅ AJOUTER : Relation ManyToOne vers AnnonceEntity
  @ManyToOne(() => AnnonceEntity, annonce => annonce.avis, { 
    nullable: true, 
    onDelete: 'RESTRICT', 
    onUpdate: 'CASCADE' 
  })
  @JoinColumn({ name: 'id_ano' }) // Colonne clé étrangère dans avis_avi
  annonce: AnnonceEntity;

  constructor(init?: Partial<any>) {
    Object.assign(this, init); 
  }
}

