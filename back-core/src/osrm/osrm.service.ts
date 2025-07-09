// osrm.service.ts
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OsrmService {
  private readonly logger = new Logger(OsrmService.name);
  // Remplacez par votre clé API si nécessaire
  private readonly apiKey = '5b3ce3597851110001cf624831368d2436794a45a1e24b8edb896c5d'; 
  private readonly baseUrl = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

  async getItineraire(points: [number, number][]) {
    if (!points || points.length < 2) {
      throw new HttpException('Au moins deux points sont requis pour calculer un itinéraire.', HttpStatus.BAD_REQUEST);
    }

    try {
      this.logger.log(`Requesting route for ${points.length} waypoints.`);
      
      const response = await axios.post(
        this.baseUrl,
        {
          // --- CORRECTION CLÉ ---
          // On envoie les points directement sans les inverser.
          // Le format [longitude, latitude] est déjà fourni par le livreur.service.
          coordinates: points,
        },
        {
          headers: {
            Authorization: this.apiKey,
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
          },
        },
      );
      
      this.logger.log('Route successfully fetched from OpenRouteService');
      return response.data;

    } catch (error) {
      this.logger.error('Error calling OpenRouteService API', error.response?.data || error.message);
      throw new HttpException(
        'Failed to fetch route from external service.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}