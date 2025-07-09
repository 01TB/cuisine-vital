import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  nom: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  prix: number;

  @IsBoolean()
  @IsOptional()
  valide?: boolean;
}
