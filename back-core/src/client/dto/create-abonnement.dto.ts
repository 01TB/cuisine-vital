import { IsNotEmpty, IsUUID, IsInt, IsPositive, IsDateString } from 'class-validator';

export class CreateAbonnementDto {
  @IsUUID()
  @IsNotEmpty({ message: "L'ID du client est obligatoire." })
  clientId: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: "L'ID du type d'abonnement est obligatoire." })
  typeAbonnementId: number;

  @IsInt()
  @IsPositive({ message: "Le nombre d'employés doit être un nombre positif." })
  @IsNotEmpty({ message: "Le nombre d'employés est obligatoire." })
  nbEmployes: number;

  @IsDateString({}, { message: "La date de début doit être une date valide au format YYYY-MM-DD." })
  @IsNotEmpty({ message: "La date de début est obligatoire." })
  dateDebut: string;

  dateFin:string;

  actif?: boolean | null;

}