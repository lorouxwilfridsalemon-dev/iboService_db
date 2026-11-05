import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { UtilisateurEntity } from '../../../database/utilisateur/utilisateur.entity';

/**
 * Autorise uniquement les utilisateurs avec le profil "Administrateur".
 * À utiliser APRÈS JwtAuthGuard :
 *   @UseGuards(JwtAuthGuard, AdminGuard)
 */
@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  // ⚠️ À CONFIRMER : le libellé EXACT du profil admin en base
  private static readonly LIBELLE_ADMIN = 'Administrateur';

  constructor(
    @InjectRepository(UtilisateurEntity)
    private readonly utilisateurRepository: Repository<UtilisateurEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

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

    if (libelleProfil !== AdminGuard.LIBELLE_ADMIN) {
      this.logger.warn(
        `Accès admin refusé : user#${user.id} (profil: "${libelleProfil ?? 'aucun'}")`,
      );
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }

    return true;
  }
} 