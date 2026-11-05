import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { AnnonceEntity } from '../annonce/annonce.entity'; // ✅ Import

@Entity('detailimmobilier_dei')
@Index('fx_idusrcreation_dei', ['idusrcreation'])
@Index('fx_geler_idx_dei', ['geler'])
@Index('fx_date_creation_idx_dei', ['dateCreation'])
export class DetailImmobilierEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_dei', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'nombre_chambres_dei', scale: 0, nullable: false, unique: false }))
  nombre_chambres: number;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'nombre_douches_dei', scale: 0, nullable: false, unique: false }))
  nombre_douches: number;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'surface_dei', scale: 0, nullable: false, unique: false }))
  surface: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'type_location_dei', length: 100, scale: 0, nullable: true, unique: false }))
  type_location: string;
  
  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'caution_mois_dei', length: 100, scale: 0, nullable: true, unique: false }))
  caution_mois: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'avance_mois_dei', length: 100, scale: 0, nullable: true, unique: false }))
  avance_mois: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'frais_visite_dei', scale: 0, nullable: true, unique: false }))
  frais_visite: number;

  @Column(DefaultEntity.convertDataType({ type: 'boolean', name: 'meuble_dei', scale: 0, nullable: true, unique: false }))
  meuble: boolean;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_dei', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_dei', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_dei', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_dei', scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_dei', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_dei', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;


  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}