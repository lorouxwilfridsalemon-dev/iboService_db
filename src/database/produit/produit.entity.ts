import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { DetailAchatEntity } from '../detail_achat/detail_achat.entity';

@Entity('produit_pro')
@Index('fx_idusrcreation_idx_pro', ['idusrcreation'])
export class ProduitEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_pro', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'libelle_pro', length: 50, scale: 0, nullable: false, unique: false }))
  libelle: string;

  // Prix au kilogramme paramétrable pour ce poisson (optionnel mais recommandé)
  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'prix_kg_pro', length: 11, scale: 0, nullable: true, unique: false }))
  prixKgParDefaut: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_pro', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_pro', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_pro', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_pro', length: 1, scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_pro', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_pro', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  @OneToMany(() => DetailAchatEntity, detailAchat => detailAchat.produit, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  detailsAchat: DetailAchatEntity[];

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}

