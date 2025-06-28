import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class CreateAbonnementDto {
  @IsNotEmpty()
  @IsUUID()
  clientId: string;

  // L'ID de TypesAbonnement est un 'integer'
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  typeAbonnementId: number; 

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  nbEmployes: number;

  @IsNotEmpty()
  @IsDateString()
  dateDebut: string;

  @IsOptional()
  @IsDateString()
  dateFin?: string | null;
}