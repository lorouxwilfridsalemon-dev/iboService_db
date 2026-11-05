// import {
//   IsString,
//   IsInt,
//   IsOptional,
//   IsEnum,
//   MaxLength,
//   Min,
// } from 'class-validator';

// export enum TypeFacturation {
//   GRATUIT = 'gratuit',
//   MENSUEL = 'mensuel',
//   A_VIE = 'a_vie',
// }

// export class PlanAbonnementDto { 
//   @IsOptional()
//   @IsInt()
//   readonly id: number;

//   @IsString()
//   @MaxLength(50)
//   readonly code: string;

//   @IsString()
//   @MaxLength(100)
//   readonly nom: string;

//   @IsOptional()
//   @IsString()
//   @MaxLength(255)
//   readonly description: string;

//   @IsInt()
//   @Min(0)
//   readonly prix: number;

//   // @IsOptional()
//   // @IsString()
//   // @MaxLength(3)
//   // readonly devise: string;

//   @IsOptional()
//   @IsString()
//   @MaxLength(5)               // ← CORRIGÉ : 5 au lieu de 3
//   readonly devise: string;

//   @IsEnum(TypeFacturation, {
//     message: `Le type doit être : ${Object.values(TypeFacturation).join(', ')}`,
//   })
//   readonly typeFacturation: TypeFacturation;

//   @IsInt()
//   readonly nbAnnoncesMax: number;

//   @IsOptional()
//   @IsInt()
//   readonly videoAutorisee: number;

//   @IsOptional()
//   @IsInt()
//   readonly badgeActif: number;

//   @IsOptional()
//   @IsInt()
//   readonly nbPhotosMax: number;

//   @IsOptional()
//   @IsInt()
//   readonly ordre: number;

//   @IsOptional()
//   @IsInt()
//   readonly populaire: number;

//   @IsOptional()
//   @IsString()
//   @MaxLength(20)
//   readonly couleur: string;

//   @IsOptional()
//   @IsInt()
//   readonly actif: number;

//   @IsOptional()
//   readonly dateCreation: string;

//   @IsOptional()
//   @IsInt()
//   readonly geler: number;

//   @IsOptional()
//   @IsInt()
//   readonly idusrcreation: number;
// } 


import {
  IsString,
  IsInt,
  IsOptional,
  IsEnum,
  MaxLength,
  Min,
} from 'class-validator';

export enum TypeFacturation {
  GRATUIT  = 'gratuit',
  MENSUEL  = 'mensuel',
  A_VIE    = 'a_vie',       // ✅ conservé pour les données existantes
  ANNUELLE = 'annuelle',    // ✅ nouvelle valeur
}

export class PlanAbonnementDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsString()
  @MaxLength(50)
  readonly code: string;

  @IsString()
  @MaxLength(100)
  readonly nom: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly description: string;

  @IsInt()
  @Min(0)
  readonly prix: number;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  readonly devise: string;

  @IsEnum(TypeFacturation, {
    message: `Le type doit être : ${Object.values(TypeFacturation).join(', ')}`,
  })
  readonly typeFacturation: TypeFacturation;

  @IsInt()
  readonly nbAnnoncesMax: number;

  @IsOptional()
  @IsInt()
  readonly videoAutorisee: number;

  @IsOptional()
  @IsInt()
  readonly badgeActif: number;

  @IsOptional()
  @IsInt()
  readonly nbPhotosMax: number;

  @IsOptional()
  @IsInt()
  readonly ordre: number;

  @IsOptional()
  @IsInt()
  readonly populaire: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  readonly couleur: string;

  @IsOptional()
  @IsInt()
  readonly actif: number;

  @IsOptional()
  readonly dateCreation: string;

  @IsOptional()
  @IsInt()
  readonly geler: number;

  @IsOptional()
  @IsInt()
  readonly idusrcreation: number;
} 