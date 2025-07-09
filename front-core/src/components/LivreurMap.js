import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Card } from 'react-bootstrap';

// Correction pour l'icône par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LivreurMap = ({ livraisons }) => {
  const mapRef = useRef(null);
  const mapCenter = [-18.91368, 47.52148];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [livraisons]);

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
      whenCreated={mapInstance => { mapRef.current = mapInstance; }}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {livraisons.map(livraison => {
        if (!livraison.localisation?.coordinates) {
          return null;
        }
        const coords = livraison.localisation.coordinates;
        const position = [coords[1], coords[0]];

        return (
          <Marker key={livraison.id} position={position}>
            <Popup>
              <Card border="light" style={{ width: '250px', border: 'none', boxShadow: 'none' }}>
                <Card.Header as="h6" className="fw-bold">
                  Livraison {livraison.id.substring(0, 8)}
                </Card.Header>
                <Card.Body>
                  <Card.Text as="div" style={{ fontSize: '14px' }}>
                    <strong>Adresse:</strong> {livraison.adresse}<br/>
                    <strong>Statut:</strong> {livraison.statut}<br/>
                    {/* CORRECTION : Utiliser __livreur__ pour accéder au nom et prénom */}
                    <strong>Livreur:</strong> {livraison.__livreur__?.prenom} {livraison.__livreur__?.nom || 'Non assigné'}<br/>
                    <strong>Type:</strong> {livraison.type}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default LivreurMap;