import { IsUUID, IsDateString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateAbonnementDto {
    @IsUUID()
    clientId: string;

    @IsInt()
    nbEmployes: number;

    @IsDateString()
    dateDebut: string;

    @IsOptional()
    @IsDateString()
    dateFin?: string;

    @IsOptional()
    @IsBoolean()
    actif?: boolean;

    @IsUUID()
    typeAbonnementId: string;
}

export class UpdateAbonnementDto {
    @IsOptional()
    @IsUUID()
    clientId?: string;

    @IsOptional()
    @IsInt()
    nbEmployes?: number;

    @IsOptional()
    @IsDateString()
    dateDebut?: string;

    @IsOptional()
    @IsDateString()
    dateFin?: string;

    @IsOptional()
    @IsBoolean()
    actif?: boolean;

    @IsOptional()
    @IsUUID()
    typeAbonnementId?: string;
}
