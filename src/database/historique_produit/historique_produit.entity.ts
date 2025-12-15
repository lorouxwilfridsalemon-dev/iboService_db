import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { ProduitEntity } from '../produit/produit.entity';

@Entity('historique_produit_hpr')
@Index('fx_produit_id_idx_hpr', ['produit'])
@Index('fx_date_creation_idx_hpr', ['dateCreation'])
@Index('fx_idusrcreation_idx_hpr', ['idusrcreation'])
export class HistoriqueProduitEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_hpr', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  // Copie des champs du produit
  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'libelle_hpr', length: 50, scale: 0, nullable: true, unique: false }))
  libelle: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'prix_kg_hpr', length: 11, scale: 0, nullable: true, unique: false }))
  prixKg: number;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'prix_kg_1_tonne_hpr', length: 11, scale: 0, nullable: true, unique: false }))
  prixKgPalier1: number;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'prix_kg_3_tonnes_hpr', length: 11, scale: 0, nullable: true, unique: false }))
  prixKgPalier2: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_hpr', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_hpr', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_hpr', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_hpr', length: 1, scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_hpr', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_hpr', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  @ManyToOne(() => ProduitEntity, produit => produit.historiques, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'produit_id_hpr' })
  produit: ProduitEntity;

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}

