import { Injectable, HttpException, HttpStatus, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { AchatEntity } from '../../database/achat/achat.entity';
import { DetailAchatEntity } from '../../database/detail_achat/detail_achat.entity';
import { ClientEntity } from '../../database/client/client.entity';
import { ProduitEntity } from '../../database/produit/produit.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { SupportEntity } from '../../database/support/support.entity';

/**
 * SERVICE DE VENTE
 * 
 * Workflow :
 * 1. Chercher si le client existe (par numéro)
 * 2. Si existe → utiliser, sinon → créer
 * 3. Calculer les montants
 * 4. Sauvegarder tout en transaction
 */
@Injectable()
export class VenteMetierService {
  
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    
    @InjectRepository(AchatEntity)
    private readonly achatRepository: Repository<AchatEntity>,
    
    @InjectRepository(DetailAchatEntity)
    private readonly detailAchatRepository: Repository<DetailAchatEntity>,
    
    @InjectRepository(ProduitEntity)
    private readonly produitRepository: Repository<ProduitEntity>,
    
    @InjectRepository(UtilisateurEntity)
    private readonly utilisateurRepository: Repository<UtilisateurEntity>,
    
    @InjectRepository(SupportEntity)
    private readonly supportRepository: Repository<SupportEntity>,
    
    private readonly connection: Connection,
  ) {}

  /**
   * CRÉER UNE VENTE COMPLÈTE
   * 
   * @param venteData - Données de la vente
   * Structure attendue :
   * {
   *   clientNom: string,
   *   clientNumero: string,
   *   clientTypeClient: number,
   *   utilisateurId: number,
   *   supportId?: number,
   *   details: [
   *     { produitId: number, poids: number, prixKg: number }
   *   ]
   * }
   */
  async creerVente(venteData: any) {
    // VALIDATION : Vérifier qu'on a au moins un détail
    if (!venteData.details || venteData.details.length === 0) {
      throw new BadRequestException('Au moins un article est requis');
    }

    // VALIDATION : Vérifier les champs obligatoires
    if (!venteData.clientNom || !venteData.clientNumero) {
      throw new BadRequestException('Nom et numéro du client sont requis');
    }

    // Démarrer une TRANSACTION (tout ou rien)
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ════════════════════════════════════════════
      // ÉTAPE 1 : GÉRER LE CLIENT
      // ════════════════════════════════════════════
      const client = await this.gererClient(
        venteData.clientNom,
        venteData.clientNumero,
        venteData.clientTypeClient,
        venteData.utilisateurId,
        queryRunner
      );

      // ════════════════════════════════════════════
      // ÉTAPE 2 : RÉCUPÉRER UTILISATEUR ET SUPPORT
      // ════════════════════════════════════════════
      const utilisateur = await this.utilisateurRepository.findOne({
        where: { id: venteData.utilisateurId }
      });
      
      if (!utilisateur) {
        throw new NotFoundException(`Utilisateur ${venteData.utilisateurId} introuvable`);
      }

      let support = null;
      if (venteData.supportId) {
        support = await this.supportRepository.findOne({
          where: { id: venteData.supportId }
        });
      }

      // ════════════════════════════════════════════
      // ÉTAPE 3 : CALCULER LE MONTANT TOTAL
      // ════════════════════════════════════════════
      const montantTotal = this.calculerMontantTotal(venteData.details);

      // ════════════════════════════════════════════
      // ÉTAPE 4 : CRÉER L'ACHAT PRINCIPAL
      // ════════════════════════════════════════════
      const now = new Date();
      const achat = queryRunner.manager.create(AchatEntity, {
        client: client,
        utilisateur: utilisateur,
        support: support,
        montantTotal: montantTotal,
        date: now,
        heure: now.toTimeString().split(' ')[0], // Format: "14:30:25"
        geler: 0,
        dateCreation: now,
        idusrcreation: utilisateur.id
      });
      
      const achatSauvegarde = await queryRunner.manager.save(achat);

      // ════════════════════════════════════════════
      // ÉTAPE 5 : CRÉER LES DÉTAILS
      // ════════════════════════════════════════════
      const detailsCrees = [];
      
      for (const detailData of venteData.details) {
        // Vérifier que le produit existe
        const produit = await this.produitRepository.findOne({
          where: { id: detailData.produitId }
        });
        
        if (!produit) {
          throw new NotFoundException(`Produit ${detailData.produitId} introuvable`);
        }

        // Vérifier les valeurs
        if (detailData.poids <= 0) {
          throw new BadRequestException('Le poids doit être supérieur à 0');
        }
        
        if (detailData.prixKg <= 0) {
          throw new BadRequestException('Le prix doit être supérieur à 0');
        }

        // Calculer le montant de cette ligne
        const montant = Math.round(detailData.poids * detailData.prixKg * 100) / 100;

        // Créer le détail
        const detail = queryRunner.manager.create(DetailAchatEntity, {
          achat: achatSauvegarde,
          produit: produit,
          poids: detailData.poids,
          prixKg: detailData.prixKg,
          montant: montant,
          date: now,
          heure: now
        });

        const detailSauvegarde = await queryRunner.manager.save(detail);
        detailsCrees.push({
          produit: produit.libelle,
          poids: detailSauvegarde.poids,
          prixKg: detailSauvegarde.prixKg,
          montant: detailSauvegarde.montant
        });
      }

      // ════════════════════════════════════════════
      // ÉTAPE 6 : VALIDER LA TRANSACTION
      // ════════════════════════════════════════════
      await queryRunner.commitTransaction();

      // ════════════════════════════════════════════
      // ÉTAPE 7 : RETOURNER LA RÉPONSE
      // ════════════════════════════════════════════
      return {
        success: true,
        message: 'Vente créée avec succès',
        data: {
          venteId: achatSauvegarde.id,
          client: {
            id: client.id,
            nom: client.nomPrenom,
            numero: client.numero,
            nouveau: client.id ? false : true  // Si ID existe = pas nouveau
          },
          montantTotal: achatSauvegarde.montantTotal,
          nombreArticles: detailsCrees.length,
          details: detailsCrees
        }
      };

    } catch (error) {
      // ════════════════════════════════════════════
      // EN CAS D'ERREUR : ANNULER TOUT
      // ════════════════════════════════════════════
      await queryRunner.rollbackTransaction();
      
      console.error('Erreur lors de la création de la vente:', error);
      
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la création de la vente',
          error: error
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
      
    } finally {
      // Toujours libérer la connexion
      await queryRunner.release();
    }
  }

  /**
   * GÉRER LE CLIENT (Chercher ou Créer)
   * 
   * Logique :
   * 1. Chercher un client avec ce numéro
   * 2. Si trouvé → retourner ce client
   * 3. Si pas trouvé → créer un nouveau client
   * 
   * @param nom - Nom du client
   * @param numero - Numéro du client (clé unique)
   * @param typeClientId - Type de client
   * @param userId - Utilisateur qui crée
   * @param queryRunner - Pour la transaction
   */
  private async gererClient(
    nom: string,
    numero: string,
    typeClientId: number,
    userId: number,
    queryRunner: any
  ): Promise<ClientEntity> {
    
    // ════════════════════════════════════════════
    // 1. CHERCHER SI LE CLIENT EXISTE DÉJÀ
    // ════════════════════════════════════════════
    // On cherche par numéro de téléphone (unique)
    const clientExistant = await this.clientRepository.findOne({
      where: { numero: numero }
    });

    // ════════════════════════════════════════════
    // 2. SI TROUVÉ → UTILISER CE CLIENT
    // ════════════════════════════════════════════
    if (clientExistant) {
      console.log(`✅ Client existant trouvé : ${clientExistant.nomPrenom} (ID: ${clientExistant.id})`);
      return clientExistant;
    }

    // ════════════════════════════════════════════
    // 3. SI PAS TROUVÉ → CRÉER UN NOUVEAU CLIENT
    // ════════════════════════════════════════════
    console.log(`📝 Création d'un nouveau client : ${nom}`);
    
    const nouveauClient = queryRunner.manager.create(ClientEntity, {
      nomPrenom: nom,
      numero: numero,
      typeClient: typeClientId,
      geler: 0,
      dateCreation: new Date(),
      idusrcreation: userId
    });

    return await queryRunner.manager.save(nouveauClient);
  }

  /**
   * CALCULER LE MONTANT TOTAL
   * 
   * Formule : Somme(poids × prix_kg) pour tous les détails
   * 
   * @param details - Tableau des détails de vente
   * @returns Montant total arrondi à 2 décimales
   */
  private calculerMontantTotal(details: any[]): number {
    let total = 0;

    for (const detail of details) {
      const montant = detail.poids * detail.prixKg;
      total += montant;
    }

    // Arrondir à 2 décimales (ex: 225.4567 → 225.46)
    return Math.round(total * 100) / 100;
  }
}
