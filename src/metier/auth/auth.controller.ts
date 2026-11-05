// import {
//   Body,
//   Controller,
//   Get,
//   Post,
//   UseGuards,
//   ValidationPipe,
// } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { EntityManager, Transaction, TransactionManager } from 'typeorm';

// // ✅ CORRIGÉ : imports relatifs (au lieu de src/auth/...)
// import { RegisterDto } from './dto/register.dto';
// import { AuthCredentialDto } from './dto/auth-credentials.dto';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { CurrentUser } from './decorators/current-user.decorator';
// import { ForgotPasswordDto } from './dto/forgot-password.dto';
// import { ResetPasswordDto } from './dto/reset-password.dto';

// // ✅ GARDE : import absolu pour l'entité (dans database/)
// import { UtilisateurEntity } from 'src/database/utilisateur/utilisateur.entity';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('login')
//   async login(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto) {
//     return this.authService.login(authCredentialDto);
//   }

//   @Post('register')
//   async register(@Body(ValidationPipe) registerDto: RegisterDto) {
//     return this.authService.register(registerDto);
//   }

//   @Get('logout')
//   @UseGuards(JwtAuthGuard)
//   async logout(@CurrentUser() user: UtilisateurEntity) {
//     return this.authService.logout(user);
//   }

//   @Get('user')
//   @UseGuards(JwtAuthGuard)
//   getProfile(@CurrentUser() user: UtilisateurEntity) {
//     return this.authService.getProfile(user);
//   }

//   @Post('forgotPassword')
//   async forgotPassword(
//     @Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto,
//   ) {
//     return this.authService.forgotmotDePasse(forgotPasswordDto);
//   }

//   @Post('changePassword')
//   @UseGuards(JwtAuthGuard)
//   @Transaction()
//   async changePassword(
//     @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto,
//     @CurrentUser() user: UtilisateurEntity,
//     @TransactionManager() manager: EntityManager,
//   ) {
//     return await this.authService.changemotDePasse(
//       resetPasswordDto,
//       user,
//       manager,
//     );
//   }
// }

import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import {
  EntityManager,
  Transaction,
  TransactionManager,
} from 'typeorm';

import { AuthService } from './auth.service';

// DTO
import { RegisterDto } from './dto/register.dto';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

// Guard
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// Decorator
import { CurrentUser } from './decorators/current-user.decorator';

// Entity
import { UtilisateurEntity } from 'src/database/utilisateur/utilisateur.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // ============================================================
  // LOGIN
  // ============================================================

  /**
   * POST /auth/login
   *
   * Body :
   *
   * {
   *   "contact": "0505454863",
   *   "password": "123456"
   * }
   */
  @Post('login')
  async login(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    authCredentialDto: AuthCredentialDto,
  ) {
    return this.authService.login(
      authCredentialDto,
    );
  }

  // ============================================================
  // REGISTER
  // ============================================================

  /**
   * POST /auth/register
   */
  @Post('register')
  async register(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    registerDto: RegisterDto,
  ) {
    return this.authService.register(
      registerDto,
    );
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  /**
   * GET /auth/logout
   *
   * Header :
   *
   * Authorization: Bearer <TOKEN>
   */
  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser()
    user: UtilisateurEntity,
  ) {
    return this.authService.logout(
      user,
    );
  }

  // ============================================================
  // PROFIL UTILISATEUR
  // ============================================================

  /**
   * GET /auth/user
   *
   * Header :
   *
   * Authorization: Bearer <TOKEN>
   */
  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @CurrentUser()
    user: UtilisateurEntity,
  ) {
    return this.authService.getProfile(
      user,
    );
  }

  // ============================================================
  // MOT DE PASSE OUBLIÉ
  // ============================================================

  /**
   * POST /auth/forgotPassword
   *
   * Body :
   *
   * {
   *   "email": "example@gmail.com"
   * }
   */
  @Post('forgotPassword')
  async forgotPassword(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.authService.forgotmotDePasse(
      forgotPasswordDto,
    );
  }

  // ============================================================
  // CHANGEMENT MOT DE PASSE
  // ============================================================

  /**
   * POST /auth/changePassword
   *
   * Header :
   *
   * Authorization: Bearer <TOKEN>
   *
   * Body :
   *
   * {
   *   "password": "nouveauMotDePasse",
   *   "passwordConfirm": "nouveauMotDePasse"
   * }
   */
  @Post('changePassword')
  @UseGuards(JwtAuthGuard)
  @Transaction()
  async changePassword(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    resetPasswordDto: ResetPasswordDto,

    @CurrentUser()
    user: UtilisateurEntity,

    @TransactionManager()
    manager: EntityManager,
  ) {
    return this.authService.changemotDePasse(
      resetPasswordDto,
      user,
      manager,
    );
  }
}