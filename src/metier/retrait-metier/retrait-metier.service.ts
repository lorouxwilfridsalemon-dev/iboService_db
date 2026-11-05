import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RetraitEntity } from '../../database/retrait/retrait.entity';
import { PortefeuilleEntity } from '../../database/portefeuille/portefeuille.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';

@Injectable()
export class RetraitMetierService {
  constructor(
    @InjectRepository(RetraitEntity)
    private readonly retraitRepository: Repository<RetraitEntity>,

    @InjectRepository(PortefeuilleEntity)
    private readonly portefeuilleRepository: Repository<PortefeuilleEntity>,

    @InjectRepository(UtilisateurEntity)
    private readonly utilisateurRepository: Repository<UtilisateurEntity>,
  ) {}

  // =========================================================================
  // DEMANDER UN RETRAIT
  // =========================================================================

  /**
   * Demande un retrait depuis le portefeuille.
   *
   * Flux :
   * 1. Vérifie que l'utilisateur a un portefeuille
   * 2. Vérifie que le solde est suffisant
   * 3. Vérifie que le montant >= seuil minimum
   * 4. Crée la demande de retrait
   * 5. Débite le portefeuille
   */
  async demanderRetrait(
    montant: number,
    methode: string,
    numeroDestination: string,
    nomDestination: string | undefined,
    idUsrConnecte: number,
  ) {
    // 1. Vérifier que l'utilisateur existe
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id: idUsrConnecte },
    });

    if (!utilisateur) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // 2. Récupérer le portefeuille
    const portefeuille = await this.portefeuilleRepository.findOne({
      where: { utilisateur: { id: idUsrConnecte }, geler: 0 },
    });

    if (!portefeuille) {
      throw new NotFoundException('Portefeuille introuvable');
    }

    // 3. Vérifier le seuil minimum
    if (montant < portefeuille.seuilRetraitMin) {
      throw new BadRequestException(
        `Le montant minimum de retrait est ${portefeuille.seuilRetraitMin} FCFA`,
      );
    }

    // 4. Vérifier le solde disponible
    if (portefeuille.soldeDisponible < montant) {
      throw new BadRequestException(
        `Solde insuffisant. Disponible : ${portefeuille.soldeDisponible} FCFA`,
      );
    }

    // 5. Calculer les frais (1% du montant, min 100, max 1000)
    const frais = Math.min(Math.max(Math.floor(montant * 0.01), 100), 1000);
    const montantNet = montant - frais;

    // 6. Générer la référence
    const reference = await this.genererReferenceRetrait();

    // 7. Créer la demande de retrait
    const retrait = this.retraitRepository.create({
      reference,
      montant,
      frais,
      montantNet,
      devise: portefeuille.devise,
      methode,
      numeroDestination,
      nomDestination: nomDestination ?? null,
      statut: 'demande',
      referencePaiement: null,
      raisonRefus: null,
      dateDemande: new Date(),
      dateTraitement: null,
      datePaiement: null,
      geler: 0,
      idusrcreation: idUsrConnecte,
      utilisateur: { id: idUsrConnecte } as UtilisateurEntity,
      portefeuille: { id: portefeuille.id } as PortefeuilleEntity,
    });

    const retraitSaved = await this.retraitRepository.save(retrait);

    // 8. Débiter le portefeuille
    portefeuille.soldeDisponible -= montant;
    portefeuille.dateDernierRetrait = new Date();
    await this.portefeuilleRepository.save(portefeuille);

    return {
      success: true,
      message:
        'Demande de retrait enregistrée. Elle sera traitée sous 24-48h.',
      retrait: this.formaterRetrait(retraitSaved),
      nouveauSolde: portefeuille.soldeDisponible,
    };
  }

  // =========================================================================
  // CONSULTATION
  // =========================================================================

  /**
   * Récupère l'historique des retraits de l'utilisateur.
   *
   * ✅ CORRIGÉ : tri par `dateDemande` (le champ existe dans RetraitEntity),
   * au lieu de `dateCreation` (qui n'existe pas).
   */
  async getMesRetraits(idUsrConnecte: number) {
    const retraits = await this.retraitRepository.find({
      where: { utilisateur: { id: idUsrConnecte }, geler: 0 },
      order: { dateDemande: 'DESC' }, // ✅ CORRECTION APPLIQUÉE
    });

    return {
      success: true,
      count: retraits.length,
      data: retraits.map((r) => this.formaterRetrait(r)),
    };
  }

  /**
   * Récupère le solde du portefeuille de l'utilisateur.
   */
  async getMonPortefeuille(idUsrConnecte: number) {
    const portefeuille = await this.portefeuilleRepository.findOne({
      where: { utilisateur: { id: idUsrConnecte }, geler: 0 },
    });

    if (!portefeuille) {
      throw new NotFoundException('Portefeuille introuvable');
    }

    return {
      success: true,
      data: {
        id: portefeuille.id,
        soldeDisponible: portefeuille.soldeDisponible,
        soldeEnAttente: portefeuille.soldeEnAttente,
        soldeBloque: portefeuille.soldeBloque,
        totalGagne: portefeuille.totalGagne,
        totalRetire: portefeuille.totalRetire,
        devise: portefeuille.devise,
        seuilRetraitMin: portefeuille.seuilRetraitMin,
        iban: portefeuille.iban,
        numeroMobileMoney: portefeuille.numeroMobileMoney,
        operateurMobileMoney: portefeuille.operateurMobileMoney,
      },
    };
  }

  // =========================================================================
  // MÉTHODES INTERNES
  // =========================================================================

  private async genererReferenceRetrait(): Promise<string> {
    const annee = new Date().getFullYear();
    const count = await this.retraitRepository.count();
    const numero = (count + 1).toString().padStart(6, '0');
    return `RTR-${annee}-${numero}`;
  }

  // =========================================================================
  // FORMATAGE
  // =========================================================================

  private formaterRetrait(retrait: RetraitEntity) {
    return {
      id: retrait.id,
      reference: retrait.reference,
      montant: retrait.montant,
      frais: retrait.frais,
      montantNet: retrait.montantNet,
      devise: retrait.devise,
      methode: retrait.methode,
      numeroDestination: retrait.numeroDestination,
      nomDestination: retrait.nomDestination,
      statut: retrait.statut,
      referencePaiement: retrait.referencePaiement,
      raisonRefus: retrait.raisonRefus,
      dateDemande: retrait.dateDemande,
      dateTraitement: retrait.dateTraitement,
      datePaiement: retrait.datePaiement,
    };
  }
} 