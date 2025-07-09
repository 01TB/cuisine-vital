import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nom: string;

  @IsEmail()
  email: string;

  @IsString()
  mot_de_passe: string;

  @IsNumber()
  id_role: number;
}
