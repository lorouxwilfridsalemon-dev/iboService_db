import { IsString, IsInt, IsOptional } from 'class-validator';
import { ModuleDroitDto } from '../module-droit/module-droit.dto';

export class ModuleDto {


    @IsOptional()
    @IsInt()
    readonly id: number;

    @IsInt()
    readonly idSmo : number;

    @IsString()
    readonly libelle : string;

    @IsOptional()
    @IsString()
    readonly icone : string;

    @IsString()
    readonly lien : string;

    @IsOptional()
    @IsInt()
    readonly ordre : number;

    @IsOptional()
    @IsString()
    readonly empty1 : string;

    @IsOptional()
    @IsString()
    readonly empty2 : string;

    @IsOptional()
    @IsString()
    readonly empty3 : string;

    @IsInt()
    readonly geler : number;

    @IsString()
    readonly dateCreation : string;

    @IsInt()
    readonly idusrcreation : number;

    @IsOptional()
    readonly moduleDroit : ModuleDroitDto[];

}