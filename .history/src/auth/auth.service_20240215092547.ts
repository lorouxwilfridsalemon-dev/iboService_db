import { ResetPasswordDto } from './dto/reset-password.dto';
// import { MailService } from './../mail/mail.service';
import { UtilisateurEntity } from './../database/utilisateur/utilisateur.entity';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { Injectable, InternalServerErrorException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UtilisateurService } from 'src/database/utilisateur/utilisateur.service';
import * as bcrypt from 'bcrypt'
import moment from 'moment';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { EntityManager } from 'typeorm';
import { CodeVerificationEntity } from 'src/database/code-verification/code-verification.entity';
import { MailService } from 'src/mail/mail.service';
import { isNotEmpty } from 'class-validator';
import { isBigNumber } from 'mathjs';

@Injectable()
export class AuthService {

    clientApiUrl = "http://localhost:4000";

    constructor(
        private utilisateurService: UtilisateurService,
        private mailService: MailService,
        private readonly jwtService: JwtService,
    ) { }

    createAuthentificationToken(id) {
        return this.jwtService.sign({ id });
    }

    getExpirationTime(): Date {
        const now = new Date();
        const addDays = 0.5;

        now.setTime(now.getTime() + (addDays * 24 * 60 * 60 * 1000));

        // console.log(now.setTime(now.getTime() + (addDays * 24 * 60 * 60 * 1000)), 'now.setTime(now.getTime() + (addDays * 24 * 60 * 60 * 1000))');


        return now;
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.utilisateurService.findByEmail(username);

        // const isMatch = await bcrypt.compare(pass, user.motDePasse)
        if (user && user.motDePasse === pass) {
            const { motDePasse, ...result } = user;
            return result;
        }
        return null;
    }

    async login(authCredentialDto: AuthCredentialDto, manager: EntityManager) {

        const userRequete = await this.utilisateurService.find({ email: authCredentialDto.email })
        const user = userRequete[0];

        if (!user || user.motDePasse != authCredentialDto.password) {
            // throw new UnauthorizedException('Login ou mot de passe incorrecte');
            return {
                etat: 'warning',
                message: 'login ou mot de passe incorrect',
                data: null
            }
        } else {

            const verificationUserWhoAuth = await manager.find(CodeVerificationEntity, { where: { utilisateur: user.id } })
            // console.log('verificationUserWhoAuth => ', verificationUserWhoAuth[0]?.idusrcreation);

            const verificationFirstAuthentification = await manager.createQueryBuilder(CodeVerificationEntity, "codeVerification")

                .innerJoinAndSelect("codeVerification.utilisateur", "utilisateur")
                .where("utilisateur.id = :id", { id: user.id })
                .andWhere("codeVerification.dateLastConfirmation IS NOT NULL")
                .andWhere("utilisateur.geler = 0")
                .orderBy("codeVerification.id", "DESC") // Ordonne par codeVerification.id en ordre décroissant
                .limit(1) // puis limiter élément retourner à un (1) élément 
                .getMany();

            let authentificated = false;

            if (verificationUserWhoAuth[0]?.idusrcreation === user.id ) {
                authentificated = true
                // console.log('verificationFirstAuthentification => ', verificationFirstAuthentification );

            }

            const codeEntity = await this._getCodeVerification(manager, user);

            // console.log('verificationFirstAuthentification =>', verificationFirstAuthentification);


            const data = {
                greeting: "Bonjour",
                title: "Confirmation de votre adresse courriel.",
                content: "Veuillez recevoir ci-dessous le code de confirmation vous permettant de vous connecter à la plateforme",
                code: codeEntity.code,
                name: user.prenom + ' ' + user.nom,
                thank: "Merci",
                signature: "L’équipe"
            }
            console.log(data);

            // const result = await this.mailService.send2FaEmail(user, data);

            // if (result) {
            return {
                etat: 'succes',
                message: 'connecté',
                data:
                {
                    user: user,
                    token_type: "Bearer",
                    expire_at: this.getExpirationTime(),
                    access_token: this.createAuthentificationToken(user.id),
                    authentificated: authentificated,
                    dateLastAuth: verificationFirstAuthentification[0]?.dateLastConfirmation
                    // code: codeEntity,
                },


                // }

            }

        }

    }
    async getProfile(user: UtilisateurEntity) {
        const { motDePasse, ...utilisateur } = user;

        return utilisateur;
    }

    async logout(user: UtilisateurEntity) {
        const { motDePasse, ...utilisateur } = user;

        return {
            utilisateur,
            message: "utilisateur déconnecté avec succès"
        }
    }

    async forgotmotDePasse(forgotPasswordDto: ForgotPasswordDto) {
        const user = await this.utilisateurService.findByEmail(forgotPasswordDto.email);

        if (!user) {
            throw new BadRequestException('Email invalide');
        }

        try {
            const token = this.createAuthentificationToken(user.id);
            const forgotLink = `${this.clientApiUrl}/auth/reinitialiser-mot-passe?token=${token}`;

            // const result = await this.mailService.sendForgotPasswordEmail(user, forgotLink)

            return {
                message: "Email de vérification envoyé avec succès"
            }

        } catch (error) {

            throw new InternalServerErrorException("Une erreur est survenue");
        }
    }

    async changemotDePasse(resetPasswordDto: ResetPasswordDto, user: UtilisateurEntity, manager: EntityManager) {

        if (resetPasswordDto.password != resetPasswordDto.passwordConfirm) {
            throw new BadRequestException('Les mots de passe ne correspondent pas');
        }

        user.motDePasse = resetPasswordDto.password;

        user = await manager.save(user);

        return {
            message: "mot de passe changé avec succès"
        }
    }
    async _getCodeVerification(manager: EntityManager, utilisateur: UtilisateurEntity) {
        const code = Math.floor(10000000 + Math.random() * 90000000);

        const numOfHours = 1;
        const dateExpiration = new Date();
        dateExpiration.setTime(dateExpiration.getTime() + numOfHours * 60 * 60 * 1000);

        let codeEntity = new CodeVerificationEntity({
            code: code,
            dateExpiration: dateExpiration.toISOString(),
            utilisateur: utilisateur,
            geler: 0,
            dateCreation: new Date().toISOString(),
            idusrcreation: utilisateur.id
        });

        codeEntity = await manager.save(codeEntity);

        return codeEntity;
    }
    async verificationCode(manager: EntityManager, request: any) {
        const verification = await manager.createQueryBuilder(CodeVerificationEntity, "codeVerification")
            .innerJoinAndSelect("codeVerification.utilisateur", "utilisateur")
            .where("utilisateur.email = :email", { email: request.email })
            .andWhere("codeVerification.code = :code", { code: request.code })
            .andWhere("codeVerification.geler = 0", { code: request.code })
            .getOne()

        // Si le code existe
        if (verification) {

            // Si la date expiration du code est superieur à maintenant
            if (verification.dateExpiration.getTime() > new Date().getTime()) {
                // desactivation du code
                verification.geler = 1;
                await manager.save(verification);

                const user = verification.utilisateur;
                const confirmation = verification



                if (request.action == "confirmation-email") {
                    const user = verification.utilisateur;
                    user.emailConfirmation = new Date();
                    confirmation.dateLastConfirmation = new Date()
                    await manager.save(user);
                    await manager.save(confirmation);
                }

                // console.log('confirmation ===>', confirmation);
                // envoi de la reponse valide
                return {
                    etat: 'succes',
                    message: 'le code de vérification est valide',
                    data: {
                        user: user,
                        token_type: "Bearer",
                        expire_at: this.getExpirationTime(),
                        access_token: this.createAuthentificationToken(user.id),
                
                    }
                }
            } else {
                return {
                    etat: 'warning',
                    message: 'le code a expiré',
                    data: null
                }
            }
        } else {
            return {
                etat: 'warning',
                message: 'le code est invalide',
                data: null
            }
        }
    }
}
