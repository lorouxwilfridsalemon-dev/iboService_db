import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { UtilisateurEntity } from '../utilisateur/utilisateur.entity';
import { StatutVueEntity } from '../statut_vue/statut_vue.entity';

@Entity('statut_sts')
@Index('fx_idusrcreation_sts', ['idusrcreation'])
@Index('fx_geler_idx_sts', ['geler'])
@Index('fx_date_expiration_idx_sts', ['dateExpiration'])
export class StatutEntity {
  @PrimaryGeneratedColumn(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'id_sts',
      length: 11,
      scale: 0,
      primary: true,
      nullable: false,
      unique: true,
    }),
  )
  id: number;

  // ✅ Type de statut : 'image' | 'video' | 'texte'
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'type_sts',
      length: 20,
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  type: string;

  // ✅ Contenu texte (si type = 'texte')
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'contenu_sts',
      length: 500,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  contenu: string;

  // ✅ Nom du fichier média (si type = 'image' ou 'video')
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'fichier_sts',
      length: 255,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  fichier: string;

  // ✅ Couleur de fond (si type = 'texte')
  @Column(
    DefaultEntity.convertDataType({
      type: 'varchar',
      name: 'couleur_fond_sts',
      length: 20,
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  couleurFond: string;

  // ✅ Date de création
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_creation_sts',
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  dateCreation: Date;

  // ✅ Date d'expiration (24h après création)
  @Column(
    DefaultEntity.convertDataType({
      type: 'timestamp',
      name: 'date_expiration_sts',
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  dateExpiration: Date;

  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'geler_sts',
      scale: 0,
      nullable: false,
      unique: false,
    }),
  )
  geler: number;

  @Column(
    DefaultEntity.convertDataType({
      type: 'integer',
      name: 'idusrcreation_sts',
      scale: 0,
      nullable: true,
      unique: false,
    }),
  )
  idusrcreation: number;

  // ✅ Relation avec l'utilisateur (auteur du statut)
  @ManyToOne(() => UtilisateurEntity, (user) => user.statuts, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: UtilisateurEntity;

  // ✅ Relation avec les vues
  @OneToMany(() => StatutVueEntity, (vue) => vue.statut, {
    cascade: true,
  })
  vues: StatutVueEntity[];

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}

