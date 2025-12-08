import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { AchatEntity } from '../achat/achat.entity';
import { ProduitEntity } from '../produit/produit.entity';

@Entity('detail_achat_dac')

export class DetailAchatEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_dac', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  // Poids d'une pesée : toujours obligatoire
  @Column(DefaultEntity.convertDataType({ type: 'decimal', name: 'poids_dac', length: 10, scale: 0, nullable: false, unique: false }))
  poids: number;

  // Montant de la pesée (poids × prixKg) : toujours obligatoire
  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'montant_dac', length: 11, scale: 0, nullable: false, unique: false }))
  montant: number;

  // Date et heure de création de la pesée : toujours obligatoire
  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_dac', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_dac', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_dac', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_dac', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @ManyToOne(() => AchatEntity, achat => achat.detailsAchat, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'achat_idachat' })
  achat: AchatEntity;

  @ManyToOne(() => ProduitEntity, produit => produit.detailsAchat, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'poisson_idpoisson' })
  produit: ProduitEntity;

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}

