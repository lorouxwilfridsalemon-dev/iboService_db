import { Column, Entity, ManyToOne, OneToMany, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { CategoriesEntity } from '../categories/categories.entity';
import { AnnonceEntity } from '../annonce/annonce.entity';
import { CaracteristiqueSousCategoriesEntity } from '../caracteristique_sous_categories/caracteristique_sous_categories.entity'; // ✅

@Entity('souscategories_sca')
export class SousCategoriesEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_sca', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'nom_sca', length: 100, scale: 0, nullable: true, unique: false }))
  nom: string; 

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'description_sca', length: 100, scale: 0, nullable: true, unique: false }))
  description: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_sca', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_sca', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_sca', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_sca', scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_sca', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_sca', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  // ─── RELATIONS EXISTANTES ───

  @ManyToOne(() => CategoriesEntity, categorie => categorie.sousCategories, { 
    nullable: true, 
    onDelete: 'RESTRICT', 
    onUpdate: 'CASCADE' 
  })
  @JoinColumn({ name: 'id_categorie_cat' }) 
  categorie: CategoriesEntity;

  @OneToMany(() => AnnonceEntity, annonce => annonce.sousCategorie, { 
    onDelete: 'RESTRICT', 
    onUpdate: 'CASCADE' 
  })
  annonces: AnnonceEntity[];

  // SousCategories (1) ──── (N) CaracteristiqueSousCategories
  @OneToMany(() => CaracteristiqueSousCategoriesEntity, caracteristiqueSousCategories => caracteristiqueSousCategories.sousCategorie, { 
    onDelete: 'RESTRICT', 
    onUpdate: 'CASCADE' 
  })
  caracteristiqueSousCategories: CaracteristiqueSousCategoriesEntity[];

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
} 