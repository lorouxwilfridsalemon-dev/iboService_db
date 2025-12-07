import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { TypeClientEntity } from '../type_client/type_client.entity';
import { AchatEntity } from '../achat/achat.entity';

@Entity('client_cli')
@Index('fx_idusrcreation_idx_cli', ['idusrcreation'])
export class ClientEntity { 
 
  @PrimaryGeneratedColumn (DefaultEntity.convertDataType({ type: 'integer', name:'id_cli', length: 11, scale: 0, primary:true, nullable: false, unique: true  }))
  id : number;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'nom_prenom_client_cli', length: 100, scale: 0, nullable: false, unique: false  }))
  nomPrenom : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'numero_client_cli', length: 15, scale: 0, nullable: true, unique: false  }))
  numero : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty1_cli', length: 100, scale: 0, nullable: true, unique: false  }))
  empty1 : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty2_cli', length: 100, scale: 0, nullable: true, unique: false  }))
  empty2 : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty3_cli', length: 100, scale: 0, nullable: true, unique: false  }))
  empty3 : string;

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'geler_cli', length: 1, scale: 0, nullable: false, unique: false  }))
  geler : number;

  @Column (DefaultEntity.convertDataType({ type: 'timestamp' , name:'date_creation_cli', scale: 0, nullable: false, unique: false  }))
  dateCreation : Date; 

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'idusrcreation_cli', scale: 0, nullable: true, unique: false  }))
  idusrcreation : number;

  @ManyToOne(() => TypeClientEntity, typeClient => typeClient.clients, {onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'type_client_idtype_client' })
  typeClient : TypeClientEntity;

  @OneToMany(() => AchatEntity, achat => achat.client, {onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  achats : AchatEntity[];

  constructor(init?: Partial<any>) { 
    Object.assign(this, init);
  }
} 

