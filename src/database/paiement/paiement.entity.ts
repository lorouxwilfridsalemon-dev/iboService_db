import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { ModalitePaiementEntity } from '../modalite_paiement/modalite_paiement.entity';

@Entity('paiement_pai')
@Index('fx_idusrcreation_idx_pai', ['idusrcreation'])
@Index('fx_geler_idx_pai', ['geler'])
@Index('fx_date_creation_idx_pai', ['dateCreation'])
@Index('fx_modalite_paiement_idx_pai', ['modalitePaiement'])
export class PaiementEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_pai', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;


  // Montant dû AVANT ce paiement
  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'montant_du_pai', length: 11, scale: 0, nullable: true, unique: false }))
  montantDu: number;

  // Montant payé de ce paiement
  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'montant_paye_pai', length: 11, scale: 0, nullable: true, unique: false }))
  montantPaye: number;

  // Solde restant après ce paiement 
  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'solde_pai', length: 11, scale: 0, nullable: true, unique: false }))
  solde: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_pai', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_pai', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_pai', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_pai', length: 1, scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_pai', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_pai', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;



  @ManyToOne(() => ModalitePaiementEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idmodalite_paiement' })
  modalitePaiement: ModalitePaiementEntity;
  statut: string;

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}

