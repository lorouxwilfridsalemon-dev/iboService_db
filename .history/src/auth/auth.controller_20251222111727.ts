import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UtilisateurEntity } from './../database/utilisateur/utilisateur.entity';
import { ValidationPipe } from './../core/shared/pipes/validation.pipe';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto) {
        return this.authService.login(authCredentialDto);
    }

    // @Post('login')
    // @Transaction()
    // async login(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto, @TransactionManager() manager: EntityManager) {
    //     // console.log('Autehntification mobile');
        
    //     return this.authService.login(authCredentialDto, manager);
    // }

    @Get('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@CurrentUser() user: UtilisateurEntity) {
        return this.authService.logout(user) 
    }

    @Get('user')
    @UseGuards(JwtAuthGuard)
    getProfile(@CurrentUser() user: UtilisateurEntity) {        
        return this.authService.getProfile(user);
    }

    @Post('forgotPassword')
    async forgotPassword(@Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotmotDePasse(forgotPasswordDto);
    }
 
    @Post('changePassword')
    @UseGuards(JwtAuthGuard)
    @Transaction()
    async changePassword(@Body(ValidationPipe) resetPasswordDto: ResetPasswordDto, @CurrentUser() user: UtilisateurEntity, @TransactionManager() manager: EntityManager) {
        return await this.authService.changemotDePasse(resetPasswordDto, user, manager);
    }
    // @Post('verification-code')
    // @Transaction()
    // async verificationCode(@Body(ValidationPipe) verificationDto: any, @TransactionManager() manager: EntityManager) {
    //     return this.authService.verificationCode(manager, verificationDto);
    // }
}
