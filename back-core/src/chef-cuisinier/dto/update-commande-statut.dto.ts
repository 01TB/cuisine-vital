import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateCommandeStatutDto {
  @IsInt()
  @IsNotEmpty()
  statutId: number;
}
