import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Index } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { UtilisateurEntity } from '../utilisateur/utilisateur.entity';

@Entity('message_mes')
@Index(['expediteur', 'destinataire'])
@Index(['empty1', 'dateCreation'])
export class MessageEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({
    type: 'integer',
    name: 'id_mes',
    length: 11,
    scale: 0,
    primary: true,
    nullable: false,
    unique: true
  }))
  id: number;

  @Column(DefaultEntity.convertDataType({
    type: 'varchar',
    name: 'contenu_mes',
    length: 100,
    scale: 0,
    nullable: true,
    unique: false
  }))
  contenu: string;

  @Column(DefaultEntity.convertDataType({
    type: 'timestamp',
    name: 'date_creation_mes',
    scale: 0,
    nullable: false,
    unique: false
  }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({
    type: 'boolean',
    name: 'lu_mes',
    scale: 0,
    nullable: true,
    unique: false
  }))
  lu: boolean;

  // ✅ empty1_mes = typeMessage (texte, image, audio, etc.)
  @Column(DefaultEntity.convertDataType({
    type: 'varchar',
    name: 'empty1_mes',
    length: 100,
    scale: 0,
    nullable: true,
    unique: false
  }))
  empty1: string;

  // ✅ empty2_mes = conversationId
  @Column(DefaultEntity.convertDataType({
    type: 'varchar',
    name: 'empty2_mes',
    length: 100,
    scale: 0,
    nullable: true,
    unique: false
  }))
  empty2: string;

  // ✅ empty3_mes = statut ou métadonnées
  @Column(DefaultEntity.convertDataType({
    type: 'varchar',
    name: 'empty3_mes',
    length: 100,
    scale: 0,
    nullable: true,
    unique: false
  }))
  empty3: string;

  // ✅ AJOUT : Statut du message (envoye, recu, lu)
  @Column(DefaultEntity.convertDataType({
    type: 'varchar',
    name: 'statut_mes',
    length: 20,
    scale: 0,
    nullable: true,
    unique: false
  }))
  statut: string;

  @Column(DefaultEntity.convertDataType({
    type: 'integer',
    name: 'geler_mes',
    scale: 0,
    nullable: false,
    unique: false
  }))
  geler: number;

  @Column(DefaultEntity.convertDataType({
    type: 'integer',
    name: 'idusrcreation_mes',
    scale: 0,
    nullable: true,
    unique: false
  }))
  idusrcreation: number;

  // Relations avec Utilisateur
  @ManyToOne(() => UtilisateurEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_expediteur' })
  expediteur: UtilisateurEntity;

  @ManyToOne(() => UtilisateurEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_destinataire' })
  destinataire: UtilisateurEntity;

  // ✅ Méthodes helper pour accéder aux IDs
  get id_expediteur(): number {
    return this.expediteur?.id;
  }

  get id_destinataire(): number {
    return this.destinataire?.id;
  }

  // ✅ Propriétés calculées pour simuler les nouveaux champs
  get typeMessage(): string {
    return this.empty1 || 'texte';
  }

  set typeMessage(value: string) {
    this.empty1 = value;
  }

  get conversationId(): string {
    return this.empty2;
  }

  set conversationId(value: string) {
    this.empty2 = value;
  }

  get dateLecture(): Date | null {
    return this.empty3 ? new Date(this.empty3) : null;
  }

  set dateLecture(value: Date | null) {
    this.empty3 = value ? value.toISOString() : null;
  }

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}

