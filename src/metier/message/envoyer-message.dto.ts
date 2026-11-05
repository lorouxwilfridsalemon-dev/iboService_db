import { IsString, IsInt, IsOptional, IsIn, MinLength, MaxLength, IsArray } from 'class-validator';

export class EnvoyerMessageDto {
  @IsInt()
  readonly destinataireId: number;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  readonly contenu: string;

  @IsOptional()
  @IsString()
  @IsIn(['texte', 'image', 'audio', 'video', 'document', 'annonce'])
  readonly typeMessage?: string;
}

export class EnvoyerMessageAnnonceDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  readonly contenu: string;
}

export class MarquerLuDto {
  // ✅ CORRIGÉ : @IsArray() ajouté — sans lui, {each: true} seul ne
  // garantit pas que class-validator vérifie d'abord que messageIds est
  // bien un tableau avant d'en valider chaque élément.
  @IsArray()
  @IsInt({ each: true })
  readonly messageIds: number[]; 
}