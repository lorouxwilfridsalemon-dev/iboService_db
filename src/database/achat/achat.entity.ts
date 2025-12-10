import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { ClientEntity } from '../client/client.entity';
import { UtilisateurEntity } from '../utilisateur/utilisateur.entity';
import { DetailAchatEntity } from '../detail_achat/detail_achat.entity';
import { ModalitePaiementEntity } from '../modalite_paiement/modalite_paiement.entity';

@Entity('achat_ach')
@Index('fx_idusrcreation_idx_ach', ['idusrcreation'])
@Index('fx_geler_idx_ach', ['geler'])
@Index('fx_date_creation_idx_ach', ['dateCreation'])
@Index('fx_client_idx_ach', ['client'])
@Index('fx_utilisateur_idx_ach', ['utilisateur'])
export class AchatEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_ach', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  // Montant total d'une vente : toujours obligatoire
  @Column(DefaultEntity.convertDataType({ type: 'decimal', name: 'montant_total_ach', length: 10, scale: 0, nullable: false, unique: false }))
  montantTotal: number;

  // Montant total payé (default 0)
  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'montant_paye_ach', length: 11, scale: 0, nullable: true, unique: false, default: 0 }))
  montantPaye: number;

  // Solde restant (montantTotal - montantPaye)
  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'solde_ach', length: 11, scale: 0, nullable: true, unique: false }))
  solde: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_ach', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_ach', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_ach', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_ach', length: 100, scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_ach', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_ach', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  @ManyToOne(() => ClientEntity, client => client.achats, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idclient' })
  client: ClientEntity;

  @ManyToOne(() => UtilisateurEntity, utilisateur => utilisateur.achats, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idutilisateur' })
  utilisateur: UtilisateurEntity;

  @OneToMany(() => DetailAchatEntity, detailAchat => detailAchat.achat, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  detailsAchat: DetailAchatEntity[];

  @ManyToOne(() => ModalitePaiementEntity, modalitePaiement => modalitePaiement.achats, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'modalite_paiement_id_ach' })
  modalitePaiement: ModalitePaiementEntity;

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}

