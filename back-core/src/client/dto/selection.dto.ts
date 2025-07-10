import { IsNotEmpty, IsInt, IsPositive, Min, Max } from 'class-validator';

export class SelectionDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: "L'ID du menu est obligatoire." })
  menuId: number;

  @IsInt()
  @Min(1, { message: "Le jour de la semaine doit être compris entre 1 (Lundi) et 7 (Dimanche)." })
  @Max(7, { message: "Le jour de la semaine doit être compris entre 1 (Lundi) et 7 (Dimanche)." })
  @IsNotEmpty({ message: "Le jour de la semaine est obligatoire." })
  jourSemaine: number;

  @IsInt()
  @IsPositive({ message: "La quantité doit être un nombre positif." })
  @IsNotEmpty({ message: "La quantité est obligatoire." })
  quantite: number;
}