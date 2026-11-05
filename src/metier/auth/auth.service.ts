


// import {
//   Injectable,
//   InternalServerErrorException,
//   UnauthorizedException,
//   BadRequestException,
// } from '@nestjs/common';

// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, EntityManager } from 'typeorm';

// import { JwtService } from '@nestjs/jwt';

// import { UtilisateurService } from 'src/database/utilisateur/utilisateur.service';

// import * as bcrypt from 'bcrypt';

// import { ProfilEntity } from 'src/database/profil/profil.entity';
// import { UtilisateurEntity } from 'src/database/utilisateur/utilisateur.entity';

// // DTO
// import { AuthCredentialDto } from './dto/auth-credentials.dto';
// import { RegisterDto } from './dto/register.dto';
// import { ForgotPasswordDto } from './dto/forgot-password.dto';
// import { ResetPasswordDto } from './dto/reset-password.dto';

// @Injectable()
// export class AuthService {
//   /**
//    * URL de l'API
//    */
//   clientApiUrl = 'http://localhost:4007';

//   constructor(
//     private readonly utilisateurService: UtilisateurService,

//     private readonly jwtService: JwtService,

//     @InjectRepository(ProfilEntity)
//     private readonly profilRepository: Repository<ProfilEntity>,
//   ) {}

//   // ============================================================
//   // JWT
//   // ============================================================

//   /**
//    * Création du token JWT.
//    *
//    * IMPORTANT :
//    * On conserve "id" pour rester compatible avec ton ancien système.
//    *
//    * On ajoute également "sub", qui est la convention JWT
//    * couramment utilisée pour représenter l'identifiant du sujet.
//    */
//   createAuthentificationToken(id: number | string) {
//     const userId = Number(id);

//     return this.jwtService.sign({
//       id: userId,
//       sub: userId,
//     });
//   }

//   /**
//    * Date d'expiration affichée dans la réponse API.
//    *
//    * 0.5 jour = 12 heures.
//    *
//    * ATTENTION :
//    * Ton AuthModule configure actuellement le JWT avec expiresIn: '30d'.
//    * Il faut donc idéalement mettre cette valeur en cohérence.
//    *
//    * Ici je conserve ton comportement actuel de 12 heures pour
//    * ne pas changer brutalement le fonctionnement de ton API.
//    */
//   getExpirationTime(): Date {
//     const now = new Date();

//     const addDays = 0.5;

//     now.setTime(
//       now.getTime() +
//         addDays * 24 * 60 * 60 * 1000,
//     );

//     return now;
//   }

//   // ============================================================
//   // VALIDATION UTILISATEUR
//   // ============================================================

//   /**
//    * Validation d'un utilisateur.
//    *
//    * Cette méthode peut être utilisée par un éventuel
//    * LocalStrategy.
//    */
//   async validateUser(
//     username: string,
//     pass: string,
//   ): Promise<any> {
//     const user =
//       await this.utilisateurService.findByEmail(username);

//     if (!user) {
//       return null;
//     }

//     let passwordValid = false;

//     try {
//       passwordValid = await bcrypt.compare(
//         pass,
//         user.motDePasse,
//       );
//     } catch (error) {
//       passwordValid = false;
//     }

//     if (!passwordValid) {
//       return null;
//     }

//     const {
//       motDePasse,
//       ...result
//     } = user;

//     return result;
//   }

//   // ============================================================
//   // LOGIN
//   // ============================================================

//   /**
//    * Connexion.
//    *
//    * Le champ "contact" peut contenir :
//    *
//    * - un numéro de téléphone
//    * - ou une adresse email
//    *
//    * Exemple :
//    *
//    * {
//    *   "contact": "0505454863",
//    *   "password": "123456"
//    * }
//    */
//   async login(
//     authCredentialDto: AuthCredentialDto,
//   ) {
//     try {
//       // --------------------------------------------------------
//       // 1. Récupération de l'identifiant
//       // --------------------------------------------------------

//       const identifiant =
//         (authCredentialDto.contact || '').trim();

//       const password =
//         authCredentialDto.password || '';

//       if (!identifiant || !password) {
//         throw new BadRequestException(
//           'Le contact et le mot de passe sont obligatoires',
//         );
//       }

//       // --------------------------------------------------------
//       // 2. Déterminer email ou téléphone
//       // --------------------------------------------------------

//       const estUnEmail =
//         identifiant.includes('@');

//       // --------------------------------------------------------
//       // 3. Recherche utilisateur
//       // --------------------------------------------------------

//       const userRequete: any =
//         estUnEmail
//           ? await this.utilisateurService.find({
//               email: identifiant,
//             })
//           : await this.utilisateurService.find({
//               contact: identifiant,
//             });

//       const user = userRequete?.[0];

//       if (!user) {
//         return {
//           etat: 'warning',
//           message:
//             'login ou mot de passe incorrect',
//           data: null,
//         };
//       }

//       // --------------------------------------------------------
//       // 4. Vérification du mot de passe
//       // --------------------------------------------------------

//       let motDePasseValide = false;

//       try {
//         motDePasseValide =
//           await bcrypt.compare(
//             password,
//             user.motDePasse,
//           );
//       } catch (error) {
//         console.error(
//           '❌ Erreur bcrypt:',
//           error,
//         );

//         motDePasseValide = false;
//       }

//       // --------------------------------------------------------
//       // 5. Compatibilité avec les anciens mots de passe
//       // --------------------------------------------------------
//       //
//       // Si certains anciens comptes possèdent encore un mot
//       // de passe en clair, on accepte exceptionnellement
//       // l'ancien mot de passe puis on le hash immédiatement.
//       //
//       // Les nouveaux comptes sont toujours enregistrés
//       // avec bcrypt.
//       // --------------------------------------------------------

//       if (
//         !motDePasseValide &&
//         user.motDePasse === password
//       ) {
//         motDePasseValide = true;

//         const motDePasseHache =
//           await bcrypt.hash(password, 10);

//         user.motDePasse =
//           motDePasseHache;

//         await this.utilisateurService.save(
//           user,
//         );
//       }

//       // --------------------------------------------------------
//       // 6. Mot de passe incorrect
//       // --------------------------------------------------------

//       if (!motDePasseValide) {
//         return {
//           etat: 'warning',
//           message:
//             'login ou mot de passe incorrect',
//           data: null,
//         };
//       }

//       // --------------------------------------------------------
//       // 7. Vérification compte suspendu
//       // --------------------------------------------------------

//       if (Number(user.geler) === 1) {
//         return {
//           etat: 'warning',
//           message:
//             'Ce compte a été suspendu',
//           data: null,
//         };
//       }

//       // --------------------------------------------------------
//       // 8. Création du token
//       // --------------------------------------------------------

//       const accessToken =
//         this.createAuthentificationToken(
//           user.id,
//         );

//       // --------------------------------------------------------
//       // 9. Ne jamais retourner le mot de passe
//       // --------------------------------------------------------

//       const {
//         motDePasse,
//         ...userWithoutPassword
//       } = user;

//       // --------------------------------------------------------
//       // 10. Réponse
//       // --------------------------------------------------------

//       return {
//         etat: 'succes',

//         message: 'connecté',

//         data: {
//           user: userWithoutPassword,

//           token_type: 'Bearer',

//           expire_at:
//             this.getExpirationTime(),

//           access_token: accessToken,
//         },
//       };
//     } catch (error) {
//       // Conserver les erreurs HTTP prévues
//       if (
//         error instanceof BadRequestException ||
//         error instanceof UnauthorizedException
//       ) {
//         throw error;
//       }

//       console.error(
//         '❌ ERREUR AuthService.login():',
//         error,
//       );

//       throw new InternalServerErrorException(
//         'Une erreur est survenue lors de la connexion',
//       );
//     }
//   }

//   // ============================================================
//   // REGISTER
//   // ============================================================

//   /**
//    * Inscription d'un nouvel utilisateur.
//    */
//   async register(
//     registerDto: RegisterDto,
//   ) {
//     const {
//       nomComplet,
//       contact,
//       email,
//       password,
//       typeCompte,
//     } = registerDto;

//     // --------------------------------------------------------
//     // Vérification téléphone
//     // --------------------------------------------------------

//     const telephoneExistant: any =
//       await this.utilisateurService.find({
//         contact,
//       });

//     if (
//       telephoneExistant &&
//       telephoneExistant.length > 0
//     ) {
//       return {
//         etat: 'warning',
//         message:
//           'Ce numéro de téléphone est déjà utilisé',
//         data: null,
//       };
//     }

//     // --------------------------------------------------------
//     // Vérification email
//     // --------------------------------------------------------

//     if (email) {
//       const emailExistant: any =
//         await this.utilisateurService.find({
//           email,
//         });

//       if (
//         emailExistant &&
//         emailExistant.length > 0
//       ) {
//         return {
//           etat: 'warning',
//           message:
//             'Cet email est déjà utilisé',
//           data: null,
//         };
//       }
//     }

//     // --------------------------------------------------------
//     // Séparation nom / prénom
//     // --------------------------------------------------------

//     const parties =
//       nomComplet
//         .trim()
//         .split(/\s+/);

//     const nom = parties[0];

//     const prenom =
//       parties.length > 1
//         ? parties.slice(1).join(' ')
//         : parties[0];

//     // --------------------------------------------------------
//     // Détermination du profil
//     // --------------------------------------------------------

//     const libelleProfil =
//       typeCompte === 'proprietaire'
//         ? 'Propriétaire'
//         : 'Utilisateur';

//     const profil =
//       await this.profilRepository.findOne({
//         where: {
//           libelle: libelleProfil,
//         },
//       });

//     if (!profil) {
//       return {
//         etat: 'warning',
//         message:
//           `Le profil "${libelleProfil}" n'existe pas encore en base (table profil_pro)`,
//         data: null,
//       };
//     }

//     // --------------------------------------------------------
//     // Hash mot de passe
//     // --------------------------------------------------------

//     const motDePasseHache =
//       await bcrypt.hash(
//         password,
//         10,
//       );

//     // --------------------------------------------------------
//     // Création utilisateur
//     // --------------------------------------------------------

//     const nouvelUtilisateur: any =
//       await this.utilisateurService.save({
//         nom,
//         prenom,
//         email: email || null,
//         motDePasse: motDePasseHache,
//         contact,
//         geler: 0,
//         dateCreation: new Date(),
//         profil,
//       });

//     // --------------------------------------------------------
//     // Création token
//     // --------------------------------------------------------

//     const accessToken =
//       this.createAuthentificationToken(
//         nouvelUtilisateur.id,
//       );

//     // --------------------------------------------------------
//     // Ne jamais retourner le mot de passe
//     // --------------------------------------------------------

//     const {
//       motDePasse,
//       ...userWithoutPassword
//     } = nouvelUtilisateur;

//     return {
//       etat: 'succes',

//       message:
//         'Compte créé avec succès',

//       data: {
//         user: userWithoutPassword,

//         token_type: 'Bearer',

//         expire_at:
//           this.getExpirationTime(),

//         access_token: accessToken,
//       },
//     };
//   }

//   // ============================================================
//   // PROFILE
//   // ============================================================

//   async getProfile(
//     user: UtilisateurEntity,
//   ) {
//     const {
//       motDePasse,
//       ...utilisateur
//     } = user;

//     return utilisateur;
//   }

//   // ============================================================
//   // LOGOUT
//   // ============================================================

//   async logout(
//     user: UtilisateurEntity,
//   ) {
//     const {
//       motDePasse,
//       ...utilisateur
//     } = user;

//     return {
//       utilisateur,

//       message:
//         'utilisateur déconnecté avec succès',
//     };
//   }

//   // ============================================================
//   // MOT DE PASSE OUBLIÉ
//   // ============================================================

//   async forgotmotDePasse(
//     forgotPasswordDto: ForgotPasswordDto,
//   ) {
//     const user =
//       await this.utilisateurService.findByEmail(
//         forgotPasswordDto.email,
//       );

//     if (!user) {
//       throw new BadRequestException(
//         'Email invalide',
//       );
//     }

//     try {
//       const token =
//         this.createAuthentificationToken(
//           user.id,
//         );

//       const forgotLink =
//         `${this.clientApiUrl}/auth/reinitialiser-mot-passe?token=${token}`;

//       // TODO :
//       // Envoyer réellement forgotLink par email.
//       //
//       // On ne retourne pas le token au client
//       // pour des raisons de sécurité.

//       console.log(
//         '🔗 Lien de réinitialisation:',
//         forgotLink,
//       );

//       return {
//         message:
//           'Email de vérification envoyé avec succès',
//       };
//     } catch (error) {
//       console.error(
//         '❌ Erreur forgotmotDePasse:',
//         error,
//       );

//       throw new InternalServerErrorException(
//         'Une erreur est survenue',
//       );
//     }
//   }

//   // ============================================================
//   // CHANGEMENT MOT DE PASSE
//   // ============================================================

//   async changemotDePasse(
//     resetPasswordDto: ResetPasswordDto,

//     user: UtilisateurEntity,

//     manager: EntityManager,
//   ) {
//     // --------------------------------------------------------
//     // Vérification des mots de passe
//     // --------------------------------------------------------

//     if (
//       resetPasswordDto.password !==
//       resetPasswordDto.passwordConfirm
//     ) {
//       throw new BadRequestException(
//         'Les mots de passe ne correspondent pas',
//       );
//     }

//     // --------------------------------------------------------
//     // Hash nouveau mot de passe
//     // --------------------------------------------------------

//     user.motDePasse =
//       await bcrypt.hash(
//         resetPasswordDto.password,
//         10,
//       );

//     // --------------------------------------------------------
//     // Sauvegarde
//     // --------------------------------------------------------

//     await manager.save(user);

//     return {
//       message:
//         'mot de passe changé avec succès',
//     };
//   }
// }


import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';

import { JwtService } from '@nestjs/jwt';

import { UtilisateurService } from 'src/database/utilisateur/utilisateur.service';

import * as bcrypt from 'bcrypt';

import { ProfilEntity } from 'src/database/profil/profil.entity';
import { UtilisateurEntity } from 'src/database/utilisateur/utilisateur.entity';
import { PlanAbonnementEntity } from 'src/database/plan_abonnement/plan_abonnement.entity';
import { AbonnementEntity } from 'src/database/abonnement/abonnement.entity';

// DTO
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  /**
   * URL de l'API
   */
  clientApiUrl = 'http://localhost:4007';

  constructor(
    private readonly utilisateurService: UtilisateurService,

    private readonly jwtService: JwtService,

    @InjectRepository(ProfilEntity)
    private readonly profilRepository: Repository<ProfilEntity>,

    // ✅ NOUVEAU : pour créer automatiquement l'abonnement gratuit
    @InjectRepository(PlanAbonnementEntity)
    private readonly planRepository: Repository<PlanAbonnementEntity>,

    @InjectRepository(AbonnementEntity)
    private readonly abonnementRepository: Repository<AbonnementEntity>,
  ) {}

  // ============================================================
  // JWT
  // ============================================================

  createAuthentificationToken(id: number | string) {
    const userId = Number(id);

    return this.jwtService.sign({
      id: userId,
      sub: userId,
    });
  }

  getExpirationTime(): Date {
    const now = new Date();

    const addDays = 0.5;

    now.setTime(now.getTime() + addDays * 24 * 60 * 60 * 1000);

    return now;
  }

  // ============================================================
  // VALIDATION UTILISATEUR
  // ============================================================

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.utilisateurService.findByEmail(username);

    if (!user) {
      return null;
    }

    let passwordValid = false;

    try {
      passwordValid = await bcrypt.compare(pass, user.motDePasse);
    } catch (error) {
      passwordValid = false;
    }

    if (!passwordValid) {
      return null;
    }

    const { motDePasse, ...result } = user;

    return result;
  }

  // ============================================================
  // LOGIN
  // ============================================================

  async login(authCredentialDto: AuthCredentialDto) {
    try {
      const identifiant = (authCredentialDto.contact || '').trim();

      const password = authCredentialDto.password || '';

      if (!identifiant || !password) {
        throw new BadRequestException(
          'Le contact et le mot de passe sont obligatoires',
        );
      }

      const estUnEmail = identifiant.includes('@');

      const userRequete: any = estUnEmail
        ? await this.utilisateurService.find({ email: identifiant })
        : await this.utilisateurService.find({ contact: identifiant });

      const user = userRequete?.[0];

      if (!user) {
        return {
          etat: 'warning',
          message: 'login ou mot de passe incorrect',
          data: null,
        };
      }

      let motDePasseValide = false;

      try {
        motDePasseValide = await bcrypt.compare(password, user.motDePasse);
      } catch (error) {
        console.error('❌ Erreur bcrypt:', error);
        motDePasseValide = false;
      }

      if (!motDePasseValide && user.motDePasse === password) {
        motDePasseValide = true;

        const motDePasseHache = await bcrypt.hash(password, 10);

        user.motDePasse = motDePasseHache;

        await this.utilisateurService.save(user);
      }

      if (!motDePasseValide) {
        return {
          etat: 'warning',
          message: 'login ou mot de passe incorrect',
          data: null,
        };
      }

      if (Number(user.geler) === 1) {
        return {
          etat: 'warning',
          message: 'Ce compte a été suspendu',
          data: null,
        };
      }

      const accessToken = this.createAuthentificationToken(user.id);

      const { motDePasse, ...userWithoutPassword } = user;

      return {
        etat: 'succes',
        message: 'connecté',
        data: {
          user: userWithoutPassword,
          token_type: 'Bearer',
          expire_at: this.getExpirationTime(),
          access_token: accessToken,
        },
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      console.error('❌ ERREUR AuthService.login():', error);

      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la connexion',
      );
    }
  }

  // ============================================================
  // REGISTER
  // ============================================================

  async register(registerDto: RegisterDto) {
    const { nomComplet, contact, email, password, typeCompte } = registerDto;

    // --------------------------------------------------------
    // Vérification téléphone
    // --------------------------------------------------------

    const telephoneExistant: any = await this.utilisateurService.find({
      contact,
    });

    if (telephoneExistant && telephoneExistant.length > 0) {
      return {
        etat: 'warning',
        message: 'Ce numéro de téléphone est déjà utilisé',
        data: null,
      };
    }

    // --------------------------------------------------------
    // Vérification email
    // --------------------------------------------------------

    if (email) {
      const emailExistant: any = await this.utilisateurService.find({ email });

      if (emailExistant && emailExistant.length > 0) {
        return {
          etat: 'warning',
          message: 'Cet email est déjà utilisé',
          data: null,
        };
      }
    }

    // --------------------------------------------------------
    // Séparation nom / prénom
    // --------------------------------------------------------

    const parties = nomComplet.trim().split(/\s+/);

    const nom = parties[0];

    const prenom = parties.length > 1 ? parties.slice(1).join(' ') : parties[0];

    // --------------------------------------------------------
    // Détermination du profil
    // --------------------------------------------------------

    const libelleProfil =
      typeCompte === 'proprietaire' ? 'Propriétaire' : 'Utilisateur';

    const profil = await this.profilRepository.findOne({
      where: { libelle: libelleProfil },
    });

    if (!profil) {
      return {
        etat: 'warning',
        message: `Le profil "${libelleProfil}" n'existe pas encore en base (table profil_pro)`,
        data: null,
      };
    }

    // --------------------------------------------------------
    // Hash mot de passe
    // --------------------------------------------------------

    const motDePasseHache = await bcrypt.hash(password, 10);

    // --------------------------------------------------------
    // Création utilisateur
    // --------------------------------------------------------

    const nouvelUtilisateur: any = await this.utilisateurService.save({
      nom,
      prenom,
      email: email || null,
      motDePasse: motDePasseHache,
      contact,
      geler: 0,
      dateCreation: new Date(),
      profil,
    });

    // --------------------------------------------------------
    // ✅ NOUVEAU : Créer automatiquement un abonnement GRATUIT
    // --------------------------------------------------------

    try {
      const planGratuit = await this.planRepository.findOne({
        where: { code: 'gratuit', actif: 1, geler: 0 },
      });

      if (planGratuit) {
        const annee = new Date().getFullYear();
        const count = await this.abonnementRepository.count();
        const numero = (count + 1).toString().padStart(6, '0');
        const reference = `ABN-${annee}-${numero}`;

        await this.abonnementRepository.save({
          reference,
          typeFacturation: 'gratuit',
          dateDebut: new Date(),
          dateFin: null,
          dateProchainPaiement: null,
          montantPaye: 0,
          devise: planGratuit.devise || 'FCFA',
          statut: 'actif',
          autoRenouvellement: 0,
          annoncesUtilisees: 0,
          boostsUtilises: 0,
          dateCreation: new Date(),
          dateModification: null,
          geler: 0,
          idusrcreation: nouvelUtilisateur.id,
          utilisateur: { id: nouvelUtilisateur.id } as any,
          plan: { id: planGratuit.id } as any,
        });

        console.log(
          `✅ [AuthService.register] Abonnement GRATUIT créé pour l'utilisateur ${nouvelUtilisateur.id} (${reference})`,
        );
      } else {
        console.warn(
          '⚠️ [AuthService.register] Plan "gratuit" introuvable en base. ' +
            'Aucun abonnement créé automatiquement.',
        );
      }
    } catch (error) {
      console.error(
        '❌ [AuthService.register] Erreur création abonnement gratuit:',
        error,
      );
      // On ne bloque pas l'inscription si l'abonnement échoue
    }

    // --------------------------------------------------------
    // Création token
    // --------------------------------------------------------

    const accessToken = this.createAuthentificationToken(nouvelUtilisateur.id);

    // --------------------------------------------------------
    // Ne jamais retourner le mot de passe
    // --------------------------------------------------------

    const { motDePasse, ...userWithoutPassword } = nouvelUtilisateur;

    return {
      etat: 'succes',
      message: 'Compte créé avec succès',
      data: {
        user: userWithoutPassword,
        token_type: 'Bearer',
        expire_at: this.getExpirationTime(),
        access_token: accessToken,
      },
    };
  }

  // ============================================================
  // PROFILE
  // ============================================================

  async getProfile(user: UtilisateurEntity) {
    const { motDePasse, ...utilisateur } = user;

    return utilisateur;
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  async logout(user: UtilisateurEntity) {
    const { motDePasse, ...utilisateur } = user;

    return {
      utilisateur,
      message: 'utilisateur déconnecté avec succès',
    };
  }

  // ============================================================
  // MOT DE PASSE OUBLIÉ
  // ============================================================

  async forgotmotDePasse(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.utilisateurService.findByEmail(
      forgotPasswordDto.email,
    );

    if (!user) {
      throw new BadRequestException('Email invalide');
    }

    try {
      const token = this.createAuthentificationToken(user.id);

      const forgotLink = `${this.clientApiUrl}/auth/reinitialiser-mot-passe?token=${token}`;

      console.log('🔗 Lien de réinitialisation:', forgotLink);

      return {
        message: 'Email de vérification envoyé avec succès',
      };
    } catch (error) {
      console.error('❌ Erreur forgotmotDePasse:', error);

      throw new InternalServerErrorException('Une erreur est survenue');
    }
  }

  // ============================================================
  // CHANGEMENT MOT DE PASSE
  // ============================================================

  async changemotDePasse(
    resetPasswordDto: ResetPasswordDto,
    user: UtilisateurEntity,
    manager: EntityManager,
  ) {
    if (resetPasswordDto.password !== resetPasswordDto.passwordConfirm) {
      throw new BadRequestException('Les mots de passe ne correspondent pas');
    }

    user.motDePasse = await bcrypt.hash(resetPasswordDto.password, 10);

    await manager.save(user);

    return {
      message: 'mot de passe changé avec succès',
    };
  }
} 