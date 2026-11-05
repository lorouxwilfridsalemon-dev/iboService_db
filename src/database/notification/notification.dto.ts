import { IsString, IsInt, IsOptional, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UtilisateurDto } from '../utilisateur/utilisateur.dto';

export class NotificationDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsOptional()
  @IsString()
  readonly statut: string;

  @IsOptional()
  @IsString()
  readonly titre: string;

  @IsOptional()
  @IsString()
  readonly message: string;

  @IsOptional()
  @IsString()
  readonly type: string;

  @IsOptional()
  @IsBoolean()
  readonly is_lu: boolean;

  @IsOptional()
  @IsString()
  readonly empty1: string;

  @IsOptional()
  @IsString()
  readonly empty2: string;

  @IsOptional()
  @IsString()
  readonly empty3: string;

  @IsInt()
  readonly geler: number;

  @IsString()
  readonly dateCreation: string;

  @IsInt()
  readonly idusrcreation: number;

  // ✅ RELATION : Utilisateur
  @IsOptional()
  @ValidateNested()
  @Type(() => UtilisateurDto)
  readonly utilisateur?: UtilisateurDto;

  @IsOptional()
  @IsInt()
  readonly id_usr?: number;
}