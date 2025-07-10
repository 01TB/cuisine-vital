import { useMap } from 'react-leaflet'; // Assure-toi d'importer useMap
import { useEffect } from 'react';

function MapResizer() {
  const map = useMap(); // Récupère l'instance de la carte Leaflet
  useEffect(() => {
    map.invalidateSize(); // Force le redimensionnement après le premier rendu
  }, [map]); 
  return null; 
}

export default MapResizer;