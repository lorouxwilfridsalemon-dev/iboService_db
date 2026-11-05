



// import {
//   BadRequestException,
//   ForbiddenException,
//   Injectable,
//   Logger,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, In } from 'typeorm';
// import { MessageService } from '../../database/message/message.service';
// import { MessageEntity } from '../../database/message/message.entity';
// import { AnnonceEntity } from '../../database/annonce/annonce.entity';
// import { NotificationMetierService } from '../notification/notification-metier.service';
// import { MessagesGateway } from './messages.gateway';
 
// // Types de messages qui possèdent un fichier (stocké dans empty3)
// const TYPES_AVEC_FICHIER = ['image', 'video', 'document'];
 
// @Injectable()
// export class MessageMetierService {
//   private readonly logger = new Logger(MessageMetierService.name);
 
//   private readonly _baseUrlFichiers = 'http://192.168.1.34:4007';
 
//   constructor(
//     // Conservé pour compatibilité (plus utilisé pour l'enregistrement)
//     private readonly messageService: MessageService,
 
//     @InjectRepository(MessageEntity)
//     private readonly messageRepository: Repository<MessageEntity>,
 
//     @InjectRepository(AnnonceEntity)
//     private readonly annonceRepository: Repository<AnnonceEntity>,
 
//     private readonly notificationMetierService: NotificationMetierService,
 
//     private readonly messagesGateway: MessagesGateway,
//   ) {}
 
//   // ============================================================
//   // 🔧 UTILITAIRES PRIVÉS
//   // ============================================================
//   private genererConversationId(user1Id: number, user2Id: number): string {
//     const ids = [user1Id, user2Id].sort((a, b) => a - b);
//     return `conv_${ids[0]}_${ids[1]}`;
//   }
 
//   /**
//    * ✅ Enregistre un message DIRECTEMENT via le repository.
//    */
//   private async enregistrerMessage(params: {
//     expediteurId: number;
//     destinataireId: number;
//     contenu: string;
//     typeMessage: string;
//     conversationId: string;
//     nomFichier?: string | null;
//   }): Promise<MessageEntity> {
//     const nomFichier = params.nomFichier
//       ? params.nomFichier.substring(0, 100)
//       : null;
 
//     const entite = this.messageRepository.create({
//       contenu: params.contenu,
//       dateCreation: new Date(),
//       lu: false,
//       statut: 'envoye', // ✅ NOUVEAU : Statut initial
//       geler: 0,
//       idusrcreation: params.expediteurId,
//       expediteur: { id: params.expediteurId } as any,
//       destinataire: { id: params.destinataireId } as any,
//       empty1: params.typeMessage,
//       empty2: params.conversationId,
//       empty3: nomFichier,
//     } as any) as unknown as MessageEntity;
 
//     const sauvegarde: MessageEntity = await this.messageRepository.save(entite);
 
//     // 🔍 Contrôle : relire la ligne réellement enregistrée
//     const verif = await this.messageRepository.findOne({
//       where: { id: sauvegarde.id } as any,
//     });
 
//     const empty1Base = (verif as any)?.empty1 ?? null;
//     const empty3Base = (verif as any)?.empty3 ?? null;
//     const statutBase = (verif as any)?.statut ?? null;
 
//     this.logger.log(
//       `💾 Message ${sauvegarde.id} enregistré — empty1: ${empty1Base} | empty3: ${empty3Base} | statut: ${statutBase}`,
//     );
 
//     // 🛟 Filet de sécurité
//     if (empty1Base !== params.typeMessage || empty3Base !== nomFichier || statutBase !== 'envoye') {
//       this.logger.warn(
//         `⚠️ Valeurs non persistées pour le message ${sauvegarde.id} — correction par UPDATE`,
//       );
//       await this.messageRepository.update(
//         { id: sauvegarde.id } as any,
//         { empty1: params.typeMessage, empty3: nomFichier, statut: 'envoye' } as any,
//       );
//     }
 
//     return sauvegarde;
//   }
 
//   /** ✅ Diffuse un message en temps réel au destinataire ET à l'expéditeur */
//   private diffuserTempsReel(
//     expediteurId: number,
//     destinataireId: number,
//     message: any,
//   ) {
//     try {
//       this.logger.log(
//         `📤 Socket — exp: ${expediteurId} → dest: ${destinataireId} — type: ${message.typeMessage} — fichier: ${message.fichier_url ?? 'aucun'} — id: ${message.id}`,
//       );
//       this.messagesGateway.envoyerMessageAUnUtilisateur(
//         Number(destinataireId),
//         message,
//       );
//       this.messagesGateway.envoyerMessageAUnUtilisateur(
//         Number(expediteurId),
//         message,
//       );
//     } catch (error) {
//       this.logger.error('Echec diffusion temps reel :', error as any);
//     }
//   }
 
//   /** ✅ Crée la notification (sans jamais faire échouer l'envoi) */
//   private async notifier(
//     destinataireId: number,
//     expediteurId: number,
//     texte: string,
//   ) {
//     try {
//       await this.notificationMetierService.creerNotification({
//         idUsr: destinataireId,
//         titre: 'Nouveau message',
//         message: texte.length > 80 ? `${texte.substring(0, 80)}...` : texte,
//         type: 'message',
//         referenceType: 'conversation',
//         referenceId: expediteurId,
//       });
//     } catch (error) {
//       this.logger.error('Echec notification nouveau message :', error as any);
//     }
//   }
 
//   // ============================================================
//   // POST /metier/message/envoyer
//   // ============================================================
//   async envoyerMessage(
//     expediteurId: number,
//     destinataireId: number,
//     contenu: string,
//     options: { typeMessage?: string } = {},
//   ) {
//     if (expediteurId === destinataireId) {
//       throw new BadRequestException(
//         'Vous ne pouvez pas vous envoyer un message a vous-meme.',
//       );
//     }
 
//     const conversationId = this.genererConversationId(
//       expediteurId,
//       destinataireId,
//     );
//     const typeMessage = options.typeMessage || 'texte';
 
//     const resultat = await this.enregistrerMessage({
//       expediteurId,
//       destinataireId,
//       contenu,
//       typeMessage,
//       conversationId,
//       nomFichier: null,
//     });
 
//     await this.notifier(destinataireId, expediteurId, contenu);
 
//     const messagePourTempsReel = {
//       id: resultat.id,
//       contenu: resultat.contenu,
//       fichier_url: null,
//       dateCreation: resultat.dateCreation,
//       lu: false,
//       statut: 'envoye', // ✅ Ajouté
//       expediteurId: Number(expediteurId),
//       destinataireId: Number(destinataireId),
//       conversationId,
//       typeMessage,
//     };
 
//     this.diffuserTempsReel(expediteurId, destinataireId, messagePourTempsReel);
 
//     return {
//       etat: 'succes',
//       message: 'Message envoye avec succes',
//       data: messagePourTempsReel,
//     };
//   }
 
//   // ============================================================
//   // POST /metier/message/envoyer-fichier
//   // ============================================================
//   async envoyerMessageFichier(
//     expediteurId: number,
//     destinataireId: number,
//     fichier: Express.Multer.File,
//     typeMessage: string,
//   ) {
//     if (expediteurId === destinataireId) {
//       throw new BadRequestException(
//         'Vous ne pouvez pas vous envoyer un message a vous-meme.',
//       );
//     }
 
//     if (!fichier || !fichier.filename) {
//       throw new BadRequestException('Fichier manquant');
//     }
 
//     const type = (typeMessage || 'document').toLowerCase().trim();
//     if (!TYPES_AVEC_FICHIER.includes(type)) {
//       throw new BadRequestException(
//         `typeMessage invalide (attendu : ${TYPES_AVEC_FICHIER.join(', ')})`,
//       );
//     }
 
//     const conversationId = this.genererConversationId(
//       expediteurId,
//       destinataireId,
//     );
//     const nomFichier = fichier.filename;
 
//     this.logger.log(
//       `📎 Fichier reçu : ${nomFichier} (${fichier.size} octets) — type: ${type} — chemin: ${fichier.path}`,
//     );
 
//     const contenuDefaut =
//       type === 'image'
//         ? '📷 Photo'
//         : type === 'video'
//           ? '🎥 Vidéo'
//           : '📎 Document';
 
//     const resultat = await this.enregistrerMessage({
//       expediteurId,
//       destinataireId,
//       contenu: contenuDefaut,
//       typeMessage: type,
//       conversationId,
//       nomFichier,
//     });
 
//     await this.notifier(destinataireId, expediteurId, contenuDefaut);
 
//     const messagePourTempsReel = {
//       id: resultat.id,
//       contenu: resultat.contenu,
//       fichier_url: nomFichier.substring(0, 100),
//       dateCreation: resultat.dateCreation,
//       lu: false,
//       statut: 'envoye', // ✅ Ajouté
//       expediteurId: Number(expediteurId),
//       destinataireId: Number(destinataireId),
//       conversationId,
//       typeMessage: type,
//     };
 
//     this.diffuserTempsReel(expediteurId, destinataireId, messagePourTempsReel);
 
//     return {
//       etat: 'succes',
//       message: 'Fichier envoye avec succes',
//       data: messagePourTempsReel,
//     };
//   }
 
//   // ============================================================
//   // POST /metier/message/envoyer-annonce/:annonceId
//   // ============================================================
//   async envoyerMessageAnnonce(
//     expediteurId: number,
//     annonceId: number,
//     contenu: string,
//   ) {
//     const annonce = await this.annonceRepository.findOne({
//       where: { id: annonceId } as any,
//       relations: ['utilisateur'],
//     });
 
//     if (!annonce) {
//       throw new NotFoundException('Annonce introuvable');
//     }
 
//     const proprietaireId = (annonce as any).utilisateur?.id;
//     if (!proprietaireId) {
//       throw new BadRequestException(
//         "Cette annonce n'a pas de proprietaire identifiable.",
//       );
//     }
 
//     if (proprietaireId === expediteurId) {
//       throw new BadRequestException(
//         'Vous ne pouvez pas vous envoyer un message sur votre propre annonce.',
//       );
//     }
 
//     return this.envoyerMessage(expediteurId, proprietaireId, contenu, {
//       typeMessage: 'annonce',
//     });
//   }
 
//   // ============================================================
//   // GET /metier/message/conversations
//   // ============================================================
//   async getConversations(userId: number) {
//     const messages = await this.messageRepository
//       .createQueryBuilder('message')
//       .leftJoinAndSelect('message.expediteur', 'expediteur')
//       .leftJoinAndSelect('message.destinataire', 'destinataire')
//       .where('expediteur.id = :userId OR destinataire.id = :userId', { userId })
//       .andWhere('message.geler = 0')
//       .orderBy('message.dateCreation', 'DESC')
//       .getMany();
 
//     const conversationsMap = new Map<string, any>();
 
//     for (const m of messages) {
//       const convId = (m as any).empty2 as string;
//       if (!convId) continue;
 
//       const estExpediteur = (m as any).expediteur?.id === userId;
//       const autre = estExpediteur
//         ? (m as any).destinataire
//         : (m as any).expediteur;
 
//       if (!conversationsMap.has(convId)) {
//         const nomComplet = [autre?.prenom, autre?.nom]
//           .filter((v) => !!v)
//           .join(' ');
 
//         const avatarUrl =
//           autre?.photo && String(autre.photo).trim().length > 0
//             ? `${this._baseUrlFichiers}/files/profils/${autre.photo}`
//             : '';
 
//         conversationsMap.set(convId, {
//           conversationId: convId,
//           id: autre?.id ?? null,
//           nom: autre?.nom ?? '',
//           prenom: autre?.prenom ?? '',
//           nomComplet: nomComplet || 'Utilisateur',
//           avatar: avatarUrl,
//           telephone: autre?.contact ?? '',
//           enLigne: false,
//           autreUtilisateur: autre
//             ? {
//                 id: autre.id,
//                 nom: autre.nom,
//                 prenom: autre.prenom,
//                 contact: autre.contact,
//                 photo: autre.photo ?? null,
//               }
//             : null,
//           dernierMessage: {
//             contenu: m.contenu,
//             date: m.dateCreation,
//             estExpediteur,
//             typeMessage: (m as any).empty1 || 'texte',
//             statut: (m as any).statut || 'envoye', // ✅ Ajouté
//           },
//           nonLus: 0,
//         });
//       }
 
//       if (!estExpediteur && m.lu !== true) {
//         conversationsMap.get(convId).nonLus += 1;
//       }
//     }
 
//     return {
//       etat: 'succes',
//       message: 'Conversations recuperees',
//       data: Array.from(conversationsMap.values()),
//     };
//   }
 
//   // ============================================================
//   // GET /metier/message/conversation/:autreUserId
//   // ============================================================
//   async getConversation(
//     userId: number,
//     autreUserId: number,
//     page: number,
//     limit: number,
//   ) {
//     const conversationId = this.genererConversationId(userId, autreUserId);
//     const limiteReelle = Math.min(Math.max(limit, 1), 100);
//     const decalage = Math.max(page - 1, 0) * limiteReelle;
 
//     const [messages, total] = await this.messageRepository
//       .createQueryBuilder('message')
//       .leftJoinAndSelect('message.expediteur', 'expediteur')
//       .leftJoinAndSelect('message.destinataire', 'destinataire')
//       .where('message.empty2 = :conversationId', { conversationId })
//       .andWhere('message.geler = 0')
//       .orderBy('message.dateCreation', 'DESC')
//       .skip(decalage)
//       .take(limiteReelle)
//       .getManyAndCount();
 
//     const totalPages = Math.max(Math.ceil(total / limiteReelle), 1);
 
//     return {
//       etat: 'succes',
//       message: 'Conversation recuperee',
//       data: messages.reverse().map((m) => {
//         const typeMessage = ((m as any).empty1 || 'texte') as string;
//         const empty3 = ((m as any).empty3 || null) as string | null;
 
//         const fichierUrl =
//           TYPES_AVEC_FICHIER.includes(typeMessage) && empty3 ? empty3 : null;
 
//         return {
//           id: m.id,
//           contenu: m.contenu,
//           fichier_url: fichierUrl,
//           dateCreation: m.dateCreation,
//           lu: m.lu,
//           statut: (m as any).statut || 'envoye', // ✅ Ajouté
//           expediteurId: (m as any).expediteur?.id ?? null,
//           destinataireId: (m as any).destinataire?.id ?? null,
//           typeMessage,
//         };
//       }),
//       pagination: {
//         page,
//         limit: limiteReelle,
//         total,
//         totalPages,
//         hasMore: decalage + limiteReelle < total,
//       },
//     };
//   }
 
//   // ============================================================
//   // ✅ NOUVEAU : POST /metier/message/marquer-recu/:messageId
//   // ============================================================
//   async marquerMessageRecu(messageId: number) {
//     try {
//       // Mettre à jour uniquement si le message est encore "envoye"
//       await this.messageRepository.update(
//         { id: messageId, statut: 'envoye' } as any,
//         { statut: 'recu' } as any,
//       );
 
//       // Notifier l'expéditeur en temps réel
//       const message = await this.messageRepository.findOne({
//         where: { id: messageId } as any,
//         relations: ['expediteur'],
//       });
 
//       if (message && (message as any).expediteur) {
//         this.messagesGateway.notifierStatutMessage(
//           (message as any).expediteur.id,
//           { messageId: message.id, statut: 'recu' },
//         );
//       }
 
//       return { etat: 'succes', message: 'Message marque comme recu', data: null };
//     } catch (error) {
//       this.logger.error('Echec marquage recu :', error as any);
//       return { etat: 'echec', message: 'Erreur', data: null };
//     }
//   }
 
//   // ============================================================
//   // POST /metier/message/marquer-lu
//   // ============================================================
//   async marquerMessagesLus(messageIds: number[], userId: number) {
//     if (!messageIds || messageIds.length === 0) {
//       return { etat: 'succes', message: 'Aucun message a marquer', data: null };
//     }
 
//     const messages = await this.messageRepository
//       .createQueryBuilder('message')
//       .leftJoinAndSelect('message.destinataire', 'destinataire')
//       .leftJoinAndSelect('message.expediteur', 'expediteur') // ✅ AJOUT
//       .where('message.id IN (:...messageIds)', { messageIds })
//       .getMany();
 
//     const messagesAutorises = messages.filter(
//       (m) => (m as any).destinataire?.id === userId,
//     );
 
//     if (messagesAutorises.length === 0) {
//       return { etat: 'succes', message: 'Aucun message a marquer', data: null };
//     }
 
//     const idsAutorises = messagesAutorises.map((m) => m.id);
 
//     // ✅ Met à jour lu ET statut
//     await this.messageRepository.update(
//       { id: In(idsAutorises) } as any,
//       { lu: true, statut: 'lu' } as any,
//     );
 
//     // ✅ Notifier chaque expéditeur en temps réel
//     for (const m of messagesAutorises) {
//       const expediteurId = (m as any).expediteur?.id;
//       if (expediteurId) {
//         this.messagesGateway.notifierStatutMessage(expediteurId, {
//           messageId: m.id,
//           statut: 'lu',
//         });
//       }
//     }
 
//     return {
//       etat: 'succes',
//       message: `${idsAutorises.length} message(s) marque(s) comme lu(s)`,
//       data: { idsMarques: idsAutorises },
//     };
//   }
 
//   // ============================================================
//   // GET /metier/message/non-lus
//   // ============================================================
//   async getNombreMessagesNonLus(userId: number) {
//     const count = await this.messageRepository
//       .createQueryBuilder('message')
//       .leftJoin('message.destinataire', 'destinataire')
//       .where('destinataire.id = :userId', { userId })
//       .andWhere('message.lu = :lu', { lu: false })
//       .andWhere('message.geler = 0')
//       .getCount();
 
//     return { etat: 'succes', message: '', data: { count } };
//   }
 
//   // ============================================================
//   // GET /metier/message/non-lus/conversations
//   // ============================================================
//   async getMessagesNonLusParConversation(userId: number) {
//     const messages = await this.messageRepository
//       .createQueryBuilder('message')
//       .leftJoin('message.destinataire', 'destinataire')
//       .where('destinataire.id = :userId', { userId })
//       .andWhere('message.lu = :lu', { lu: false })
//       .andWhere('message.geler = 0')
//       .getMany();
 
//     const compteurs: Record<string, number> = {};
//     for (const m of messages) {
//       const convId = (m as any).empty2 as string;
//       if (!convId) continue;
//       compteurs[convId] = (compteurs[convId] || 0) + 1;
//     }
 
//     return { etat: 'succes', message: '', data: compteurs };
//   }
 
//   // ============================================================
//   // GET /metier/message/rechercher
//   // ============================================================
//   async rechercherMessages(
//     userId: number,
//     searchTerm: string,
//     page: number,
//     limit: number,
//   ) {
//     if (!searchTerm || searchTerm.trim().length === 0) {
//       return { etat: 'succes', message: '', data: { messages: [], total: 0 } };
//     }
 
//     const limiteReelle = Math.min(Math.max(limit, 1), 50);
//     const decalage = Math.max(page - 1, 0) * limiteReelle;
 
//     const [messages, total] = await this.messageRepository
//       .createQueryBuilder('message')
//       .leftJoinAndSelect('message.expediteur', 'expediteur')
//       .leftJoinAndSelect('message.destinataire', 'destinataire')
//       .where('(expediteur.id = :userId OR destinataire.id = :userId)', {
//         userId,
//       })
//       .andWhere('message.contenu LIKE :terme', { terme: `%${searchTerm}%` })
//       .andWhere('message.geler = 0')
//       .orderBy('message.dateCreation', 'DESC')
//       .skip(decalage)
//       .take(limiteReelle)
//       .getManyAndCount();
 
//     return {
//       etat: 'succes',
//       message: 'Resultats de recherche',
//       data: {
//         messages: messages.map((m) => ({
//           id: m.id,
//           contenu: m.contenu,
//           dateCreation: m.dateCreation,
//           conversationId: (m as any).empty2,
//           expediteurId: (m as any).expediteur?.id ?? null,
//           destinataireId: (m as any).destinataire?.id ?? null,
//         })),
//         total,
//       },
//     };
//   }
 
//   // ============================================================
//   // DELETE /metier/message/:messageId
//   // ============================================================
//   async supprimerMessage(messageId: number, userId: number) {
//     const message = await this.messageRepository.findOne({
//       where: { id: messageId } as any,
//       relations: ['expediteur'],
//     });
 
//     if (!message) {
//       throw new NotFoundException('Message introuvable');
//     }
 
//     const expediteurId = (message as any).expediteur?.id;
//     if (expediteurId !== userId) {
//       throw new ForbiddenException(
//         'Vous ne pouvez supprimer que vos propres messages.',
//       );
//     }
 
//     await this.messageRepository.delete(messageId);
 
//     return { etat: 'succes', message: 'Message supprime', data: null };
//   }
 
//   // ============================================================
//   // DELETE /metier/message/conversation/:conversationId
//   // ============================================================
//   async supprimerConversation(conversationId: string, userId: number) {
//     const parties = conversationId.replace('conv_', '').split('_');
//     const idsConversation = parties.map((p) => Number(p));
 
//     if (!idsConversation.includes(userId)) {
//       throw new ForbiddenException('Cette conversation ne vous concerne pas.');
//     }
 
//     await this.messageRepository.delete({ empty2: conversationId } as any);
 
//     return { etat: 'succes', message: 'Conversation supprimee', data: null };
//   }
// }


import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MessageService } from '../../database/message/message.service';
import { MessageEntity } from '../../database/message/message.entity';
import { AnnonceEntity } from '../../database/annonce/annonce.entity';
import { NotificationMetierService } from '../notification/notification-metier.service';
import { MessagesGateway } from './messages.gateway';
import { unlink } from 'fs/promises';
import { basename, join } from 'path';
import { UPLOADS_MESSAGES } from '../../upload.config';
 
// Types de messages qui possèdent un fichier (stocké dans empty3)
const TYPES_AVEC_FICHIER = ['image', 'video', 'document'];
 
@Injectable()
export class MessageMetierService {
  private readonly logger = new Logger(MessageMetierService.name);
 
  private readonly _baseUrlFichiers = 'http://192.168.1.34:4007';
 
  constructor(
    // Conservé pour compatibilité (plus utilisé pour l'enregistrement)
    private readonly messageService: MessageService,
 
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
 
    @InjectRepository(AnnonceEntity)
    private readonly annonceRepository: Repository<AnnonceEntity>,
 
    private readonly notificationMetierService: NotificationMetierService,
 
    private readonly messagesGateway: MessagesGateway,
  ) {}
 
  // ============================================================
  // 🔧 UTILITAIRES PRIVÉS
  // ============================================================
  private genererConversationId(user1Id: number, user2Id: number): string {
    const ids = [user1Id, user2Id].sort((a, b) => a - b);
    return `conv_${ids[0]}_${ids[1]}`;
  }
 
  /**
   * ✅ Enregistre un message DIRECTEMENT via le repository (et non via
   * messageService.save) pour garantir que empty1 (type) et empty3
   * (nom du fichier) sont bien persistés. Relit ensuite la ligne en base ;
   * si une valeur manque, elle est forcée par un UPDATE explicite.
   */
  private async enregistrerMessage(params: {
    expediteurId: number;
    destinataireId: number;
    contenu: string;
    typeMessage: string;
    conversationId: string;
    nomFichier?: string | null;
  }): Promise<MessageEntity> {
    const nomFichier = params.nomFichier
      ? params.nomFichier.substring(0, 100)
      : null;
 
    const entite = this.messageRepository.create({
      contenu: params.contenu,
      dateCreation: new Date(),
      lu: false,
      geler: 0,
      idusrcreation: params.expediteurId,
      expediteur: { id: params.expediteurId } as any,
      destinataire: { id: params.destinataireId } as any,
      empty1: params.typeMessage,
      empty2: params.conversationId,
      empty3: nomFichier,
    } as any) as unknown as MessageEntity;
 
    const sauvegarde: MessageEntity = await this.messageRepository.save(entite);
 
    // 🔍 Contrôle : relire la ligne réellement enregistrée
    const verif = await this.messageRepository.findOne({
      where: { id: sauvegarde.id } as any,
    });
 
    const empty1Base = (verif as any)?.empty1 ?? null;
    const empty3Base = (verif as any)?.empty3 ?? null;
 
    this.logger.log(
      `💾 Message ${sauvegarde.id} enregistré — empty1: ${empty1Base} | empty3: ${empty3Base}`,
    );
 
    // 🛟 Filet de sécurité : si la base n'a pas pris les valeurs, on force
    if (empty1Base !== params.typeMessage || empty3Base !== nomFichier) {
      this.logger.warn(
        `⚠️ Valeurs non persistées pour le message ${sauvegarde.id} ` +
          `(attendu empty1=${params.typeMessage}, empty3=${nomFichier}) — correction par UPDATE`,
      );
      await this.messageRepository.update(
        { id: sauvegarde.id } as any,
        { empty1: params.typeMessage, empty3: nomFichier } as any,
      );
    }
 
    return sauvegarde;
  }
 
  /** ✅ Diffuse un message en temps réel au destinataire ET à l'expéditeur */
  private diffuserTempsReel(
    expediteurId: number,
    destinataireId: number,
    message: any,
  ) {
    try {
      this.logger.log(
        `📤 Socket — exp: ${expediteurId} → dest: ${destinataireId} — type: ${message.typeMessage} — fichier: ${message.fichier_url ?? 'aucun'} — id: ${message.id}`,
      );
      this.messagesGateway.envoyerMessageAUnUtilisateur(
        Number(destinataireId),
        message,
      );
      this.messagesGateway.envoyerMessageAUnUtilisateur(
        Number(expediteurId),
        message,
      );
    } catch (error) {
      this.logger.error('Echec diffusion temps reel :', error as any);
    }
  }
 
  /** ✅ Crée la notification (sans jamais faire échouer l'envoi) */
  private async notifier(
    destinataireId: number,
    expediteurId: number,
    texte: string,
  ) {
    try {
      await this.notificationMetierService.creerNotification({
        idUsr: destinataireId,
        titre: 'Nouveau message',
        message: texte.length > 80 ? `${texte.substring(0, 80)}...` : texte,
        type: 'message',
        referenceType: 'conversation',
        referenceId: expediteurId,
      });
    } catch (error) {
      this.logger.error('Echec notification nouveau message :', error as any);
    }
  }
 
  // ============================================================
  // POST /metier/message/envoyer
  // ============================================================
  async envoyerMessage(
    expediteurId: number,
    destinataireId: number,
    contenu: string,
    options: { typeMessage?: string } = {},
  ) {
    if (expediteurId === destinataireId) {
      throw new BadRequestException(
        'Vous ne pouvez pas vous envoyer un message a vous-meme.',
      );
    }
 
    const conversationId = this.genererConversationId(
      expediteurId,
      destinataireId,
    );
    const typeMessage = options.typeMessage || 'texte';
 
    const resultat = await this.enregistrerMessage({
      expediteurId,
      destinataireId,
      contenu,
      typeMessage,
      conversationId,
      nomFichier: null,
    });
 
    await this.notifier(destinataireId, expediteurId, contenu);
 
    const messagePourTempsReel = {
      id: resultat.id,
      contenu: resultat.contenu,
      fichier_url: null,
      dateCreation: resultat.dateCreation,
      lu: false,
      expediteurId: Number(expediteurId),
      destinataireId: Number(destinataireId),
      conversationId,
      typeMessage,
    };
 
    this.diffuserTempsReel(expediteurId, destinataireId, messagePourTempsReel);
 
    return {
      etat: 'succes',
      message: 'Message envoye avec succes',
      data: messagePourTempsReel,
    };
  }
 
  // ============================================================
  // POST /metier/message/envoyer-fichier
  // ✅ Envoyer un message avec un fichier (image, vidéo, document)
  // ============================================================
  async envoyerMessageFichier(
    expediteurId: number,
    destinataireId: number,
    fichier: Express.Multer.File,
    typeMessage: string,
  ) {
    if (expediteurId === destinataireId) {
      throw new BadRequestException(
        'Vous ne pouvez pas vous envoyer un message a vous-meme.',
      );
    }
 
    if (!fichier || !fichier.filename) {
      throw new BadRequestException('Fichier manquant');
    }
 
    const type = (typeMessage || 'document').toLowerCase().trim();
    if (!TYPES_AVEC_FICHIER.includes(type)) {
      throw new BadRequestException(
        `typeMessage invalide (attendu : ${TYPES_AVEC_FICHIER.join(', ')})`,
      );
    }
 
    const conversationId = this.genererConversationId(
      expediteurId,
      destinataireId,
    );
    const nomFichier = fichier.filename;
 
    this.logger.log(
      `📎 Fichier reçu : ${nomFichier} (${fichier.size} octets) — type: ${type} — chemin: ${fichier.path}`,
    );
 
    const contenuDefaut =
      type === 'image'
        ? '📷 Photo'
        : type === 'video'
          ? '🎥 Vidéo'
          : '📎 Document';
 
    const resultat = await this.enregistrerMessage({
      expediteurId,
      destinataireId,
      contenu: contenuDefaut,
      typeMessage: type,
      conversationId,
      nomFichier,
    });
 
    await this.notifier(destinataireId, expediteurId, contenuDefaut);
 
    const messagePourTempsReel = {
      id: resultat.id,
      contenu: resultat.contenu,
      fichier_url: nomFichier.substring(0, 100),
      dateCreation: resultat.dateCreation,
      lu: false,
      expediteurId: Number(expediteurId),
      destinataireId: Number(destinataireId),
      conversationId,
      typeMessage: type,
    };
 
    this.diffuserTempsReel(expediteurId, destinataireId, messagePourTempsReel);
 
    return {
      etat: 'succes',
      message: 'Fichier envoye avec succes',
      data: messagePourTempsReel,
    };
  }
 
  // ============================================================
  // POST /metier/message/envoyer-annonce/:annonceId
  // ============================================================
  async envoyerMessageAnnonce(
    expediteurId: number,
    annonceId: number,
    contenu: string,
  ) {
    const annonce = await this.annonceRepository.findOne({
      where: { id: annonceId } as any,
      relations: ['utilisateur'],
    });
 
    if (!annonce) {
      throw new NotFoundException('Annonce introuvable');
    }
 
    const proprietaireId = (annonce as any).utilisateur?.id;
    if (!proprietaireId) {
      throw new BadRequestException(
        "Cette annonce n'a pas de proprietaire identifiable.",
      );
    }
 
    if (proprietaireId === expediteurId) {
      throw new BadRequestException(
        'Vous ne pouvez pas vous envoyer un message sur votre propre annonce.',
      );
    }
 
    return this.envoyerMessage(expediteurId, proprietaireId, contenu, {
      typeMessage: 'annonce',
    });
  }
 
  // ============================================================
  // GET /metier/message/conversations
  // ============================================================
  async getConversations(userId: number) {
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.expediteur', 'expediteur')
      .leftJoinAndSelect('message.destinataire', 'destinataire')
      .where('expediteur.id = :userId OR destinataire.id = :userId', { userId })
      .andWhere('message.geler = 0')
      .orderBy('message.dateCreation', 'DESC')
      .getMany();
 
    const conversationsMap = new Map<string, any>();
 
    for (const m of messages) {
      const convId = (m as any).empty2 as string;
      if (!convId) continue;
 
      const estExpediteur = (m as any).expediteur?.id === userId;
      const autre = estExpediteur
        ? (m as any).destinataire
        : (m as any).expediteur;
 
      if (!conversationsMap.has(convId)) {
        const nomComplet = [autre?.prenom, autre?.nom]
          .filter((v) => !!v)
          .join(' ');
 
        const avatarUrl =
          autre?.photo && String(autre.photo).trim().length > 0
            ? `${this._baseUrlFichiers}/files/profils/${autre.photo}`
            : '';
 
        conversationsMap.set(convId, {
          conversationId: convId,
          id: autre?.id ?? null,
          nom: autre?.nom ?? '',
          prenom: autre?.prenom ?? '',
          nomComplet: nomComplet || 'Utilisateur',
          avatar: avatarUrl,
          telephone: autre?.contact ?? '',
          enLigne: false,
          autreUtilisateur: autre
            ? {
                id: autre.id,
                nom: autre.nom,
                prenom: autre.prenom,
                contact: autre.contact,
                photo: autre.photo ?? null,
              }
            : null,
          dernierMessage: {
            contenu: m.contenu,
            date: m.dateCreation,
            estExpediteur,
            typeMessage: (m as any).empty1 || 'texte',
          },
          nonLus: 0,
        });
      }
 
      if (!estExpediteur && m.lu !== true) {
        conversationsMap.get(convId).nonLus += 1;
      }
    }
 
    return {
      etat: 'succes',
      message: 'Conversations recuperees',
      data: Array.from(conversationsMap.values()),
    };
  }
 
  // ============================================================
  // GET /metier/message/conversation/:autreUserId
  // ============================================================
  async getConversation(
    userId: number,
    autreUserId: number,
    page: number,
    limit: number,
  ) {
    const conversationId = this.genererConversationId(userId, autreUserId);
    const limiteReelle = Math.min(Math.max(limit, 1), 100);
    const decalage = Math.max(page - 1, 0) * limiteReelle;
 
    const [messages, total] = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.expediteur', 'expediteur')
      .leftJoinAndSelect('message.destinataire', 'destinataire')
      .where('message.empty2 = :conversationId', { conversationId })
      .andWhere('message.geler = 0')
      .orderBy('message.dateCreation', 'DESC')
      .skip(decalage)
      .take(limiteReelle)
      .getManyAndCount();
 
    const totalPages = Math.max(Math.ceil(total / limiteReelle), 1);
 
    return {
      etat: 'succes',
      message: 'Conversation recuperee',
      data: messages.reverse().map((m) => {
        const typeMessage = ((m as any).empty1 || 'texte') as string;
        const empty3 = ((m as any).empty3 || null) as string | null;
 
        // ✅ empty3 n'est exposé comme fichier que pour les types fichier
        // (évite d'envoyer une autre métadonnée comme une date de lecture)
        const fichierUrl =
          TYPES_AVEC_FICHIER.includes(typeMessage) && empty3 ? empty3 : null;
 
        return {
          id: m.id,
          contenu: m.contenu,
          fichier_url: fichierUrl,
          dateCreation: m.dateCreation,
          lu: m.lu,
          expediteurId: (m as any).expediteur?.id ?? null,
          destinataireId: (m as any).destinataire?.id ?? null,
          typeMessage,
        };
      }),
      pagination: {
        page,
        limit: limiteReelle,
        total,
        totalPages,
        hasMore: decalage + limiteReelle < total,
      },
    };
  }
 
  // ============================================================
  // POST /metier/message/marquer-lu
  // ============================================================
  async marquerMessagesLus(messageIds: number[], userId: number) {
    if (!messageIds || messageIds.length === 0) {
      return { etat: 'succes', message: 'Aucun message a marquer', data: null };
    }
 
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.destinataire', 'destinataire')
      .where('message.id IN (:...messageIds)', { messageIds })
      .getMany();
 
    const idsAutorises = messages
      .filter((m) => (m as any).destinataire?.id === userId)
      .map((m) => m.id);
 
    if (idsAutorises.length === 0) {
      return { etat: 'succes', message: 'Aucun message a marquer', data: null };
    }
 
    // ✅ Met à jour UNIQUEMENT la colonne "lu" (empty3 reste intact)
    await this.messageRepository.update(
      { id: In(idsAutorises) } as any,
      { lu: true } as any,
    );
 
    return {
      etat: 'succes',
      message: `${idsAutorises.length} message(s) marque(s) comme lu(s)`,
      data: { idsMarques: idsAutorises },
    };
  }
 
  // ============================================================
  // GET /metier/message/non-lus
  // ============================================================
  async getNombreMessagesNonLus(userId: number) {
    const count = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.destinataire', 'destinataire')
      .where('destinataire.id = :userId', { userId })
      .andWhere('message.lu = :lu', { lu: false })
      .andWhere('message.geler = 0')
      .getCount();
 
    return { etat: 'succes', message: '', data: { count } };
  }
 
  // ============================================================
  // GET /metier/message/non-lus/conversations
  // ============================================================
  async getMessagesNonLusParConversation(userId: number) {
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.destinataire', 'destinataire')
      .where('destinataire.id = :userId', { userId })
      .andWhere('message.lu = :lu', { lu: false })
      .andWhere('message.geler = 0')
      .getMany();
 
    const compteurs: Record<string, number> = {};
    for (const m of messages) {
      const convId = (m as any).empty2 as string;
      if (!convId) continue;
      compteurs[convId] = (compteurs[convId] || 0) + 1;
    }
 
    return { etat: 'succes', message: '', data: compteurs };
  }
 
  // ============================================================
  // GET /metier/message/rechercher
  // ============================================================
  async rechercherMessages(
    userId: number,
    searchTerm: string,
    page: number,
    limit: number,
  ) {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return { etat: 'succes', message: '', data: { messages: [], total: 0 } };
    }
 
    const limiteReelle = Math.min(Math.max(limit, 1), 50);
    const decalage = Math.max(page - 1, 0) * limiteReelle;
 
    const [messages, total] = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.expediteur', 'expediteur')
      .leftJoinAndSelect('message.destinataire', 'destinataire')
      .where('(expediteur.id = :userId OR destinataire.id = :userId)', {
        userId,
      })
      .andWhere('message.contenu LIKE :terme', { terme: `%${searchTerm}%` })
      .andWhere('message.geler = 0')
      .orderBy('message.dateCreation', 'DESC')
      .skip(decalage)
      .take(limiteReelle)
      .getManyAndCount();
 
    return {
      etat: 'succes',
      message: 'Resultats de recherche',
      data: {
        messages: messages.map((m) => ({
          id: m.id,
          contenu: m.contenu,
          dateCreation: m.dateCreation,
          conversationId: (m as any).empty2,
          expediteurId: (m as any).expediteur?.id ?? null,
          destinataireId: (m as any).destinataire?.id ?? null,
        })),
        total,
      },
    };
  }
 
  // ============================================================
  // 🔧 Supprime les fichiers du disque (n'échoue jamais la requête)
  // ============================================================
  private async supprimerFichiersDisque(messages: MessageEntity[]) {
    for (const m of messages) {
      const type = (((m as any).empty1 as string) || '').trim();
      const nom = (((m as any).empty3 as string) || '').trim();
      if (!TYPES_AVEC_FICHIER.includes(type) || !nom) continue;
 
      try {
        // basename() empêche toute sortie du dossier uploads/messages
        await unlink(join(UPLOADS_MESSAGES, basename(nom)));
      } catch (error: any) {
        if (error?.code !== 'ENOENT') {
          this.logger.warn(
            `⚠️ Fichier non supprimé (${nom}) : ${error?.message}`,
          );
        }
      }
    }
  }
 
  // ============================================================
  // POST /metier/message/supprimer-multiple
  // Supprime plusieurs messages (uniquement ceux de l'utilisateur)
  // ============================================================
  async supprimerMessages(messageIds: number[], userId: number) {
    const ids = [
      ...new Set(
        (messageIds || [])
          .map((n) => Number(n))
          .filter((n) => Number.isSafeInteger(n) && n > 0),
      ),
    ];
 
    if (ids.length === 0) {
      throw new BadRequestException('Aucun message a supprimer');
    }
    if (ids.length > 100) {
      throw new BadRequestException('Maximum 100 messages a la fois');
    }
 
    const messages = await this.messageRepository.find({
      where: { id: In(ids) } as any,
      relations: ['expediteur', 'destinataire'],
    });
 
    if (messages.length === 0) {
      throw new NotFoundException('Message(s) introuvable(s)');
    }
 
    // ✅ Seuls les messages envoyés par l'utilisateur peuvent être supprimés
    const autorises = messages.filter(
      (m) => (m as any).expediteur?.id === userId,
    );
 
    if (autorises.length === 0) {
      throw new ForbiddenException(
        'Vous ne pouvez supprimer que vos propres messages.',
      );
    }
 
    const idsAutorises = autorises.map((m) => m.id);
 
    await this.messageRepository.delete(idsAutorises as any);
    await this.supprimerFichiersDisque(autorises);
 
    // ✅ Prévenir en temps réel l'autre personne (et mes autres appareils)
    const personnes = new Set<number>([userId]);
    for (const m of autorises) {
      const destId = (m as any).destinataire?.id;
      if (destId) personnes.add(Number(destId));
    }
    for (const personneId of personnes) {
      this.messagesGateway.emettreEvenement(personneId, 'messages_supprimes', {
        ids: idsAutorises,
      });
    }
 
    this.logger.log(
      `🗑️ ${idsAutorises.length} message(s) supprimé(s) par l'utilisateur ${userId}`,
    );
 
    return {
      etat: 'succes',
      message: `${idsAutorises.length} message(s) supprime(s)`,
      data: {
        idsSupprimes: idsAutorises,
        idsRefuses: ids.filter((id) => !idsAutorises.includes(id)),
      },
    };
  }
 
  // ============================================================
  // DELETE /metier/message/:messageId
  // ============================================================
  async supprimerMessage(messageId: number, userId: number) {
    const resultat = await this.supprimerMessages([messageId], userId);
    return { ...resultat, message: 'Message supprime' };
  }
 
  // ============================================================
  // DELETE /metier/message/conversation/:conversationId
  // ============================================================
  async supprimerConversation(conversationId: string, userId: number) {
    const parties = conversationId.replace('conv_', '').split('_');
    const idsConversation = parties.map((p) => Number(p));
 
    if (
      idsConversation.length !== 2 ||
      idsConversation.some((n) => !Number.isSafeInteger(n) || n <= 0)
    ) {
      throw new BadRequestException('Identifiant de conversation invalide');
    }
 
    if (!idsConversation.includes(userId)) {
      throw new ForbiddenException('Cette conversation ne vous concerne pas.');
    }
 
    const messages = await this.messageRepository.find({
      where: { empty2: conversationId } as any,
    });
 
    await this.messageRepository.delete({ empty2: conversationId } as any);
    await this.supprimerFichiersDisque(messages);
 
    for (const personneId of idsConversation) {
      this.messagesGateway.emettreEvenement(personneId, 'conversation_supprimee', {
        conversationId,
      });
    }
 
    return { etat: 'succes', message: 'Conversation supprimee', data: null };
  }
} 