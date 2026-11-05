  import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
  import { DefaultEntity } from '../../core/shared/systems/default.entity';
  import { SousCategoriesEntity } from '../sous_categories/sous_categories.entity';
  import { CaracteristiqueEntity } from '../caracteristique/caracteristique.entity'; // ✅ Import

  @Entity('categories_cat')
  export class CategoriesEntity { 

    @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_cat', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
    id: number;

    @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'nom_cat', length: 100, scale: 0, nullable: true, unique: false }))
    nom: string;

    @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'description_cat', length: 100, scale: 0, nullable: true, unique: false }))
    description: string;

    @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_cat', length: 100, scale: 0, nullable: true, unique: false }))
    empty1: string;

    @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_cat', length: 100, scale: 0, nullable: true, unique: false }))
    empty2: string;

    @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_cat', length: 100, scale: 0, nullable: true, unique: false }))
    empty3: string;

    @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_cat', scale: 0, nullable: false, unique: false }))
    geler: number;

    @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_cat', scale: 0, nullable: false, unique: false }))
    dateCreation: Date;

    @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_cat', scale: 0, nullable: true, unique: false }))
    idusrcreation: number;

    // Relation existante : SousCategories
    @OneToMany(() => SousCategoriesEntity, sousCategorie => sousCategorie.categorie, { 
      onDelete: 'RESTRICT', 
      onUpdate: 'CASCADE' 
    })
    sousCategories: SousCategoriesEntity[];

    // ✅ AJOUTER : Relation OneToMany vers CaracteristiqueEntity
    @OneToMany(() => CaracteristiqueEntity, caracteristique => caracteristique.categorie, { 
      onDelete: 'RESTRICT', 
      onUpdate: 'CASCADE' 
    })
    caracteristiques: CaracteristiqueEntity[];

    constructor(init?: Partial<any>) {
      Object.assign(this, init); 
    }
  } 




// import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
// import { DefaultEntity } from '../../core/shared/systems/default.entity';
// import { SousCategoriesEntity } from '../sous_categories/sous_categories.entity';

// @Entity('categories_cat')
// @Index('fx_idusrcreation_cat', ['idusrcreation'])
// @Index('fx_geler_idx_cat', ['geler'])
// @Index('fx_date_creation_idx_cat', ['dateCreation'])
// export class CategoriesEntity {

//   @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_cat', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
//   id: number;

//   @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'nom_cat', length: 100, scale: 0, nullable: true, unique: false }))
//   nom: string;

//   @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'description_cat', length: 100, scale: 0, nullable: true, unique: false }))
//   description: string;

//   @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_cat', length: 100, scale: 0, nullable: true, unique: false }))
//   empty1: string;

//   @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_cat', length: 100, scale: 0, nullable: true, unique: false }))
//   empty2: string;

//   @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_cat', length: 100, scale: 0, nullable: true, unique: false }))
//   empty3: string;

//   @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_cat', scale: 0, nullable: false, unique: false }))
//   geler: number;

//   @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_cat', scale: 0, nullable: false, unique: false }))
//   dateCreation: Date;

//   @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_cat', scale: 0, nullable: true, unique: false }))
//   idusrcreation: number;

//   // Relations

//   constructor(init?: Partial<any>) {
//     Object.assign(this, init);
//   }
// }


