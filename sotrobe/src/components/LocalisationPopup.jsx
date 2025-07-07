import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import L from 'leaflet';

// Fix pour le problème d'icône de marqueur par défaut avec Webpack/CRA
if (typeof L !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

const LocalisationPopup = ({ show, handleClose, onSelectLocation }) => {
  const primaryColor = '#f0ad4e';
  const softInputStyle = "form-control border-0 bg-secondary-subtle rounded-pill py-2 px-3";
  const softButtonStyle = "btn rounded-pill fw-semibold py-2 px-4";

  const ANTANANARIVO_CENTER = [-18.8792, 47.5079];
  const ANTANANARIVO_BOUNDS = [
    [-19.05, 47.38],
    [-18.75, 47.65]
  ];
  const NOMINATIM_VIEWBOX = '47.38,-19.05,47.65,-18.75';

  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Nouvel état pour le chargement
  const [error, setError] = useState(null); // Pour afficher les erreurs
  const mapRef = useRef(null);

  const isWithinAntananarivoBounds = (lat, lng) => {
    const [[minLat, minLng], [maxLat, maxLng]] = ANTANANARIVO_BOUNDS;
    return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
  };

  const MapEventsHandler = () => {
    const map = useMap();
    mapRef.current = map;

    useMapEvents({
      click(e) {
        if (isWithinAntananarivoBounds(e.latlng.lat, e.latlng.lng)) {
          setPosition(e.latlng);
          fetchAddress(e.latlng);
        } else {
          setError('Veuillez sélectionner une position à l\'intérieur d\'Antananarivo.');
        }
      },
      load: () => {
        map.fitBounds(ANTANANARIVO_BOUNDS, { padding: [10, 10] });
      }
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, 15);
        } else {
            map.setView(ANTANANARIVO_CENTER, 12);
        }
    }, [position, map]);

    return null;
  };

  const fetchAddress = async (latlng) => {
    setIsLoading(true); // Démarre le chargement
    setError(null); // Réinitialise l'erreur
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}`);
      const data = await response.json();
      setAddress(data.display_name || 'Adresse inconnue');
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Impossible de récupérer l\'adresse');
      setError('Impossible de récupérer l\'adresse.');
    } finally {
      setIsLoading(false); // Arrête le chargement
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Veuillez entrer une adresse à rechercher.');
      return;
    }
    setIsLoading(true); // Démarre le chargement
    setError(null); // Réinitialise l'erreur
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(searchQuery)}&viewbox=${NOMINATIM_VIEWBOX}&bounded=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newPosition = { lat: parseFloat(lat), lng: parseFloat(lon) };

        if (isWithinAntananarivoBounds(newPosition.lat, newPosition.lng)) {
          setPosition(newPosition);
          setAddress(display_name);
        } else {
          setError('Le premier résultat de recherche est en dehors d\'Antananarivo. Veuillez être plus précis ou sélectionner sur la carte.');
        }
      } else {
        setError('Aucun résultat trouvé pour la recherche à Antananarivo.');
      }
    } catch (error) {
      console.error('Error during search:', error);
      setError('Erreur lors de la recherche.');
    } finally {
      setIsLoading(false); // Arrête le chargement
    }
  };

  const handleLocateMe = () => {
    setError(null); // Réinitialise l'erreur
    if (navigator.geolocation) {
      setIsLoading(true); // Démarre le chargement
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLoading(false); // Arrête le chargement en cas de succès
          const newPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          if (isWithinAntananarivoBounds(newPosition.lat, newPosition.lng)) {
            setPosition(newPosition);
            fetchAddress(newPosition); // fetchAddress gérera son propre loading
          } else {
            setError('Votre position actuelle est en dehors d\'Antananarivo. Veuillez sélectionner manuellement sur la carte.');
          }
        },
        (err) => {
          setIsLoading(false); // Arrête le chargement en cas d'erreur
          console.error('Error getting location:', err);
          setError('Impossible de récupérer votre position actuelle. Veuillez autoriser la localisation ou chercher manuellement.');
        }
      );
    } else {
      setError('La géolocalisation n\'est pas supportée par votre navigateur.');
    }
  };

  const handleSaveLocation = () => {
    if (position) {
      onSelectLocation(position, address);
      handleClose();
    } else {
      setError('Veuillez sélectionner une position sur la carte ou utiliser la géolocalisation.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton style={{ backgroundColor: primaryColor, color: 'white' }}>
        <Modal.Title className="fw-bold">Sélectionner un lieu de livraison</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {/* Champ de recherche */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold text-muted">Rechercher une adresse à Antananarivo</Form.Label>
          <div className="d-flex">
            <Form.Control
              type="text"
              placeholder="Ex: Ambohijatovo, Analakely..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={softInputStyle}
              style={{ borderRadius: '0.25rem' }}
              disabled={isLoading} // Désactiver le champ pendant le chargement
            />
            <button 
                type="button"
                onClick={handleSearch} 
                className={`${softButtonStyle} ms-2`}
                style={{ backgroundColor: primaryColor, color: 'white', minWidth: '100px' }}
                disabled={isLoading} // Désactiver le bouton pendant le chargement
            >
                {isLoading ? 'Recherche...' : 'Rechercher'} {/* Texte dynamique */}
            </button>
          </div>
        </Form.Group>

        {/* Bouton Utiliser ma position actuelle */}
        <div className="d-grid gap-2 mb-3">
            <button 
                type="button"
                onClick={handleLocateMe} 
                className={`${softButtonStyle} btn-outline-secondary`}
                disabled={isLoading} // Désactiver le bouton pendant le chargement
            >
                {isLoading ? 'Localisation...' : 'Utiliser ma position actuelle (si à Antananarivo)'} {/* Texte dynamique */}
            </button>
        </div>
        
        {/* Message de chargement ou d'erreur */}
        {isLoading && (
            <div className="text-center mb-3">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement de la localisation...</span>
                </div>
                <p className="text-muted mt-2">Chargement de la localisation...</p>
            </div>
        )}
        {error && (
            <div className="alert alert-danger mt-3" role="alert">
                {error}
            </div>
        )}

        {/* Conteneur de la carte */}
        <div className="rounded-3 overflow-hidden shadow-sm" style={{ height: '400px', width: '100%' }}>
          <MapContainer 
            center={ANTANANARIVO_CENTER}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
            maxBounds={ANTANANARIVO_BOUNDS}
            minZoom={10}
            maxZoom={18}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEventsHandler />
            {position && <Marker position={position}></Marker>}
          </MapContainer>
        </div>

        {/* Affichage de la position et de l'adresse sélectionnée */}
        {position && (
          <div className="mt-3 p-3 bg-light-subtle rounded-3">
            <p className="mb-1 text-muted">
                <strong style={{ color: primaryColor }}>Position sélectionnée :</strong> Lat {position.lat.toFixed(5)}, Lng {position.lng.toFixed(5)}
            </p>
            <p className="mb-0 text-muted">
                <strong style={{ color: primaryColor }}>Adresse estimée :</strong> {address}
            </p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between p-3 border-top">
        <button 
            type="button" 
            onClick={handleClose} 
            className={`${softButtonStyle} btn-outline-secondary`}
            disabled={isLoading} // Désactiver pendant le chargement
        >
            Annuler
        </button>
        <button 
            type="button" 
            onClick={handleSaveLocation} 
            className={`${softButtonStyle}`} 
            style={{ backgroundColor: primaryColor, color: 'white' }}
            disabled={isLoading || !position} // Désactiver pendant le chargement ou si aucune position n'est sélectionnée
        >
            Valider la localisation
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default LocalisationPopup;