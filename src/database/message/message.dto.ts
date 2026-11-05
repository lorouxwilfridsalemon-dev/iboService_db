
import { IsString, IsInt, IsOptional, IsBoolean, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class MessageDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsOptional()
  @IsString()
  readonly contenu: string;

  // ✅ AJOUT : Type de message
  @IsOptional()
  @IsString()
  readonly typeMessage?: string;

  // ✅ AJOUT : ID de conversation
  @IsOptional()
  @IsString()
  readonly conversationId?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly dateCreation: Date;

  @IsOptional()
  @IsBoolean() 
  readonly lu: boolean;

  // ✅ AJOUT : Date de lecture
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly dateLecture?: Date;

  @IsOptional()
  @IsString()
  readonly empty1: string;

  @IsOptional()
  @IsString()
  readonly empty2: string;

  @IsOptional()
  @IsString()
  readonly empty3: string;

  @IsOptional()
  @IsString()
  readonly statut?: string; // 'envoye' | 'recu' | 'lu' 

  @IsOptional()
  @IsInt()
  readonly geler: number;

  @IsOptional()
  @IsInt()
  readonly idusrcreation: number;

  @IsInt()
  readonly id_expediteur: number;

  @IsInt()
  readonly id_destinataire: number;
}