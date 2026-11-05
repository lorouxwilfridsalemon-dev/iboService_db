import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MessageEntity } from './message.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  /**
   * Sauvegarder un nouveau message
   */
  async save(message: Partial<MessageEntity>): Promise<any> {
    try {
      const messageEntity = new MessageEntity();
      
      // Copier les propriétés simples
      if (message.contenu) messageEntity.contenu = message.contenu;
      if (message.dateCreation) messageEntity.dateCreation = message.dateCreation;
      if (message.lu !== undefined) messageEntity.lu = message.lu;
      if (message.geler !== undefined) messageEntity.geler = message.geler;
      if (message.idusrcreation) messageEntity.idusrcreation = message.idusrcreation;
      
      // Gérer les champs via empty1, empty2, empty3
      if ((message as any).typeMessage) {
        messageEntity.empty1 = (message as any).typeMessage;
      } else {
        messageEntity.empty1 = 'texte';
      }
      
      if ((message as any).conversationId) {
        messageEntity.empty2 = (message as any).conversationId;
      }
      
      if ((message as any).dateLecture) {
        messageEntity.empty3 = new Date((message as any).dateLecture).toISOString();
      }
      
      // Gérer les IDs
      if (message.expediteur) {
        messageEntity.expediteur = message.expediteur;
      } else if ((message as any).id_expediteur) {
        messageEntity.expediteur = { id: (message as any).id_expediteur } as any;
      }
      
      if (message.destinataire) {
        messageEntity.destinataire = message.destinataire;
      } else if ((message as any).id_destinataire) {
        messageEntity.destinataire = { id: (message as any).id_destinataire } as any;
      }

      // Générer le conversationId si nécessaire
      if (!messageEntity.empty2 && messageEntity.expediteur && messageEntity.destinataire) {
        messageEntity.empty2 = this.genererConversationId(
          messageEntity.expediteur.id,
          messageEntity.destinataire.id,
        );
      }

      const result = await this.messageRepository.save(messageEntity);
      return result;
    } catch (error) {
      console.error('❌ Erreur save message:', error);
      throw new HttpException(
        {
          status: { code: HttpStatus.INTERNAL_SERVER_ERROR, error: `Erreur lors de la sauvegarde du message` },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Mettre à jour un message
   */
  async update(message: Partial<MessageEntity>, primaryKey: object): Promise<any> {
    try {
      const existingMessage = await this.findById(primaryKey);
      if (!existingMessage) {
        throw new HttpException(
          {
            status: { code: HttpStatus.NOT_FOUND, error: `Message non trouvé` },
          },
          HttpStatus.NOT_FOUND,
        );
      }
      
      const updateData: any = {};
      
      if (message.contenu) updateData.contenu = message.contenu;
      if (message.lu !== undefined) updateData.lu = message.lu;
      if (message.geler !== undefined) updateData.geler = message.geler;
      if ((message as any).typeMessage) updateData.empty1 = (message as any).typeMessage;
      if ((message as any).conversationId) updateData.empty2 = (message as any).conversationId;
      if ((message as any).dateLecture) updateData.empty3 = new Date((message as any).dateLecture).toISOString();
      
      const result = await this.messageRepository.save({
        ...existingMessage,
        ...updateData,
      });
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      
      console.error('❌ Erreur update message:', error);
      throw new HttpException(
        {
          status: { code: HttpStatus.INTERNAL_SERVER_ERROR, error: `Erreur lors de la mise à jour du message` },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Supprimer un message
   */
  async delete(primaryKey: object): Promise<any> {
    try {
      const existingMessage = await this.findById(primaryKey);
      if (!existingMessage) {
        throw new HttpException(
          {
            status: { code: HttpStatus.NOT_FOUND, error: `Message non trouvé` },
          },
          HttpStatus.NOT_FOUND,
        );
      }
      
      await this.messageRepository.delete(primaryKey);
      return { message: 'Message supprimé avec succès' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      
      console.error('❌ Erreur delete message:', error);
      throw new HttpException(
        {
          status: { code: HttpStatus.INTERNAL_SERVER_ERROR, error: `Erreur lors de la suppression du message` },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Rechercher des messages
   */
  async find(query: object): Promise<any> {
    try {
      const result = await this.messageRepository.find({
        where: query as any,
        relations: ['expediteur', 'destinataire'],
      });
      return result;
    } catch (error) {
      console.error('❌ Erreur find messages:', error);
      return [];
    }
  }

  /**
   * Trouver un message par sa clé primaire
   */
  async findById(primaryKey: object): Promise<any> {
    try {
      const result = await this.messageRepository.findOne({
        where: primaryKey as any,
        relations: ['expediteur', 'destinataire'],
      });
      
      return result || null;
    } catch (error) {
      console.error('❌ Erreur findById message:', error);
      return null;
    }
  }

  /**
   * Trouver des messages par leurs IDs
   */
  async findByIds(ids: number[]): Promise<MessageEntity[]> {
    try {
      return await this.messageRepository.find({
        where: { id: In(ids) } as any,
        relations: ['expediteur', 'destinataire'],
      });
    } catch (error) {
      console.error('❌ Erreur findByIds messages:', error);
      return [];
    }
  }

  /**
   * Mettre à jour plusieurs messages
   */
  async updateMany(ids: number[], data: any): Promise<void> {
    try {
      const updateData: any = {};
      
      if (data.lu !== undefined) updateData.lu = data.lu;
      if (data.geler !== undefined) updateData.geler = data.geler;
      if (data.empty1) updateData.empty1 = data.empty1;
      if (data.empty2) updateData.empty2 = data.empty2;
      if (data.empty3) updateData.empty3 = data.empty3;
      
      await this.messageRepository.update(
        { id: In(ids) } as any,
        updateData,
      );
    } catch (error) {
      console.error('❌ Erreur updateMany messages:', error);
    }
  }

  /**
   * Compter les messages selon des critères
   */
  async count(where: object): Promise<number> {
    try {
      return await this.messageRepository.count({ where } as any);
    } catch (error) {
      console.error('❌ Erreur count messages:', error);
      return 0;
    }
  }

  /**
   * Générer un identifiant unique de conversation
   */
  genererConversationId(user1Id: number, user2Id: number): string {
    const ids = [user1Id, user2Id].sort((a, b) => a - b);
    return `conv_${ids[0]}_${ids[1]}`;
  }
}