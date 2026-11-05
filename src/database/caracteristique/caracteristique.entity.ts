import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { CategoriesEntity } from '../categories/categories.entity';
import { AnnonceCaracteristiqueEntity } from '../annonce_caracteristique/annonce_caracteristique.entity';
import { CaracteristiqueSousCategoriesEntity } from '../caracteristique_sous_categories/caracteristique_sous_categories.entity';

@Entity('caracteristique_car')
@Index('fx_idusrcreation_car', ['idusrcreation'])
@Index('fx_geler_idx_car', ['geler'])
@Index('fx_date_creation_idx_car', ['dateCreation'])
export class CaracteristiqueEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_car', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'nom_car', length: 100, scale: 0, nullable: true, unique: false }))
  nom: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'description_car', length: 100, scale: 0, nullable: true, unique: false }))
  description: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_car', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_car', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_car', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_car', scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_car', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_car', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  // ─── RELATIONS ───

  @ManyToOne(() => CategoriesEntity, categorie => categorie.caracteristiques, { 
    nullable: true, 
    onDelete: 'RESTRICT', 
    onUpdate: 'CASCADE' 
  })
  @JoinColumn({ name: 'id_categorie_cat' })
  categorie: CategoriesEntity;

  @OneToMany(() => AnnonceCaracteristiqueEntity, annonceCaracteristique => annonceCaracteristique.caracteristique, { 
    onDelete: 'RESTRICT', 
    onUpdate: 'CASCADE' 
  })
  annonceCaracteristiques: AnnonceCaracteristiqueEntity[];

  // ✅ CORRIGÉ : camelCase
  @OneToMany(() => CaracteristiqueSousCategoriesEntity, caracteristiqueSousCategories => caracteristiqueSousCategories.caracteristique, { 
    onDelete: 'RESTRICT', 
    onUpdate: 'CASCADE' 
  })
  caracteristiqueSousCategories: CaracteristiqueSousCategoriesEntity[];

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}