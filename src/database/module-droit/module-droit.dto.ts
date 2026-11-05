import { DroitDto } from './../droit/droit.dto';
import { ModuleDto } from './../module/module.dto';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class ModuleDroitDto {


    @IsOptional()
    @IsInt()
    readonly id: number;

    @IsString()
    readonly libelle : string;

    @IsOptional()
    @IsString()
    readonly empty1 : string;

    @IsOptional()
    @IsString()
    readonly empty2 : string;

    @IsOptional()
    @IsString()
    readonly empty3 : string;

    @IsString()
    readonly dateCreation : string;

    @IsInt()
    readonly geler : number;

    @IsInt()
    readonly idusrcreation : number;

    @IsOptional()
    module : ModuleDto;

    @IsOptional()
    droit : DroitDto;

}