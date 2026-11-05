import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {

    @IsString()
    readonly nomComplet: string;

    // ✅ Téléphone : identifiant de connexion principal, obligatoire.
    // Nommé "contact" pour correspondre au champ contact_usr de l'entité
    // et rester cohérent avec AuthCredentialDto.
    @IsString()
    readonly contact: string;

    @IsOptional()
    @IsEmail()
    readonly email?: string; 

    @IsString()
    @MinLength(6)
    readonly password: string;

    // ✅ "utilisateur" ou "proprietaire" — détermine le profil (profil_pro)
    // auquel le compte sera rattaché.
    @IsIn(['utilisateur', 'proprietaire'])
    readonly typeCompte: string;
}