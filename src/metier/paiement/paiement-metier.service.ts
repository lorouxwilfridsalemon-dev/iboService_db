import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { TransactionEntity } from '../../database/transaction/transaction.entity';
import { PaiementMobileEntity } from '../../database/paiement_mobile/paiement_mobile.entity';
import { AbonnementEntity } from '../../database/abonnement/abonnement.entity';
import { BoostEntity } from '../../database/boost/boost.entity';

// ✅ AJOUT : import Wave
import { WaveMoneyService } from './services/wave-money.service';

@Injectable()
export class PaiementMetierService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,

    @InjectRepository(PaiementMobileEntity)
    private readonly paiementRepository: Repository<PaiementMobileEntity>,

    @InjectRepository(AbonnementEntity)
    private readonly abonnementRepository: Repository<AbonnementEntity>,

    @InjectRepository(BoostEntity)
    private readonly boostRepository: Repository<BoostEntity>,

    // ✅ AJOUT
    private readonly waveMoneyService: WaveMoneyService,
    private readonly configService: ConfigService,
  ) {}

  // =========================================================================
  // INITIER UN PAIEMENT (méthode générique — ancienne)
  // =========================================================================

  async initierPaiement(
    transactionId: number,
    operateur: string,
    numeroPayeur: string,
    idUsrConnecte: number,
  ) {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId, geler: 0 },
      relations: ['utilisateur'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction introuvable');
    }

    if (transaction.utilisateur?.id !== idUsrConnecte) {
      throw new BadRequestException(
        'Vous n\'êtes pas autorisé à payer cette transaction',
      );
    }

    if (transaction.statut !== 'en_attente') {
      throw new BadRequestException(
        `Cette transaction est déjà ${transaction.statut}`,
      );
    }

    const paiement = this.paiementRepository.create({
      operateur,
      transactionIdOperateur: null,
      referenceOperateur: null,
      numeroPayeur,
      numeroBeneficiaire: null,
      montant: transaction.montant,
      fraisOperateur: 0,
      montantNet: transaction.montant,
      devise: transaction.devise,
      statut: 'initie',
      codeErreur: null,
      messageErreur: null,
      callbackData: null,
      dateInitiation: new Date(),
      dateConfirmation: null,
      dateCreation: new Date(),
      geler: 0,
      idusrcreation: idUsrConnecte,
      transaction: { id: transactionId } as TransactionEntity,
    });

    const paiementSaved = await this.paiementRepository.save(paiement);

    transaction.statut = 'en_cours';
    transaction.methodePaiement = operateur;
    await this.transactionRepository.save(transaction);

    paiementSaved.transactionIdOperateur = `SIM-${Date.now()}`;
    paiementSaved.referenceOperateur = paiementSaved.transactionIdOperateur;
    paiementSaved.statut = 'en_cours';
    await this.paiementRepository.save(paiementSaved);

    return {
      success: true,
      message: 'Paiement initié. Veuillez confirmer sur votre téléphone.',
      paiement: {
        id: paiementSaved.id,
        operateur: paiementSaved.operateur,
        numeroPayeur: paiementSaved.numeroPayeur,
        montant: paiementSaved.montant,
        devise: paiementSaved.devise,
        statut: paiementSaved.statut,
      },
      transactionId: transaction.id,
    };
  }

  // =========================================================================
  // WAVE — INITIER UN PAIEMENT
  // =========================================================================

  async initierPaiementWave(
    transactionId: number,
    idUsrConnecte: number,
  ) {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId, geler: 0 },
      relations: ['utilisateur'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction introuvable');
    }

    if (transaction.utilisateur?.id !== idUsrConnecte) {
      throw new BadRequestException('Non autorisé');
    }

    if (transaction.statut !== 'en_attente') {
      throw new BadRequestException(
        `Cette transaction est déjà ${transaction.statut}`,
      );
    }

    const appUrl =
      this.configService.get<string>('APP_URL') || 'http://localhost:4007';

    const waveSession = await this.waveMoneyService.creerSessionCheckout(
      transaction.montant,
      transaction.reference,
      `${appUrl}/paiement/success`,
      `${appUrl}/paiement/error`,
    );

    const paiement = this.paiementRepository.create({
      operateur: 'wave',
      transactionIdOperateur: waveSession.checkoutId,
      referenceOperateur: waveSession.checkoutId,
      numeroPayeur: null,
      numeroBeneficiaire: null,
      montant: transaction.montant,
      fraisOperateur: 0,
      montantNet: transaction.montant,
      devise: transaction.devise,
      statut: 'initie',
      codeErreur: null,
      messageErreur: null,
      callbackData: null,
      dateInitiation: new Date(),
      dateConfirmation: null,
      dateCreation: new Date(),
      geler: 0,
      idusrcreation: idUsrConnecte,
      transaction: { id: transactionId } as TransactionEntity,
    });

    await this.paiementRepository.save(paiement);

    transaction.statut = 'en_cours';
    transaction.methodePaiement = 'wave';
    await this.transactionRepository.save(transaction);

    return {
      success: true,
      message: 'Redirection vers Wave...',
      waveLaunchUrl: waveSession.waveLaunchUrl,
      transactionId: transaction.id,
      whenExpires: waveSession.whenExpires,
    };
  }

  // =========================================================================
  // WAVE — TRAITER LE CALLBACK
  // =========================================================================

  async traiterCallbackWave(body: any) {
    const checkoutId = body?.data?.id || body?.id;
    const paymentStatus = body?.data?.payment_status;

    if (!checkoutId) {
      return { success: false, message: 'checkoutId manquant' };
    }

    const paiement = await this.paiementRepository.findOne({
      where: { transactionIdOperateur: checkoutId, geler: 0 },
      relations: ['transaction'],
    });

    if (!paiement) {
      return { success: false, message: 'Paiement introuvable' };
    }

    if (paiement.statut === 'succes') {
      return { success: true, message: 'Déjà traité' };
    }

    paiement.callbackData = JSON.stringify(body);

    if (paymentStatus === 'succeeded') {
      paiement.statut = 'succes';
      paiement.dateConfirmation = new Date();
      await this.paiementRepository.save(paiement);

      await this.validerTransaction(paiement.transaction.id);

      return { success: true, message: 'Paiement confirmé' };
    } else if (paymentStatus === 'failed') {
      paiement.statut = 'echec';
      paiement.messageErreur = 'Paiement échoué';
      paiement.dateConfirmation = new Date();
      await this.paiementRepository.save(paiement);

      await this.echouerTransaction(
        paiement.transaction.id,
        'Paiement Wave échoué',
      );

      return { success: true, message: 'Paiement échoué' };
    }

    await this.paiementRepository.save(paiement);
    return { success: true, message: 'Statut non reconnu' };
  }

  // =========================================================================
  // CALLBACK GÉNÉRIQUE (ancien)
  // =========================================================================

  async traiterCallback(body: any) {
    const transactionIdOperateur =
      body.transaction_id || body.txid || body.reference;
    const statut = body.status || body.statut;

    if (!transactionIdOperateur) {
      return {
        success: false,
        message: 'transaction_id manquant',
      };
    }

    const paiement = await this.paiementRepository.findOne({
      where: { transactionIdOperateur, geler: 0 },
      relations: ['transaction'],
    });

    if (!paiement) {
      return {
        success: false,
        message: 'Paiement introuvable',
      };
    }

    paiement.callbackData = JSON.stringify(body);

    if (statut === 'success' || statut === 'succes' || statut === 'SUCCESS') {
      paiement.statut = 'succes';
      paiement.dateConfirmation = new Date();
      await this.paiementRepository.save(paiement);

      await this.validerTransaction(paiement.transaction.id);

      return { success: true, message: 'Paiement confirmé' };
    } else {
      paiement.statut = 'echec';
      paiement.messageErreur = body.message || 'Échec du paiement';
      paiement.dateConfirmation = new Date();
      await this.paiementRepository.save(paiement);

      await this.echouerTransaction(
        paiement.transaction.id,
        paiement.messageErreur,
      );

      return { success: true, message: 'Paiement échoué' };
    }
  }

  // =========================================================================
  // VALIDATION
  // =========================================================================

  async validerTransaction(transactionId: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
    });

    if (!transaction || transaction.statut === 'succes') {
      return;
    }

    transaction.statut = 'succes';
    transaction.dateValidation = new Date();
    await this.transactionRepository.save(transaction);

    const metadata = transaction.metadata
      ? JSON.parse(transaction.metadata)
      : {};

    if (transaction.type === 'abonnement' && metadata.abonnementId) {
      await this.activerAbonnement(metadata.abonnementId);
    }

    if (transaction.type === 'boost' && metadata.boostId) {
      await this.activerBoost(metadata.boostId);
    }
  }

  private async echouerTransaction(transactionId: number, erreur: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
    });

    if (!transaction) return;

    transaction.statut = 'echec';
    transaction.erreur = erreur;
    await this.transactionRepository.save(transaction);
  }

  private async activerAbonnement(abonnementId: number) {
    const abonnement = await this.abonnementRepository.findOne({
      where: { id: abonnementId },
    });

    if (!abonnement) return;

    abonnement.statut = 'actif';
    await this.abonnementRepository.save(abonnement);
  }

  private async activerBoost(boostId: number) {
    const boost = await this.boostRepository.findOne({
      where: { id: boostId },
    });

    if (!boost) return;

    boost.statut = 'actif';
    boost.dateDebut = new Date();
    boost.dateFin = new Date(
      boost.dateDebut.getTime() + boost.dureeHeures * 60 * 60 * 1000,
    );
    await this.boostRepository.save(boost);
  }
} 