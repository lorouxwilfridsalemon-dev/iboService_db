import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { ModuleDroitEntity } from '../module-droit/module-droit.entity';


@Entity('module_mod')
@Index('fx_idusrcreation_idx_mod', ['idusrcreation'])

export class ModuleEntity {


    @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_mod', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
    id: number;

    @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'libelle_mod', length: 100, scale: 0, nullable: true, unique: false }))
    libelle: string;

    @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'icone_mod', length: 100, scale: 0, nullable: true, unique: false }))
    icone: string;

    @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'lien_mod', length: 100, scale: 0, nullable: true, unique: false }))
    lien: string;

    @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'ordre_mod', length: 11, scale: 0, nullable: true, unique: false }))
    ordre: number;

    @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_mod', length: 100, scale: 0, nullable: true, unique: false }))
    empty1: string;

    @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty_mod', length: 100, scale: 0, nullable: true, unique: false }))
    empty2: string;

    @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_mod', length: 100, scale: 0, nullable: true, unique: false }))
    empty3: string;

    @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_mod', length: 100, scale: 0, nullable: false, unique: false }))
    geler: number;

    @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_mod', scale: 0, nullable: false, unique: false }))
    dateCreation: Date;

    @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_mod', scale: 0, nullable: true, unique: false }))
    idusrcreation: number;

    @OneToMany(type => ModuleDroitEntity, moduleDroit => moduleDroit.module, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    moduleDroit: ModuleDroitEntity[];

    @ManyToOne(type => ModuleEntity, module => module.id, { nullable: true, primary: false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'idsmo_mod' })
    moduleParent: ModuleEntity;

    @OneToMany(type => ModuleEntity, module => module.moduleParent, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    sousModules: ModuleEntity[];

    constructor(init?: Partial<any>) {
        Object.assign(this, init);
    }
}
