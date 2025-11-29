import { IsString, IsInt, IsOptional } from 'class-validator';

export class ClientDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsString()
  readonly nomPrenom: string;

  @IsString()
  readonly numero: string;

  @IsOptional()
  @IsString()
  readonly empty1: string;

  @IsOptional()
  @IsString()
  readonly empty2: string;

  @IsOptional()
  @IsString()
  readonly empty3: string;

  @IsInt()
  readonly geler: number;

  @IsString()
  readonly dateCreation: string;

  @IsInt()
  readonly idusrcreation: number;

  @IsOptional()
  @IsInt()
  readonly typeClient: number;
}

