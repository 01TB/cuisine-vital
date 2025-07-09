import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class RecetteDto {
  @IsInt()
  @IsNotEmpty()
  ingredientId: number;

  @IsString()
  @IsNotEmpty()
  quantite: string;
}

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  prixCarte: string;

  @IsNumber()
  @IsNotEmpty()
  tempsPreparation: number;

  @IsUrl()
  @IsOptional()
  photoUrl?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecetteDto)
  recettes: RecetteDto[];
}
