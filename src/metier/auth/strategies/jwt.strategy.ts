

// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { ConfigService } from '@nestjs/config';
// import { UtilisateurEntity } from 'src/database/utilisateur/utilisateur.entity';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     @InjectRepository(UtilisateurEntity)
//     private readonly utilisateurRepository: Repository<UtilisateurEntity>,
//     private readonly configService: ConfigService,
//   ) {
//     // ✅ Récupérer le secret via ConfigService (chargé après .env)
//     const secret = configService.get<string>('JWT_SECRET');

//     if (!secret) {
//       throw new Error(
//         "FATAL: JWT_SECRET est obligatoire dans les variables d'environnement",
//       );
//     }

//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       // ✅ Utilise le MÊME secret que AuthModule
//       secretOrKey: secret,
//     });

//     console.log(
//       '✅ [JwtStrategy] Initialisée avec JWT_SECRET (longueur:',
//       secret.length,
//       ')',
//     );
//   }

//   async validate(payload: any) {
//     try {
//       const { id } = payload;

//       const utilisateur = await this.utilisateurRepository.findOne({
//         where: { id },
//       });

//       if (!utilisateur) {
//         throw new UnauthorizedException();
//       }

//       return utilisateur;
//     } catch (error) {
//       console.error('❌ ERREUR JwtStrategy.validate():', error);
//       throw new UnauthorizedException();
//     }
//   }
// }

// c

import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import {
  PassportStrategy,
} from '@nestjs/passport';

import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  Repository,
} from 'typeorm';

import {
  ConfigService,
} from '@nestjs/config';

import {
  UtilisateurEntity,
} from 'src/database/utilisateur/utilisateur.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
) {
  constructor(
    @InjectRepository(UtilisateurEntity)
    private readonly utilisateurRepository: Repository<UtilisateurEntity>,

    private readonly configService: ConfigService,
  ) {
    // ========================================================
    // Récupération JWT_SECRET
    // ========================================================

    const secret =
      configService.get<string>(
        'JWT_SECRET',
      );

    if (!secret) {
      throw new Error(
        "FATAL: JWT_SECRET est obligatoire dans les variables d'environnement",
      );
    }

    // ========================================================
    // Configuration Passport JWT
    // ========================================================

    super({
      /**
       * Récupère le token depuis :
       *
       * Authorization: Bearer <TOKEN>
       */
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      /**
       * Le token doit expirer.
       */
      ignoreExpiration: false,

      /**
       * Même secret que JwtModule.
       */
      secretOrKey: secret,
    });

    console.log(
      `✅ [JwtStrategy] Initialisée avec JWT_SECRET (longueur: ${secret.length})`,
    );
  }

  // ==========================================================
  // VALIDATION JWT
  // ==========================================================

  async validate(payload: any) {
    try {
      // ------------------------------------------------------
      // Affichage temporaire pour le debug
      // ------------------------------------------------------

      console.log(
        '🔐 [JwtStrategy] Payload JWT reçu:',
        payload,
      );

      // ------------------------------------------------------
      // Récupération ID
      // ------------------------------------------------------
      //
      // Nouveau token :
      //
      // {
      //   id: 13,
      //   sub: 13
      // }
      //
      // On donne priorité à sub.
      //
      // Le fallback "id" permet également de continuer
      // à accepter tes anciens tokens.
      // ------------------------------------------------------

      const userId =
        payload?.sub ??
        payload?.id;

      if (!userId) {
        console.error(
          '❌ [JwtStrategy] Aucun identifiant utilisateur dans le token',
        );

        throw new UnauthorizedException(
          'Token invalide : identifiant utilisateur absent',
        );
      }

      // ------------------------------------------------------
      // Conversion en nombre
      // ------------------------------------------------------

      const id = Number(userId);

      if (!Number.isInteger(id) || id <= 0) {
        console.error(
          '❌ [JwtStrategy] Identifiant utilisateur invalide:',
          userId,
        );

        throw new UnauthorizedException(
          'Token invalide',
        );
      }

      // ------------------------------------------------------
      // Recherche utilisateur
      // ------------------------------------------------------

      const utilisateur =
        await this.utilisateurRepository.findOne({
          where: {
            id,
          },
        });

      // ------------------------------------------------------
      // Utilisateur inexistant
      // ------------------------------------------------------

      if (!utilisateur) {
        console.error(
          `❌ [JwtStrategy] Utilisateur ${id} introuvable`,
        );

        throw new UnauthorizedException(
          'Utilisateur introuvable',
        );
      }

      // ------------------------------------------------------
      // Vérification compte suspendu
      // ------------------------------------------------------

      if (Number(utilisateur.geler) === 1) {
        console.error(
          `❌ [JwtStrategy] Compte ${id} suspendu`,
        );

        throw new UnauthorizedException(
          'Ce compte a été suspendu',
        );
      }

      // ------------------------------------------------------
      // Utilisateur authentifié
      // ------------------------------------------------------

      console.log(
        `✅ [JwtStrategy] Utilisateur authentifié : ${utilisateur.id}`,
      );

      /**
       * La valeur retournée devient :
       *
       * request.user
       *
       * Elle sera ensuite récupérée par ton
       * @CurrentUser().
       */
      return utilisateur;
    } catch (error) {
      console.error(
        '❌ ERREUR JwtStrategy.validate():',
        error,
      );

      // Éviter de perdre notre UnauthorizedException
      if (
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new UnauthorizedException(
        'Token JWT invalide',
      );
    }
  }
}