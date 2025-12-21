import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { AchatEntity } from '../../database/achat/achat.entity';
import { ClientEntity } from '../../database/client/client.entity';
import { ProduitEntity } from '../../database/produit/produit.entity';

@Injectable()
export class DashboardMetierService {


  constructor() { }


}

