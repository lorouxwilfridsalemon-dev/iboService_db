import { UtilisateurModuleDroitDto } from './../utilisateur-module-droit/utilisateur-module-droit.dto';
import { UtilisateurProfilDto } from './../utilisateur-profil/utilisateur-profil.dto';
import { IsString, IsInt, IsOptional, IsEmail, Length } from 'class-validator';
import VisiteDto from '../visite/visite.dto';


export class UtilisateurDto {


    @IsOptional()
    @IsInt()
    readonly id: number;

    // @IsOptional()
    @IsString()
    readonly nom : string;

    @IsString()
    readonly prenom : string;

    @IsOptional()
    @IsString()
    readonly pseudo : string;

    @IsOptional()
    @IsString()
    @Length(8)
    readonly motDePasse : string;

    @IsString()
    @IsEmail()
    readonly email : string;

    @IsString()
    readonly contact : string;

    @IsOptional()
    @IsString()
    readonly description : string;

    @IsOptional()
    @IsString()
    readonly language : string;

    @IsOptional()
    @IsString()
    readonly devise : string;

    @IsOptional()
    @IsString()
    readonly emailConfirmation : string;

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

    @IsString()
    readonly dateCreation : string;

    @IsInt()
    readonly idusrcreation : number;

    @IsOptional()
    readonly utilisateurProfil : UtilisateurProfilDto[];

    @IsOptional()
    readonly utilisateurModuleDroit : UtilisateurModuleDroitDto[];

    @IsOptional()
    readonly visite: VisiteDto;

}