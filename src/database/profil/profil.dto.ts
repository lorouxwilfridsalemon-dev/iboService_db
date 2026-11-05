import { IsString, IsInt, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { UtilisateurDto } from '../utilisateur/utilisateur.dto';

export class ProfilDto {

    @IsOptional()
    @IsInt()
    readonly id: number;

    @IsString()
    readonly libelle : string;

    @IsOptional()
    @IsString()
    readonly empty1 : string;

    @IsOptional()
    @IsString()
    readonly empty2 : string;

    @IsOptional()
    @IsString()
    readonly empty3 : string;

    @IsInt()
    readonly geler : number;

    @IsOptional()
    @IsInt()
    readonly idusrcreation : number;

    @IsOptional()
    @IsString()
    readonly dateCreation : string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UtilisateurDto)
    readonly utilisateurs?: UtilisateurDto[];
}