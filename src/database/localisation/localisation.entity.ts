import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { UtilisateurEntity } from '../utilisateur/utilisateur.entity';
import { PaiementEntity } from '../paiement/paiement.entity';
import { AnnonceEntity } from '../annonce/annonce.entity';

@Entity('localisation_loc')
@Index('fx_idusrcreation_loc', ['idusrcreation'])
@Index('fx_geler_idx_loc', ['geler'])
@Index('fx_date_creation_idx_loc', ['dateCreation'])
export class LocalisationEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_loc', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

 
  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'adresse_loc', length: 100, scale: 0, nullable: true, unique: false }))
  adresse: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'ville_loc', length: 100, scale: 0, nullable: true, unique: false }))
  ville: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'pays_loc', length: 100, scale: 0, nullable: true, unique: false }))
  pays: string;

  @Column(DefaultEntity.convertDataType({ type: 'float', name: 'longitude_loc', length: 10, scale: 0, nullable: false, unique: false }))
  longitude: number;

   @Column(DefaultEntity.convertDataType({ type: 'float', name: 'latitude_loc', length: 10, scale: 0, nullable: false, unique: false }))
  latitude: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_loc', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_loc', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_loc', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_loc', length: 100, scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_loc', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_loc', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;



  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}

