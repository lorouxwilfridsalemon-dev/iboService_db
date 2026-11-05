import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { UtilisateurEntity } from '../utilisateur/utilisateur.entity';
import { ModuleEntity } from '../module/module.entity';
import { DroitEntity } from '../droit/droit.entity';

@Entity('utilisateur_module_droit_umd')
@Index('fx_idusrcreation_idx', ['idusrcreation'])
export class UtilisateurModuleDroitEntity { 

    @PrimaryGeneratedColumn (DefaultEntity.convertDataType({ type: 'integer', name: 'id_umd', length: 11, scale: 0, primary:true, nullable: false, unique: true  }))
    id : number;

    @Column (DefaultEntity.convertDataType({ type: 'varchar' , name: 'empty1_umd', length: 100, scale: 0, nullable: true, unique: false  }))
    empty1 : string;

    @Column (DefaultEntity.convertDataType({ type: 'varchar' , name: 'empty2_umd', length: 100, scale: 0, nullable: true, unique: false  }))
    empty2 : string;

    @Column (DefaultEntity.convertDataType({ type: 'varchar' , name: 'empty3_umd', length: 100, scale: 0, nullable: true, unique: false  }))
    empty3 : string;

    @Column (DefaultEntity.convertDataType({ type: 'timestamp' , name:'date_creation_umd', scale: 0, nullable: false, unique: false  }))
    dateCreation : Date;

    @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'geler_umd', length: 1, scale: 0, nullable: false, unique: false  }))
    geler : number;

    @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'idusrcreation_umd', length: 11, scale: 0, nullable: false, unique: false  }))
    idusrcreation : number;

    @ManyToOne(type => UtilisateurEntity, utilisateur => utilisateur.id, {  nullable: true, primary:false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'idusr_umd'})
    utilisateur : UtilisateurEntity;

    @ManyToOne(type => ModuleEntity, module => module.id, {  nullable: true, primary:false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'idmod_umd'})
    module : ModuleEntity;

    @ManyToOne(type => DroitEntity, droit => droit.id, {  nullable: true, primary:false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'iddrt_umd'})
    droit : DroitEntity;

    @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'idtep_umd', length: 11, scale: 0, nullable: true, unique: false  }))
    templateProfil : number;

    constructor(init?: Partial<any>) {
        Object.assign(this, init);
    }
}