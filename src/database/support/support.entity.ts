import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { AchatEntity } from '../achat/achat.entity';

@Entity('support_sup')
@Index('fx_idusrcreation_idx_sup', ['idusrcreation'])
export class SupportEntity { 
 
  @PrimaryGeneratedColumn (DefaultEntity.convertDataType({ type: 'integer', name:'id_sup', length: 11, scale: 0, primary:true, nullable: false, unique: true  }))
  id : number;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'libelle_sup', length: 100, scale: 0, nullable: false, unique: false  }))
  libelle : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'poids_sup', length: 100, scale: 0, nullable: true, unique: false  }))
  poids : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty1_sup', length: 100, scale: 0, nullable: true, unique: false  }))
  empty1 : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty2_sup', length: 100, scale: 0, nullable: true, unique: false  }))
  empty2 : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty3_sup', length: 100, scale: 0, nullable: true, unique: false  }))
  empty3 : string;

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'geler_sup', length: 100, scale: 0, nullable: false, unique: false  }))
  geler : number;

  @Column (DefaultEntity.convertDataType({ type: 'timestamp' , name:'date_creation_sup', scale: 0, nullable: false, unique: false  }))
  dateCreation : Date; 

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'idusrcreation_sup', scale: 0, nullable: true, unique: false  }))
  idusrcreation : number; 

  @OneToMany(() => AchatEntity, achat => achat.support, {onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  achats : AchatEntity[];

  constructor(init?: Partial<any>) { 
    Object.assign(this, init);
  }
} 

