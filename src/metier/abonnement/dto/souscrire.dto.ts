import { IsString, IsIn } from 'class-validator';

/**
 * DTO pour la souscription à un abonnement.
 */
export class SouscrireDto {
  /**
   * Code du plan souhaité.
   * Valeurs possibles : 'gratuit', 'mensuel', 'a_vie'
   */
  @IsString()
  @IsIn(['gratuit', 'mensuel', 'a_vie'], {
    message:
      'Le code du plan doit être : gratuit, mensuel ou a_vie',
  })
  readonly codePlan: string;
} 