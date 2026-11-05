import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { AnnonceEntity } from '../annonce/annonce.entity';

@Entity('annonceimage_ani')
@Index('fx_idusrcreation_ani', ['idusrcreation'])
@Index('fx_geler_idx_ani', ['geler'])
@Index('fx_date_creation_idx_ani', ['dateCreation'])

export class AnnonceImageEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_ani', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'nom_ani', length: 100, scale: 0, nullable: true, unique: false }))
  nom: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'description_ani', length: 100, scale: 0, nullable: true, unique: false }))
  order_image: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_ani', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_ani', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_ani', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_ani', scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_ani', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_ani', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  @ManyToOne(() => AnnonceEntity, annonce => annonce.images, { 
    nullable: true, 
    onDelete: 'RESTRICT', 
    onUpdate: 'CASCADE' 
  })
  @JoinColumn({ name: 'id_ano' }) 
  annonce: AnnonceEntity;

  constructor(init?: Partial<any>) { 
    Object.assign(this, init);
  }
}

