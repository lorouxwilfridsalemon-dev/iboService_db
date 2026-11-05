import { IsEmail, IsOptional, IsString } from 'class-validator';

export class AuthCredentialDto {

    // ✅ MODIFIÉ : le login se fait maintenant par téléphone (contact_usr),
    // plus par email. Le champ "email" est conservé ci-dessous uniquement
    // par compatibilité (non utilisé pour la recherche du compte).
    @IsString()
    readonly contact: string;

    @IsOptional()
    @IsEmail()
    readonly email?: string;

    @IsString()
    // @Length(8)
    readonly password: string;
}