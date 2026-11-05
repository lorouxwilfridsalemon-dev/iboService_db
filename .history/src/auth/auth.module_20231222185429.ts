// import { MailModule } from './../mail/mail.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UtilisateurModule } from 'src/database/utilisateur/utilisateur.module';
import { jwtConstants } from './constants';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    UtilisateurModule,
    // MailModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1 days' },
    }),
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy,MailService],
  controllers: [AuthController],
})
export class AuthModule {}
