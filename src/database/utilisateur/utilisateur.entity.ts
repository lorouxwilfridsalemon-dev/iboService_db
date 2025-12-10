import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { AchatEntity } from '../achat/achat.entity';

@Entity('utilisateur_uti')
@Index('fx_idusrcreation_idx_uti', ['idusrcreation'])
@Index('fx_geler_idx_uti', ['geler'])
export class UtilisateurEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_uti', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'nom_utilisateur_uti', length: 50, scale: 0, nullable: false, unique: false }))
  nomUtilisateur: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'mot_de_passe_uti', length: 100, scale: 0, nullable: false, unique: false }))
  motDePasse: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_uti', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_uti', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_uti', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_uti', length: 1, scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_uti', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_uti', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  @OneToMany(() => AchatEntity, achat => achat.utilisateur, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  achats: AchatEntity[];

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}

