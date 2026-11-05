import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { CaracteristiqueEntity } from '../caracteristique/caracteristique.entity';
import { AnnonceEntity } from '../annonce/annonce.entity'; // ✅

@Entity('annonce_caracteristique_anc')
@Index('fx_idusrcreation_anc', ['idusrcreation'])
@Index('fx_geler_idx_anc', ['geler'])
@Index('fx_date_creation_idx_anc', ['dateCreation'])

export class AnnonceCaracteristiqueEntity {
 
  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_anc', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'valeur_anc', length: 100, scale: 0, nullable: true, unique: false }))
  valeur: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'description_anc', length: 100, scale: 0, nullable: true, unique: false }))
  description: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_anc', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_anc', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_anc', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_anc', scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_anc', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_anc', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  // ✅ Relation ManyToOne vers CaracteristiqueEntity
  @ManyToOne(() => CaracteristiqueEntity, caracteristique => caracteristique.annonceCaracteristiques, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_car' })
  caracteristique: CaracteristiqueEntity;

  // ✅ NOUVELLE RELATION : ManyToOne vers AnnonceEntity
  @ManyToOne(() => AnnonceEntity, annonce => annonce.annonceCaracteristiques, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_ano' })
  annonce: AnnonceEntity;

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}