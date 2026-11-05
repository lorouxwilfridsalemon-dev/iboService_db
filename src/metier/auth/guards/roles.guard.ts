import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { UtilisateurEntity } from '../../../database/utilisateur/utilisateur.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable() 
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private readonly reflector: Reflector,

    @InjectRepository(UtilisateurEntity)
    private readonly utilisateurRepository: Repository<UtilisateurEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Récupère les rôles attendus via @Roles()
    const rolesRequis = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Si aucun rôle n'est défini → laisse passer (JwtAuthGuard gère)
    if (!rolesRequis || rolesRequis.length === 0) {
      return true;
    }

    // 3. Récupère l'utilisateur (peuplé par JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    // 4. Recharge le profil depuis la BDD (fiable, indépendant du JWT)
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id: user.id },
      relations: ['profil'],
    });

    if (!utilisateur) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    if ((utilisateur as any).geler === 1) {
      throw new ForbiddenException('Ce compte est désactivé');
    }

    const libelleProfil = (utilisateur as any).profil?.libelle;

    if (!libelleProfil) {
      throw new ForbiddenException("Aucun profil associé à cet utilisateur");
    }

    // 5. Vérifie l'autorisation
    if (!rolesRequis.includes(libelleProfil)) {
      this.logger.warn(
        `Accès refusé pour user#${user.id} (profil: "${libelleProfil}") ` +
        `— rôles requis: [${rolesRequis.join(', ')}]`,
      );
      throw new ForbiddenException(
        "Vous n'avez pas les droits nécessaires pour accéder à cette ressource",
      );
    }

    return true;
  }
}