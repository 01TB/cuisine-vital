import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { SelectionDto } from './selection.dto';

export class SaveSelectionsDto {
  @IsArray()
  @ValidateNested({ each: true }) // Valide chaque objet du tableau selon les règles de SelectionDto
  @ArrayMinSize(1, { message: "Vous devez fournir au moins une sélection." })
  @Type(() => SelectionDto) // Indique à class-transformer comment instancier les objets du tableau
  selections: SelectionDto[];
}