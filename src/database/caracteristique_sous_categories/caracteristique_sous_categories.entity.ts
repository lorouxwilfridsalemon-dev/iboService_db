  import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
  import { DefaultEntity } from '../../core/shared/systems/default.entity';
  import { CaracteristiqueEntity } from '../caracteristique/caracteristique.entity';
  import { SousCategoriesEntity } from '../sous_categories/sous_categories.entity'; // ✅

  @Entity('caracteristique_sous_categorie_scs')
  @Index('fx_idusrcreation_scs', ['idusrcreation'])
  @Index('fx_geler_idx_scs', ['geler'])
  @Index('fx_date_creation_idx_scs', ['dateCreation'])
  export class CaracteristiqueSousCategoriesEntity {

    @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_scs', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
    id: number;

    @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_scs', length: 100, scale: 0, nullable: true, unique: false }))
    empty1: string;

    @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_scs', length: 100, scale: 0, nullable: true, unique: false }))
    empty2: string;

    @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_scs', length: 100, scale: 0, nullable: true, unique: false }))
    empty3: string;

    @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_scs', scale: 0, nullable: false, unique: false }))
    geler: number;

    @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_scs', scale: 0, nullable: false, unique: false }))
    dateCreation: Date;

    @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_scs', scale: 0, nullable: true, unique: false }))
    idusrcreation: number;

    // ─── RELATION AVEC CARACTERISTIQUE ───

    @ManyToOne(() => CaracteristiqueEntity, caracteristique => caracteristique.caracteristiqueSousCategories, { 
      nullable: true, 
      onDelete: 'RESTRICT', 
      onUpdate: 'CASCADE' 
    })
    @JoinColumn({ name: 'id_car' }) 
    caracteristique: CaracteristiqueEntity;

    // SousCategories (1) ──── (N) CaracteristiqueSousCategories
    @ManyToOne(() => SousCategoriesEntity, sousCategorie => sousCategorie.caracteristiqueSousCategories, { 
      nullable: true, 
      onDelete: 'RESTRICT', 
      onUpdate: 'CASCADE' 
    })
    @JoinColumn({ name: 'id_sca' }) 
    sousCategorie: SousCategoriesEntity;

    constructor(init?: Partial<any>) {
      Object.assign(this, init);
    }
  }