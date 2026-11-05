import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { PaiementEntity } from '../paiement/paiement.entity';

@Entity('modalite_paiement_mop')
@Index('fx_idusrcreation_mop', ['idusrcreation'])
@Index('fx_geler_idx_mop', ['geler'])
export class ModalitePaiementEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_mop', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'libelle_mop', length: 50, scale: 0, nullable: false, unique: false }))
  libelle: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_mop', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_mop', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_mop', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_mop', length: 1, scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_mop', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_mop', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  @OneToMany(() => PaiementEntity, paiement => paiement.modalitePaiement, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  paiements: PaiementEntity[];

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}

