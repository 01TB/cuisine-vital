
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsDateString } from 'class-validator';

export class CreateStockEntryDto {
  @IsInt()
  @IsNotEmpty()
  ingredientId: number;

  @IsNumber()
  @IsPositive()
  quantite: number;

  @IsOptional()
  @IsDateString()
  datePeremption?: string;

  @IsNumber()
  @IsPositive()
  prixUnitaireAchat: number;
}

export class UseStockDto {
    @IsInt()
    @IsNotEmpty()
    ingredientId: number;

    @IsNumber()
    @IsPositive()
    quantite: number;
}
