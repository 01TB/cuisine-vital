import { PartialType } from '@nestjs/mapped-types';
import { CreateAbonnementDto } from './create-abonnement.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAbonnementDto extends PartialType(CreateAbonnementDto) {
  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}