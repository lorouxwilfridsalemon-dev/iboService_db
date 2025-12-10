import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { ClientEntity } from '../client/client.entity';

@Entity('type_client_tyc')
@Index('fx_idusrcreation_idx_tyc', ['idusrcreation'])
@Index('fx_geler_idx_tyc', ['geler'])
export class TypeClientEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_tyc', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'libelle_tyc', length: 50, scale: 0, nullable: false, unique: false }))
  libelle: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_tyc', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_tyc', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_tyc', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_tyc', length: 1, scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_tyc', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_tyc', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  @OneToMany(() => ClientEntity, client => client.typeClient, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  clients: ClientEntity[];

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}

