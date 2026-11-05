import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { UtilisateurEntity } from '../utilisateur/utilisateur.entity';
import { StatutEntity } from '../statut/statut.entity';

@Entity('statut_vue_stv')
@Index('fx_idusrcreation_stv', ['idusrcreation'])
@Index('fx_statut_stv', ['statut'])
@Index('fx_utilisateur_stv', ['utilisateur'])
@Unique('uniq_statut_utilisateur_stv', ['statut', 'utilisateur'])
export class StatutVueEntity {
  @PrimaryGeneratedColumn(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'id_stv',
      length: 11,
      scale: 0,
      primary: true,
      nullable: false,
      unique: true,
    }),
  )
  id: number;

  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_vue_stv',
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  dateVue: Date;

  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'geler_stv',
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  geler: number;

  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'idusrcreation_stv',
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  idusrcreation: number;

  // ✅ Relation avec le statut
  @ManyToOne(() => StatutEntity, (statut) => statut.vues, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_statut' })
  statut: StatutEntity;

  // ✅ Relation avec l'utilisateur (qui a vu)
  @ManyToOne(() => UtilisateurEntity, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: UtilisateurEntity;

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}

