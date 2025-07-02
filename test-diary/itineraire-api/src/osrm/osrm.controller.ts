// osrm.controller.ts

import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { OsrmService } from './osrm.service';
import { IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// On crée une classe DTO (Data Transfer Object) pour valider le corps de la requête
export class CreateItineraryDto {
  @IsArray()
  @ArrayMinSize(2, { message: 'Il faut au moins 2 points (départ et arrivée).' })
  // @ValidateNested({ each: true }) // Plus complexe, on garde simple pour l'instant
  // @Type(() => Array<number>)
  points: [number, number][];
}


@Controller()
export class OsrmController {
  constructor(private readonly osrmService: OsrmService) {}

  @Post('itineraire')
  // On utilise le DTO avec un ValidationPipe pour une validation automatique
  async getItineraire(@Body(new ValidationPipe()) body: CreateItineraryDto) {
    return this.osrmService.getItineraire(body.points);
  }
}