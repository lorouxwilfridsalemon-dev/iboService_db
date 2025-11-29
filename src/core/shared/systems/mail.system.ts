import * as nodemailer from 'nodemailer';
import { getRepository } from 'typeorm';
//import { ParameterEntity } from 'src/database/entities/parameter.entity';

export class Mail{

    private static async transporter() {
        /**
         * { code:"SMTP-HOST", name:"Serveur", description: "Nom du serveur SMTP (smtp.domaine.ci)", $datatype:"TYPD-STRING" },
            { code:"SMTP-PORT", name:"Port", description: "Port utilisé par le serveur (587)", $datatype:"TYPD-NUMBER" },
            { code:"SMTP-SECURE", name:"sécuriser la connexion", description: "Sécuriser la connexion par un certifica SSL ou TLS", $datatype:"TYPD-BOOLEAN" },
            { code:"SMTP-USER", name:"Utilisateur", description: "Compte utilisateur qui enverra le mail", $datatype:"TYPD-STRING" },
            { code:"SMTP-PASS", name:"Mot de passe", description: "Mot de passe du compte utilisateur", $datatype:"TYPD-STRING" },

         */
        /*const paramRepository = getRepository(ParameterEntity); // you can also get it via getConnection().getRepository() or getManager().getRepository()
        const host: string = await (await paramRepository.findOne({ code: 'SMTP-HOST'})).stringValue;
        const port: number = await (await paramRepository.findOne({ code: 'SMTP-PORT'})).numberValue;
        const secure: boolean = await (await paramRepository.findOne({ code: 'SMTP-SECURE'})).booleanValue;
        const user: string = await (await paramRepository.findOne({ code: 'SMTP-USER'})).stringValue;
        const pass: string = await (await paramRepository.findOne({ code: 'SMTP-PASS'})).stringValue;

        return nodemailer.createTransport({
            host: host,
            port: port,
            secure: secure, // true for 465, false for other ports
            auth: {
                user: user, // generated ethereal user
                pass: pass // generated ethereal password 
            }
        });*/
    }

    public static async send(email: string, subject: string, content:string) {
       /* const transporter = await this.transporter();
        const  info = await transporter.sendMail({
            from: '"SYVAL" <syval@sudcontractors.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: content, // plain text body
            html: content
        });
        return info;*/
    }
}