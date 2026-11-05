import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { UtilisateurEntity } from '../utilisateur/utilisateur.entity';

@Entity('notification_not')
@Index('fx_idusrcreation_not', ['idusrcreation'])
@Index('fx_geler_idx_not', ['geler'])
@Index('fx_date_creation_idx_not', ['dateCreation'])
export class NotificationEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_not', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'statut_not', length: 100, scale: 0, nullable: true, unique: false }))
  statut: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'titre_not', length: 100, scale: 0, nullable: true, unique: false }))
  titre: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'message_not', length: 100, scale: 0, nullable: true, unique: false }))
  message: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'type_not', length: 100, scale: 0, nullable: true, unique: false }))
  type: string;

  // ✅ CORRIGÉ : boolean et sans length
  @Column(DefaultEntity.convertDataType({ type: 'boolean', name: 'is_lu_not', scale: 0, nullable: true, unique: false }))
  is_lu: boolean;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_not', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_not', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_not', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_not', scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_not', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_not', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  // ✅ RELATION : ManyToOne vers UtilisateurEntity
  @ManyToOne(() => UtilisateurEntity, utilisateur => utilisateur.notifications, { 
    nullable: true, 
    onDelete: 'RESTRICT', 
    onUpdate: 'CASCADE' 
  })
  @JoinColumn({ name: 'id_usr' }) 
  utilisateur: UtilisateurEntity;

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
} 