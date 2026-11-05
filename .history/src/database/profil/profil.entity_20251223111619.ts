import { UtilisateurProfilEntity } from './../utilisateur-profil/utilisateur-profil.entity';
import { TemplateProfilEntity } from './../template-profil/template-profil.entity';
import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';

@Entity('profil_pro')
@Index('fx_idusrcreation_idx', ['idusrcreation'])

export class ProfilEntity { 


@PrimaryGeneratedColumn (DefaultEntity.convertDataType({ type: 'integer',name:'id_pro', length: 11, scale: 0, primary:true, nullable: false, unique: true  }))
id : number;

@Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'libelle_pro', length: 100, scale: 0, nullable: false, unique: false  }))
libelle : string;

@Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty1_pro', length: 100, scale: 0, nullable: true, unique: false  }))
empty1 : string;

@Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty2_pro', length: 100, scale: 0, nullable: true, unique: false  }))
empty2 : string;

@Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty3_pro', length: 100, scale: 0, nullable: true, unique: false  }))
empty3 : string;

@Column (DefaultEntity.convertDataType({ type: 'integer' , name:'geler_pro', length: 11, scale: 0, nullable: false, unique: false  }))
geler : number;

@Column (DefaultEntity.convertDataType({ type: 'integer' , name:'idusrcreation_pro', length: 11, scale: 0, nullable: false, unique: false  }))
idusrcreation : number;

@Column (DefaultEntity.convertDataType({ type: 'timestamp' , name:'date_creation_pro', scale: 0, nullable: false, unique: false  }))
dateCreation : Date;

@OneToMany(type => TemplateProfilEntity, templateProfil => templateProfil.profil, {onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
templateProfil : TemplateProfilEntity[];

@OneToMany(type => UtilisateurProfilEntity, utilisateurProfil => utilisateurProfil.profil, {onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
utilisateurProfil : UtilisateurProfilEntity[];

constructor(init?: Partial<any>) {
    Object.assign(this, init);
    }
}