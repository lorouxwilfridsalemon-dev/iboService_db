import { IsString, IsInt, IsOptional, ValidateNested, IsArray, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { SousCategoriesDto } from '../sous_categories/sous_categories.dto';
import { UtilisateurDto } from '../utilisateur/utilisateur.dto';
import { AnnonceImageDto } from '../annonce_image/annonce_image.dto';
import { AvisDto } from '../avis/avis.dto';
import { ReservationDto } from '../reservation/reservation.dto';
import { SignalementDto } from '../signalement/signalement.dto';
import { FavoriDto } from '../favori/favori.dto';
import { AnnonceCaracteristiqueDto } from '../annonce_caracteristique/annonce_caracteristique.dto';
import { AnnonceVideoDto } from '../annonce_video/annonce_video.dto';
import { HistoriqueStatutAnnonceDto } from '../historique_statut_annonce/historique_statut_annonce.dto';
// ✅ NOUVEAU : relation boost
import { BoostDto } from '../boost/boost.dto';

export class AnnonceDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsOptional()
  @IsString()
  readonly titre: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsInt()
  readonly prix: number;

  @IsOptional()
  @IsString()
  readonly type_prix: string;

  @IsOptional()
  @IsString()
  readonly statut: string;

  @IsString()
  readonly date_publication: string;

  @IsOptional()
  @IsNumber()
  readonly longitude: number;

  @IsOptional()
  @IsNumber()
  readonly latitude: number;

  @IsOptional()
  @IsString()
  readonly adresse: string;

  @IsInt()
  readonly nombre_chambres: number;

  @IsOptional()
  @IsInt()
  readonly nombre_douches: number;

  @IsOptional()
  @IsInt()
  readonly nombre_salon: number;

  @IsOptional()
  @IsString()
  readonly type_location: string;

  @IsOptional()
  @IsString()
  readonly caution_mois: string;

  @IsOptional()
  @IsString()
  readonly avance_mois: string;

  @IsOptional()
  @IsNumber()
  readonly frais_visite: number;

  @IsOptional()
  @IsBoolean()
  readonly est_meuble: boolean;

  @IsOptional()
  @IsBoolean()
  readonly est_automatique: boolean;

  @IsOptional()
  @IsBoolean()
  readonly a_gps: boolean;

  @IsOptional()
  @IsString()
  readonly doc_cv: string;

  @IsOptional()
  @IsString()
  readonly piece: string;

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

  // ─────────────────────────────────────────────────────────────────────────
  // RELATIONS EXISTANTES
  // ─────────────────────────────────────────────────────────────────────────

  @IsOptional()
  @ValidateNested()
  @Type(() => SousCategoriesDto)
  readonly sousCategorie?: SousCategoriesDto;

  @IsOptional()
  @IsInt()
  readonly id_sca?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => UtilisateurDto)
  readonly utilisateur?: UtilisateurDto;

  @IsOptional()
  @IsInt()
  readonly id_usr?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnnonceImageDto)
  readonly images?: AnnonceImageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvisDto)
  readonly avis?: AvisDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReservationDto)
  readonly reservations?: ReservationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalementDto)
  readonly signalements?: SignalementDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FavoriDto)
  readonly favoris?: FavoriDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnnonceCaracteristiqueDto)
  readonly annonceCaracteristiques?: AnnonceCaracteristiqueDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnnonceVideoDto)
  readonly videos?: AnnonceVideoDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HistoriqueStatutAnnonceDto)
  readonly historiquesStatut?: HistoriqueStatutAnnonceDto[];

  // ─────────────────────────────────────────────────────────────────────────
  // ✅ NOUVELLE RELATION : BOOSTS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Liste des boosts de cette annonce (historique).
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BoostDto)
  readonly boosts?: BoostDto[];
} 