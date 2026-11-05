import { IsDateString, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * DTO envoyé par l'app Flutter pour réserver une annonce.
 *
 * ✅ SÉCURISÉ : idUsr a été retiré. L'identifiant de l'utilisateur qui
 * réserve est maintenant lu depuis le token JWT (req.user.id) côté
 * contrôleur, jamais fait confiance au client — impossible de réserver
 * "au nom" de quelqu'un d'autre en falsifiant la requête.
 */
export class ReserverDto {
  @IsInt()
  annonceId: number;

  @IsDateString()
  dateDebut: string;

  @IsOptional()
  @IsDateString()
  dateFin?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  description?: string;
}