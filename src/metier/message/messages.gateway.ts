
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
 
@WebSocketGateway({
  cors: { origin: '*' }, // ⚠️ à restreindre en production si besoin
  // Pas de "namespace" personnalisé : le client Flutter se connecte sur
  // l'URL racine du serveur (même port que l'API REST).
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(MessagesGateway.name);
 
  @WebSocketServer()
  server: Server;
 
  // ✅ Un utilisateur peut avoir plusieurs sockets connectés (plusieurs
  // appareils, ou l'app + un onglet web) — d'où le tableau de sockets
  // par ID utilisateur, plutôt qu'un seul socket.
  private readonly socketsParUtilisateur = new Map<number, Set<string>>();
 
  // ============================================================
  // CONNEXION
  // ============================================================
  handleConnection(client: Socket) {
    try {
      const token =
        (client.handshake.auth?.token as string) ||
        (client.handshake.query?.token as string);
 
      if (!token) {
        this.logger.warn(
          `❌ Connexion WebSocket refusée (pas de token) : ${client.id}`,
        );
        client.disconnect();
        return;
      }
 
      const secret =
        process.env.JWT_SECRET || 'change_this_secret_before_production';
 
      const payload = jwt.verify(token, secret) as { id: number | string };
      const userId = Number(payload.id);
 
      if (!Number.isSafeInteger(userId) || userId <= 0) {
        this.logger.warn(
          `❌ Identifiant utilisateur invalide : ${payload.id}`,
        );
        client.disconnect();
        return;
      }
 
      (client as any).userId = userId;
 
      if (!this.socketsParUtilisateur.has(userId)) {
        this.socketsParUtilisateur.set(userId, new Set<string>());
      }
 
      this.socketsParUtilisateur.get(userId)!.add(client.id);
 
      this.logger.log(
        `✅ Utilisateur ${userId} connecté (socket ${client.id})`,
      );
    } catch (error: any) {
      this.logger.warn(
        `❌ Connexion WebSocket refusée (token invalide) : ${error?.message}`,
      );
      client.disconnect();
    }
  }
 
  // ============================================================
  // DÉCONNEXION
  // ============================================================
  handleDisconnect(client: Socket) {
    const userId = (client as any).userId as number | undefined;
 
    if (userId && this.socketsParUtilisateur.has(userId)) {
      this.socketsParUtilisateur.get(userId)!.delete(client.id);
 
      if (this.socketsParUtilisateur.get(userId)!.size === 0) {
        this.socketsParUtilisateur.delete(userId);
      }
 
      this.logger.log(
        `❌ Utilisateur ${userId} déconnecté (socket ${client.id})`,
      );
    }
  }
 
  // ============================================================
  // ENVOI DE MESSAGE
  // ============================================================
  envoyerMessageAUnUtilisateur(destinataireId: number, message: any) {
    const destId = Number(destinataireId);
 
    if (!Number.isSafeInteger(destId) || destId <= 0) {
      this.logger.warn(
        `⚠️ envoyerMessageAUnUtilisateur : destinataireId invalide (${destinataireId})`,
      );
      return;
    }
 
    const sockets = this.socketsParUtilisateur.get(destId);
 
    this.logger.log(
      `📤 Envoi à user ${destId} — sockets: ${
        sockets ? sockets.size : 0
      } — Type: ${message?.typeMessage ?? 'inconnu'} — Fichier: ${
        message?.fichier_url ?? 'aucun'
      } — Id: ${message?.id ?? '?'}`,
    );
 
    if (!sockets || sockets.size === 0) {
      this.logger.warn(
        `⚠️ User ${destId} NON connecté. Utilisateurs actifs : [${Array.from(
          this.socketsParUtilisateur.keys(),
        ).join(', ')}]`,
      );
      return;
    }
 
    for (const socketId of sockets) {
      this.server.to(socketId).emit('nouveau_message', message);
    }
 
    this.logger.log(
      `✅ Message ${message?.id ?? '?'} diffusé à ${sockets.size} socket(s) de l'utilisateur ${destId}`,
    );
  }
 
  // ============================================================
  // ✅ NOUVEAU : ÉVÉNEMENT GÉNÉRIQUE (suppressions, etc.)
  // ============================================================
  /**
   * Envoie un événement quelconque à tous les sockets d'un utilisateur.
   * Utilisé pour : 'messages_supprimes', 'conversation_supprimee'.
   * Ne fait rien si l'utilisateur n'est pas connecté.
   */
  emettreEvenement(utilisateurId: number, evenement: string, donnees: any) {
    const id = Number(utilisateurId);
    if (!Number.isSafeInteger(id) || id <= 0) return;
 
    const sockets = this.socketsParUtilisateur.get(id);
    if (!sockets || sockets.size === 0) return;
 
    for (const socketId of sockets) {
      this.server.to(socketId).emit(evenement, donnees);
    }
 
    this.logger.log(
      `📡 Événement "${evenement}" envoyé à ${sockets.size} socket(s) de l'utilisateur ${id}`,
    );
  }
 
  // ============================================================
  // NOTIFICATION DE CONVERSATION
  // ============================================================
  notifierNouvelleConversation(destinataireId: number) {
    const destId = Number(destinataireId);
 
    if (!Number.isSafeInteger(destId) || destId <= 0) {
      this.logger.warn(
        `⚠️ notifierNouvelleConversation : destinataireId invalide (${destinataireId})`,
      );
      return;
    }
 
    const sockets = this.socketsParUtilisateur.get(destId);
    if (!sockets || sockets.size === 0) return;
 
    for (const socketId of sockets) {
      this.server.to(socketId).emit('conversation_mise_a_jour');
    }
 
    this.logger.log(
      `🔔 Conversation mise à jour notifiée à ${sockets.size} socket(s) de l'utilisateur ${destId}`,
    );
  }
} 







// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { Logger } from '@nestjs/common';
// import * as jwt from 'jsonwebtoken';

// @WebSocketGateway({
//   cors: { origin: '*' }, // ⚠️ à restreindre en production si besoin
//   // Pas de "namespace" personnalisé : le client Flutter se connecte sur
//   // l'URL racine du serveur (même port que l'API REST).
// })
// export class MessagesGateway
//   implements OnGatewayConnection, OnGatewayDisconnect
// {
//   private readonly logger = new Logger(MessagesGateway.name);

//   @WebSocketServer()
//   server: Server;

//   // ✅ Un utilisateur peut avoir plusieurs sockets connectés (plusieurs
//   // appareils, ou l'app + un onglet web) — d'où le tableau de sockets
//   // par ID utilisateur, plutôt qu'un seul socket.
//   private readonly socketsParUtilisateur = new Map<number, Set<string>>();

//   // ============================================================
//   // CONNEXION
//   // ============================================================
//   /**
//    * Appelé automatiquement par Socket.IO à chaque nouvelle connexion.
//    * On vérifie le token JWT transmis par le client et on enregistre à
//    * quel utilisateur appartient ce socket.
//    */
//   handleConnection(client: Socket) {
//     try {
//       const token =
//         (client.handshake.auth?.token as string) ||
//         (client.handshake.query?.token as string);

//       if (!token) {
//         this.logger.warn(
//           `❌ Connexion WebSocket refusée (pas de token) : ${client.id}`,
//         );
//         client.disconnect();
//         return;
//       }

//       const secret =
//         process.env.JWT_SECRET || 'change_this_secret_before_production';

//       // ✅ Décodage du JWT avec typage large (id peut être string ou number)
//       const payload = jwt.verify(token, secret) as { id: number | string };

//       // ✅ CORRECTION : toujours convertir en number pour matcher la Map
//       const userId = Number(payload.id);

//       if (!Number.isSafeInteger(userId) || userId <= 0) {
//         this.logger.warn(
//           `❌ Identifiant utilisateur invalide : ${payload.id}`,
//         );
//         client.disconnect();
//         return;
//       }

//       (client as any).userId = userId;

//       if (!this.socketsParUtilisateur.has(userId)) {
//         this.socketsParUtilisateur.set(userId, new Set<string>());
//       }

//       this.socketsParUtilisateur.get(userId)!.add(client.id);

//       // ✅ Log unique (le doublon a été supprimé)
//       this.logger.log(
//         `✅ Utilisateur ${userId} connecté (socket ${client.id})`,
//       );
//     } catch (error: any) {
//       this.logger.warn(
//         `❌ Connexion WebSocket refusée (token invalide) : ${error?.message}`,
//       );
//       client.disconnect();
//     }
//   }

//   // ============================================================
//   // DÉCONNEXION
//   // ============================================================
//   /**
//    * Appelé automatiquement à la déconnexion — on retire ce socket de la
//    * liste de l'utilisateur concerné.
//    */
//   handleDisconnect(client: Socket) {
//     const userId = (client as any).userId as number | undefined;

//     if (userId && this.socketsParUtilisateur.has(userId)) {
//       this.socketsParUtilisateur.get(userId)!.delete(client.id);

//       if (this.socketsParUtilisateur.get(userId)!.size === 0) {
//         this.socketsParUtilisateur.delete(userId);
//       }

//       this.logger.log(
//         `❌ Utilisateur ${userId} déconnecté (socket ${client.id})`,
//       );
//     }
//   }

//   // ============================================================
//   // ENVOI DE MESSAGE
//   // ============================================================
//   /**
//    * ✅ Appelée par MessageMetierService juste après l'enregistrement
//    * d'un nouveau message — pousse l'événement 'nouveau_message' à TOUS
//    * les sockets connectés du destinataire (s'il en a).
//    */
//   envoyerMessageAUnUtilisateur(destinataireId: number, message: any) {
//     // ✅ CORRECTION : conversion explicite en number pour matcher la Map
//     const destId = Number(destinataireId);

//     if (!Number.isSafeInteger(destId) || destId <= 0) {
//       this.logger.warn(
//         `⚠️ envoyerMessageAUnUtilisateur : destinataireId invalide (${destinataireId})`,
//       );
//       return;
//     }

//     const sockets = this.socketsParUtilisateur.get(destId);

//     // ✅ LOG DÉTAILLÉ : permet de voir immédiatement si le message part
//     this.logger.log(
//       `📤 Envoi à user ${destId} — sockets: ${
//         sockets ? sockets.size : 0
//       } — Type: ${message?.typeMessage ?? 'inconnu'} — Fichier: ${
//         message?.fichier_url ?? 'aucun'
//       } — Id: ${message?.id ?? '?'}`,
//     );

//     if (!sockets || sockets.size === 0) {
//       // Le destinataire n'est pas connecté en ce moment — pas grave,
//       // il verra le message via REST/notification à sa prochaine
//       // ouverture de l'app. Ce n'est pas une erreur.
//       this.logger.warn(
//         `⚠️ User ${destId} NON connecté. Utilisateurs actifs : [${Array.from(
//           this.socketsParUtilisateur.keys(),
//         ).join(', ')}]`,
//       );
//       return;
//     }

//     for (const socketId of sockets) {
//       this.server.to(socketId).emit('nouveau_message', message);
//     }

//     this.logger.log(
//       `✅ Message ${message?.id ?? '?'} diffusé à ${sockets.size} socket(s) de l'utilisateur ${destId}`,
//     );
//   }

//   // ============================================================
//   // NOTIFICATION DE CONVERSATION
//   // ============================================================
//   /**
//    * ✅ Utile pour rafraîchir la liste des conversations en temps réel
//    * (badge de non-lus) sans avoir à ouvrir la conversation concernée.
//    */
//   notifierNouvelleConversation(destinataireId: number) {
//     const destId = Number(destinataireId);

//     if (!Number.isSafeInteger(destId) || destId <= 0) {
//       this.logger.warn(
//         `⚠️ notifierNouvelleConversation : destinataireId invalide (${destinataireId})`,
//       );
//       return;
//     }

//     const sockets = this.socketsParUtilisateur.get(destId);
//     if (!sockets || sockets.size === 0) return;

//     for (const socketId of sockets) {
//       this.server.to(socketId).emit('conversation_mise_a_jour');
//     }

//     this.logger.log(
//       `🔔 Conversation mise à jour notifiée à ${sockets.size} socket(s) de l'utilisateur ${destId}`,
//     );
//   }

//   // ============================================================
//   // ✅ NOUVEAU : NOTIFICATION DE STATUT DE MESSAGE
//   // ============================================================
//   /**
//    * Appelée par MessageMetierService quand un message change de statut
//    * (passage de "envoye" → "recu" ou "recu" → "lu").
//    *
//    * On notifie l'EXPÉDITEUR pour que ses coches se mettent à jour en
//    * temps réel (comme sur WhatsApp : ✓ → ✓✓ → ✓✓ bleu).
//    */
//   notifierStatutMessage(
//     expediteurId: number,
//     data: { messageId: number; statut: string },
//   ) {
//     const expId = Number(expediteurId);

//     if (!Number.isSafeInteger(expId) || expId <= 0) {
//       this.logger.warn(
//         `⚠️ notifierStatutMessage : expéditeurId invalide (${expediteurId})`,
//       );
//       return;
//     }

//     const sockets = this.socketsParUtilisateur.get(expId);

//     if (!sockets || sockets.size === 0) {
//       // L'expéditeur n'est pas connecté — pas grave, il verra le nouveau
//       // statut au prochain chargement de la conversation via REST.
//       this.logger.log(
//         `ℹ️ Expéditeur ${expId} non connecté — statut "${data.statut}" du message ${data.messageId} non notifié`,
//       );
//       return;
//     }

//     for (const socketId of sockets) {
//       this.server.to(socketId).emit('statut_message_mis_a_jour', data);
//     }

//     this.logger.log(
//       `📬 Statut "${data.statut}" du message ${data.messageId} notifié à user ${expId} (${sockets.size} socket(s))`,
//     );
//   }
// } 




