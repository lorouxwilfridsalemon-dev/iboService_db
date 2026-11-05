import { IsEmail, IsString, Length } from 'class-validator';

export class ForgotPasswordDto {

    @IsString()
    @IsEmail()
    readonly email: string; 
}