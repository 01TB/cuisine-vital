import { IsNotEmpty, IsUUID, IsDateString } from 'class-validator';

export class CreateBonCommandeDto {
  @IsUUID()
  @IsNotEmpty({ message: "L'ID de l'abonnement est obligatoire." })
  abonnementId: string;

  @IsDateString({}, { message: "La date de début de semaine doit être au format YYYY-MM-DD." })
  @IsNotEmpty({ message: "La date de début de semaine est obligatoire." })
  semaineDebut: string;

  @IsDateString({}, { message: "La date de fin de semaine doit être au format YYYY-MM-DD." })
  @IsNotEmpty({ message: "La date de fin de semaine est obligatoire." })
  semaineFin: string;
}