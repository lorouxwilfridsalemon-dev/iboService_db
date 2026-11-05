import { DroitEntity } from './../droit/droit.entity';
import { ModuleEntity } from './../module/module.entity';
import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';

@Entity('module_droit_mdr')
@Index('fx_idusrcreation_idx', ['idusrcreation'])
export class ModuleDroitEntity { 

    @PrimaryGeneratedColumn (DefaultEntity.convertDataType({ type: 'integer', name: 'id_mdr', length: 11, scale: 0, primary:true, nullable: false, unique: true  }))
    id : number;

    @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'libelle_mdr', length: 100, scale: 0, nullable: true, unique: false  }))
    libelle : string;

    @Column (DefaultEntity.convertDataType({ type: 'varchar' , name: 'empty1_mdr', length: 100, scale: 0, nullable: true, unique: false  }))
    empty1 : string;

    @Column (DefaultEntity.convertDataType({ type: 'varchar' , name: 'empty2_mdr', length: 100, scale: 0, nullable: true, unique: false  }))
    empty2 : string;

    @Column (DefaultEntity.convertDataType({ type: 'varchar' , name: 'empty3_mdr', length: 100, scale: 0, nullable: true, unique: false  }))
    empty3 : string;

    @Column (DefaultEntity.convertDataType({ type: 'timestamp' , name:'date_creation_mdr', scale: 0, nullable: false, unique: false  }))
    dateCreation : Date;

    @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'geler_mdr', length: 1, scale: 0, nullable: false, unique: false  }))
    geler : number;

    @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'idusrcreation_mdr', length: 11, scale: 0, nullable: false, unique: false  }))
    idusrcreation : number;

    @ManyToOne(type => ModuleEntity, module => module.id, {  nullable: true, primary:false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'idmod_mdr'})
    module : ModuleEntity;

    @ManyToOne(type => DroitEntity, module => module.id, {  nullable: true, primary:false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'iddrt_mdr'})
    droit : DroitEntity;

    constructor(init?: Partial<any>) {
        Object.assign(this, init);
    }
}