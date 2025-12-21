import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { AchatEntity } from '../../database/achat/achat.entity';
import { ClientEntity } from '../../database/client/client.entity';
import { ProduitEntity } from '../../database/produit/produit.entity';

@Injectable()
export class DashboardMetierService {
  
  /**
   * Service pour les statistiques et tableaux de bord
   * 
   * Ce service contiendra les méthodes pour :
   * - Chiffre d'affaires par période
   * - Top clients
   * - Statistiques globales
   * - Évolutions et tendances
   */
  
  constructor() {}

  // Les méthodes seront ajoutées ici
}

