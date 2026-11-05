import { IsEmail, IsString, Length } from 'class-validator';

export class ResetPasswordDto {

    // @IsString()
    // @IsEmail()
    // readonly email: string;

    @IsString()
    readonly password: string;

    @IsString()
    readonly passwordConfirm: string;
}