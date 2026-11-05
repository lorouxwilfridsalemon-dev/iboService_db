
import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { ModuleDroitEntity } from '../module-droit/module-droit.entity';


@Entity('droit_drt')
@Index('fx_idusrcreation_idx', ['idusrcreation'])

export class DroitEntity { 


@PrimaryGeneratedColumn (DefaultEntity.convertDataType({ type: 'integer', name:'id_drt', length: 11, scale: 0, primary:true, nullable: false, unique: true  }))
id : number;

@Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'libelle_drt', length: 100, scale: 0, nullable: false, unique: false  }))
libelle : string;

@Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty1_drt', length: 100, scale: 0, nullable: true, unique: false  }))
empty1 : string;

@Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty_drt', length: 100, scale: 0, nullable: true, unique: false  }))
empty2 : string;

@Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty3_drt', length: 100, scale: 0, nullable: true, unique: false  }))
empty3 : string;

@Column (DefaultEntity.convertDataType({ type: 'integer' , name:'geler_drt', length: 100, scale: 0, nullable: false, unique: false  }))
geler : number;

@Column (DefaultEntity.convertDataType({ type: 'timestamp' , name:'date_creation_drt', scale: 0, nullable: false, unique: false  }))
dateCreation : Date;

@Column (DefaultEntity.convertDataType({ type: 'integer' , name:'idusrcreation_drt', scale: 0, nullable: true, unique: false  }))
idusrcreation : number;

@OneToMany(type => ModuleDroitEntity, moduleDroit => moduleDroit.droit, {onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
moduleDroit : ModuleDroitEntity[];

// @OneToMany(type => DroitAbonnementEntity, droitAbonnement => droitAbonnement.droit, {onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
// droitAbonnement : DroitAbonnementEntity[];

constructor(init?: Partial<any>) {
    Object.assign(this, init);
    }
}
