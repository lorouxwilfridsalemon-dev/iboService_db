// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// import { UtilisateurEntity } from 'src/database/utilisateur/utilisateur.entity';
// import { ProfilEntity } from 'src/database/profil/profil.entity';
// import { UtilisateurModule } from 'src/database/utilisateur/utilisateur.module';

// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';

// // ✅ CORRIGÉ : import relatif (au lieu de src/auth/strategies/...)
// import { JwtStrategy } from './strategies/jwt.strategy';

// @Module({
//   imports: [
//     UtilisateurModule,
//     TypeOrmModule.forFeature([ProfilEntity, UtilisateurEntity]),
//     PassportModule.register({ defaultStrategy: 'jwt' }),

//     // ✅ VERSION ASYNCHRONE : le secret est lu APRÈS le chargement de .env
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => {
//         const secret = configService.get<string>('JWT_SECRET');

//         if (!secret) {
//           throw new Error(
//             "FATAL: JWT_SECRET est obligatoire dans les variables d'environnement",
//           );
//         }

//         console.log(
//           '✅ [AuthModule] JWT_SECRET chargé (longueur:',
//           secret.length,
//           ')',
//         );

//         return {
//           secret,
//           signOptions: { expiresIn: '30d' },
//         };
//       },
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, JwtStrategy],
//   exports: [AuthService, JwtModule],
// })
// export class AuthModule {} 

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UtilisateurEntity } from 'src/database/utilisateur/utilisateur.entity';
import { ProfilEntity } from 'src/database/profil/profil.entity';
import { PlanAbonnementEntity } from 'src/database/plan_abonnement/plan_abonnement.entity';
import { AbonnementEntity } from 'src/database/abonnement/abonnement.entity';
import { UtilisateurModule } from 'src/database/utilisateur/utilisateur.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// ✅ CORRIGÉ : import relatif (au lieu de src/auth/strategies/...)
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UtilisateurModule,

    // ✅ AJOUT : PlanAbonnementEntity et AbonnementEntity pour la création auto
    TypeOrmModule.forFeature([
      ProfilEntity,
      UtilisateurEntity,
      PlanAbonnementEntity,
      AbonnementEntity,
    ]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    // ✅ VERSION ASYNCHRONE : le secret est lu APRÈS le chargement de .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');

        if (!secret) {
          throw new Error(
            "FATAL: JWT_SECRET est obligatoire dans les variables d'environnement",
          );
        }

        console.log(
          '✅ [AuthModule] JWT_SECRET chargé (longueur:',
          secret.length,
          ')',
        );

        return {
          secret,
          signOptions: { expiresIn: '30d' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {} 