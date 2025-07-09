import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  nom: string;

  @IsNumber()
  quantite_stock: number;

  @IsString()
  unite_mesure: string;

  @IsNumber()
  cout: number;

  @IsDateString()
  @IsOptional()
  date_achat?: Date;
}
