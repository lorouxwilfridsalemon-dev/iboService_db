import { Injectable, Logger, HttpException, HttpStatus, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UtilisateurEntity } from 'src/database/utilisateur/utilisateur.entity';
import { CreerUtilisateurDto, ModifierUtilisateurDto } from './utilisateur-metier.dto';

@Injectable()
export class UtilisateurMetierService {
  private readonly logger = new Logger(UtilisateurMetierService.name);

  constructor(
    @InjectRepository(UtilisateurEntity)
    private readonly utilisateurRepository: Repository<UtilisateurEntity>,
  ) {}

  async findAll(): Promise<UtilisateurEntity[]> {
    try {
      const utilisateurs = await this.utilisateurRepository.find({
        relations: ['profil'],
        order: { dateCreation: 'DESC' } as any,
      });
      this.logger.log(`${utilisateurs.length} utilisateurs trouvés`);
      return utilisateurs;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
      throw new HttpException(
        'Erreur lors de la récupération des utilisateurs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: number): Promise<UtilisateurEntity> {
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id } as any,
      relations: ['profil', 'annonces', 'notifications', 'messagesEnvoyes', 'messagesRecus'],
    });

    if (!utilisateur) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }
    return utilisateur;
  }

  /**
   * ✅ RÉÉCRIT : reçoit CreerUtilisateurDto (sans geler/dateCreation/
   * idusrcreation) — le service les définit lui-même côté serveur.
   */
  async create(dto: CreerUtilisateurDto, idUsrConnecte: number): Promise<UtilisateurEntity> {
    const emailExistant = await this.utilisateurRepository.findOne({
      where: { email: dto.email } as any,
    });
    if (emailExistant) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    const motDePasseHache = await bcrypt.hash(dto.motDePasse, 10);

    // ✅ CORRIGÉ (2e passe) : 'as Partial<UtilisateurEntity>' au lieu de
    // 'as any' — le 'any' empêchait TypeScript de savoir quelle
    // signature de .create() utiliser (il choisissait par défaut celle
    // qui accepte un TABLEAU, d'où l'erreur en cascade sur .save()).
    const utilisateur: UtilisateurEntity = this.utilisateurRepository.create({
      nom: dto.nom,
      prenom: dto.prenom,
      pseudo: dto.pseudo ?? null,
      email: dto.email,
      contact: dto.contact ?? null,
      motDePasse: motDePasseHache,
      description: dto.description ?? null,
      language: dto.language ?? 'fr',
      devise: dto.devise ?? 'XOF',
      geler: 0,
      dateCreation: new Date(),
      idusrcreation: idUsrConnecte,
      ...(dto.id_pro ? { profil: { id: dto.id_pro } as any } : {}),
    } as Partial<UtilisateurEntity>);

    const sauvegarde: UtilisateurEntity = await this.utilisateurRepository.save(utilisateur);
    this.logger.log(`Nouvel utilisateur créé: ${sauvegarde.email}`);
    return sauvegarde;
  }

  /**
   * ✅ RÉÉCRIT : reçoit ModifierUtilisateurDto — 'geler' est converti en
   * entier explicitement (le mat-slide-toggle envoie un booléen).
   */
  async update(id: number, dto: ModifierUtilisateurDto): Promise<UtilisateurEntity> {
    const utilisateur = await this.findById(id);

    if (dto.email && dto.email !== utilisateur.email) {
      const emailExistant = await this.utilisateurRepository.findOne({
        where: { email: dto.email } as any,
      });
      if (emailExistant) {
        throw new ConflictException('Cet email est déjà utilisé par un autre utilisateur');
      }
      utilisateur.email = dto.email;
    }

    if (dto.nom !== undefined) utilisateur.nom = dto.nom;
    if (dto.prenom !== undefined) utilisateur.prenom = dto.prenom;
    if (dto.pseudo !== undefined) utilisateur.pseudo = dto.pseudo;
    if (dto.contact !== undefined) utilisateur.contact = dto.contact;
    if (dto.description !== undefined) utilisateur.description = dto.description;
    if (dto.language !== undefined) utilisateur.language = dto.language;
    if (dto.devise !== undefined) utilisateur.devise = dto.devise;

    if (dto.motDePasse) {
      utilisateur.motDePasse = await bcrypt.hash(dto.motDePasse, 10);
    }

    // ✅ CORRIGÉ : convertit explicitement en entier (0/1), que la
    // valeur reçue soit déjà un nombre ou un booléen (mat-slide-toggle).
    if (dto.geler !== undefined) {
      utilisateur.geler = dto.geler === true || dto.geler === 1 ? 1 : 0;
    }

    if (dto.id_pro !== undefined) {
      (utilisateur as any).profil = { id: dto.id_pro };
    }

    const sauvegarde = await this.utilisateurRepository.save(utilisateur);
    this.logger.log(`Utilisateur mis à jour: ${sauvegarde.email}`);
    return sauvegarde;
  }

  async delete(id: number): Promise<{ message: string }> {
    const utilisateur = await this.findById(id);
    await this.utilisateurRepository.remove(utilisateur);
    this.logger.log(`Utilisateur supprimé: ID ${id}`);
    return { message: `Utilisateur avec l'ID ${id} supprimé avec succès` };
  }

  async search(criteria: {
    nom?: string;
    prenom?: string;
    email?: string;
    profil?: number;
  }): Promise<UtilisateurEntity[]> {
    const queryBuilder = this.utilisateurRepository
      .createQueryBuilder('utilisateur')
      .leftJoinAndSelect('utilisateur.profil', 'profil');

    if (criteria.nom) {
      queryBuilder.andWhere('utilisateur.nom LIKE :nom', { nom: `%${criteria.nom}%` });
    }
    if (criteria.prenom) {
      queryBuilder.andWhere('utilisateur.prenom LIKE :prenom', { prenom: `%${criteria.prenom}%` });
    }
    if (criteria.email) {
      queryBuilder.andWhere('utilisateur.email LIKE :email', { email: `%${criteria.email}%` });
    }
    if (criteria.profil) {
      queryBuilder.andWhere('profil.id = :profilId', { profilId: criteria.profil });
    }

    return queryBuilder.getMany();
  }
} 