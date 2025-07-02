// src/App.js

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from '@react-google-maps/api';
import './App.css';

// --- Données simulées ---
const mockLivreurs = [
  { id: "11111111-1111-1111-1111-111111111111", nom: "Rabe", prenom: "Koto" },
  { id: "22222222-2222-2222-2222-222222222222", nom: "Rakoto", prenom: "Fara" },
];

const mockRouteData = {
  livraisonsDansOrdre: [
    { id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", adresse: "Palais de la Reine (Rova), Antananarivo", statut: "ASSIGNEE", localisation: "Point(47.5323 -18.9227)" },
    { id: "dddddddd-dddd-dddd-dddd-dddddddddddd", adresse: "Gare de Soarano, Antananarivo", statut: "ASSIGNEE", localisation: "Point(47.5222 -18.9038)" },
    { id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", adresse: "Marché d'Analakely, Antananarivo", statut: "ASSIGNEE", localisation: "Point(47.5255 -18.9069)" },
    { id: "cccccccc-cccc-cccc-cccc-cccccccccccc", adresse: "Lac Anosy, Antananarivo", statut: "ASSIGNEE", localisation: "Point(47.5186 -18.9171)" },
  ],
  distanceTotaleMetres: 6133,
  dureeTotaleSecondes: 1245,
};

// --- CONFIGURATION DE LA CARTE ---
const mapContainerStyle = { width: '100vw', height: '70vh' };
const antananarivoCenter = { lat: -18.9144, lng: 47.5317 }; // Centre d'Antananarivo

// --- FONCTION UTILITAIRE ---
const parseCoords = (localisation) => {
  if (!localisation) return null;
  const match = localisation.match(/Point\(([+-]?\d*\.?\d+)\s+([+-]?\d*\.?\d+)\)/);
  if (!match) return null;
  return { 
    lat: parseFloat(match[2]), 
    lng: parseFloat(match[1]) 
  };
};

function App() {
  const [map, setMap] = useState(null);
  const [livreurs, setLivreurs] = useState([]);
  const [selectedLivreurId, setSelectedLivreurId] = useState('');
  const [routeData, setRouteData] = useState(null);
  const [directionsResult, setDirectionsResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Charger l'API Google Maps
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao',
    libraries: ['directions'],
  });

  // 2. Charger les livreurs simulés au démarrage
  useEffect(() => {
    setLivreurs(mockLivreurs);
    if (mockLivreurs.length > 0) {
      setSelectedLivreurId(mockLivreurs[0].id);
    }
  }, []);

  // 3. Calculer l'itinéraire avec l'API Directions
  const calculateDirections = useCallback(async (deliveries) => {
    if (!isLoaded || !window.google || deliveries.length < 2) return;

    const directionsService = new window.google.maps.DirectionsService();
    
    // Premier point comme origine
    const origin = parseCoords(deliveries[0].localisation);
    // Dernier point comme destination
    const destination = parseCoords(deliveries[deliveries.length - 1].localisation);
    // Points intermédiaires
    const waypoints = deliveries.slice(1, -1).map(delivery => ({
      location: parseCoords(delivery.localisation),
      stopover: true
    }));

    try {
      const result = await new Promise((resolve, reject) => {
        directionsService.route({
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
          optimizeWaypoints: false, // Garder l'ordre défini
          region: 'MG', // Madagascar
        }, (response, status) => {
          if (status === 'OK') {
            resolve(response);
          } else {
            reject(new Error('Erreur lors du calcul de l\'itinéraire: ' + status));
          }
        });
      });

      setDirectionsResult(result);
      setError('');
      
      // Ajuster la vue de la carte sur l'itinéraire
      if (map && result.routes[0]) {
        const bounds = new window.google.maps.LatLngBounds();
        result.routes[0].legs.forEach(leg => {
          leg.steps.forEach(step => {
            bounds.extend(step.start_location);
            bounds.extend(step.end_location);
          });
        });
        map.fitBounds(bounds);
      }
      
    } catch (err) {
      console.error('Erreur directions:', err);
      setError('Impossible de calculer l\'itinéraire: ' + err.message);
      setDirectionsResult(null);
    }
  }, [isLoaded, map]);

  // 4. Gérer le clic sur le bouton
  const handleCalculateRoute = async () => {
    if (!selectedLivreurId || !isLoaded) return;
    
    setIsLoading(true);
    setError('');
    setDirectionsResult(null);
    setRouteData(null);

    // Simulation du délai réseau
    setTimeout(async () => {
      if (selectedLivreurId === '11111111-1111-1111-1111-111111111111') {
        setRouteData(mockRouteData);
        // Calculer l'itinéraire réel avec l'API Directions
        await calculateDirections(mockRouteData.livraisonsDansOrdre);
      } else {
        setError('Aucun itinéraire à calculer pour ce livreur.');
      }
      setIsLoading(false);
    }, 500);
  };

  // 5. Fonctions pour gérer l'instance de la carte
  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  // 6. Options pour le rendu des directions
  const directionsOptions = {
    suppressMarkers: true, // On va afficher nos propres marqueurs
    polylineOptions: {
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 5,
    }
  };

  // 7. Rendu du composant
  return (
    <div className="App">
      <header className="App-header">
        <h1>Calculateur d'Itinéraire Livreur - Antananarivo</h1>
        <div className="controls">
          <select 
            value={selectedLivreurId} 
            onChange={(e) => setSelectedLivreurId(e.target.value)}
            disabled={isLoading}
          >
            <option value="">-- Sélectionnez un livreur --</option>
            {livreurs.map(livreur => (
              <option key={livreur.id} value={livreur.id}>
                {livreur.prenom} {livreur.nom}
              </option>
            ))}
          </select>
          <button 
            onClick={handleCalculateRoute} 
            disabled={isLoading || !selectedLivreurId || !isLoaded}
          >
            {isLoading ? 'Calcul en cours...' : "Calculer l'itinéraire"}
          </button>
        </div>
        {error && <p className="error" style={{color: 'red', margin: '10px 0'}}>{error}</p>}
        {!isLoaded && <p>Chargement de l'API Google Maps...</p>}
      </header>

      <main>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={antananarivoCenter}
            zoom={13}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              restriction: {
                latLngBounds: {
                  north: -18.8,
                  south: -19.0,
                  east: 47.7,
                  west: 47.3,
                },
                strictBounds: false,
              },
            }}
          >
            {/* Affichage de l'itinéraire calculé */}
            {directionsResult && (
              <DirectionsRenderer
                directions={directionsResult}
                options={directionsOptions}
              />
            )}
            
            {/* Marqueurs personnalisés pour les points de livraison */}
            {routeData?.livraisonsDansOrdre?.map((livraison, index) => {
              const position = parseCoords(livraison.localisation);
              if (!position) return null;
              
              return (
                <Marker
                  key={livraison.id}
                  position={position}
                  label={{
                    text: `${index + 1}`,
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  }}
                  title={`${index + 1}. ${livraison.adresse}`}
                  icon={{
                    path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                    fillColor: index === 0 ? '#00FF00' : 
                             index === routeData.livraisonsDansOrdre.length - 1 ? '#FF0000' : '#4285F4',
                    fillOpacity: 1,
                    strokeColor: 'white',
                    strokeWeight: 2,
                    scale: 15,
                  }}
                />
              );
            })}
          </GoogleMap>
        ) : (
          <div style={{height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <p>Chargement de la carte...</p>
          </div>
        )}
        
        {/* Résultats détaillés */}
        {routeData && !error && (
          <div className="results" style={{padding: '20px', backgroundColor: '#f5f5f5', margin: '20px'}}>
            <h2>Résultats de l'itinéraire</h2>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
              <div>
                <p><strong>Distance simulée:</strong> {(routeData.distanceTotaleMetres / 1000).toFixed(2)} km</p>
                <p><strong>Durée simulée:</strong> {Math.round(routeData.dureeTotaleSecondes / 60)} minutes</p>
              </div>
              {directionsResult && directionsResult.routes[0] && (
                <div>
                  <p><strong>Distance réelle:</strong> {(directionsResult.routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0) / 1000).toFixed(2)} km</p>
                  <p><strong>Durée réelle:</strong> {Math.round(directionsResult.routes[0].legs.reduce((total, leg) => total + leg.duration.value, 0) / 60)} minutes</p>
                </div>
              )}
            </div>
            
            <h3>Ordre des livraisons:</h3>
            <ol style={{lineHeight: '1.6'}}>
              {routeData.livraisonsDansOrdre?.map((livraison, index) => {
                const coords = parseCoords(livraison.localisation);
                const isStart = index === 0;
                const isEnd = index === routeData.livraisonsDansOrdre.length - 1;
                
                return (
                  <li key={livraison.id} style={{marginBottom: '8px'}}>
                    <strong style={{color: isStart ? '#00AA00' : isEnd ? '#CC0000' : '#0066CC'}}>
                      {isStart ? '🚀 ' : isEnd ? '🏁 ' : '📍 '}
                      {livraison.adresse}
                    </strong>
                    {coords && (
                      <div style={{color: '#666', fontSize: '0.85em', marginTop: '2px'}}>
                        Coordonnées: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
            
            {directionsResult && (
              <div style={{marginTop: '15px', padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '5px'}}>
                <p style={{margin: 0, color: '#00AA00', fontWeight: 'bold'}}>
                  ✅ Itinéraire calculé avec succès via l'API Google Directions
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;