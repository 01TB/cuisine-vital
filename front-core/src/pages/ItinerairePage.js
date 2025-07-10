import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { Spinner, Alert, ListGroup, Badge } from 'react-bootstrap';
import L from 'leaflet';

import { useUserAuth } from '../hooks/useUserAuth';
import api from '../services/api';

const createIcon = (color, innerHtml = '') => new L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="36" height="36"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg><span style="position: absolute; top: 8px; left: 0; width: 100%; text-align: center; color: white; font-size: 12px; font-weight: bold;">${innerHtml}</span>`,
  className: 'custom-div-icon',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -38],
});

const startIcon = createIcon("#16a34a", 'D');
const endIcon = createIcon("#dc2626", 'A');
const waypointIcon = (index) => createIcon("#2563eb", index);

const ItinerairePage = () => {
  const { user } = useUserAuth();
  const [route, setRoute] = useState(null);
  const [livraisons, setLivraisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    if (user && user.id) {
      const fetchItineraire = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await api.get(`/livreurs/${user.id}/itineraire`);
          const { route: routeData, livraisons: livraisonsData } = response.data;
          
          setLivraisons(livraisonsData || []);

          // La route peut être `null` (cas avec 0 ou 1 point), ce qui est maintenant attendu.
          if (routeData && routeData.features?.[0]?.geometry?.coordinates) {
            const routeCoordinates = routeData.features[0].geometry.coordinates;
            const latlngs = routeCoordinates.map(c => [c[1], c[0]]);
            setRoute(latlngs);
          } else {
            setRoute(null); // On s'assure que la route est bien nulle si non trouvée.
          }
          
        } catch (err) {
          setError(err.response?.data?.message || "Erreur lors de la récupération de l'itinéraire.");
          console.error("Erreur Itinéraire:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchItineraire();
    }
  }, [user]);

  if (loading) {
    return <div className="text-center p-5"><Spinner animation="border" /></div>;
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', fontFamily: 'Arial, sans-serif' }}>
      <style>{`
        @import url('https://unpkg.com/leaflet@1.7.1/dist/leaflet.css');
        .custom-div-icon { background: transparent; border: none; }
      `}</style>

      <aside style={{ width: '400px', padding: '20px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
        <h4 className="mb-3">Ordre de l'Itinéraire</h4>
        
        {/* --- AJOUT : Message informatif si pas de route mais des points existent --- */}
        {!route && livraisons.length > 0 && (
          <Alert variant="info" className="mb-3">
            Un seul point de livraison. Aucun itinéraire à calculer.
          </Alert>
        )}
        
        {error ? (
          <Alert variant="danger">{error}</Alert>
        ) : livraisons.length > 0 ? (
          <ListGroup>
            {livraisons.map((livraison, index) => (
              <ListGroup.Item key={livraison.id}>
                <div className="fw-bold">{index === 0 && livraisons.length > 1 ? 'Départ' : `Livraison ${index + 1}`}</div>
                <p className="mb-1">{livraison.adresse}</p>
                <Badge bg={livraison.statut === 'EN_ROUTE' ? 'primary' : 'warning'} pill>
                  {livraison.statut}
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>Aucune livraison active pour le moment.</p>
        )}
      </aside>

      <main style={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={[-18.9066, 47.5186]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {livraisons.map((livraison, index) => {
            const isEnd = index === livraisons.length - 1;
            let icon = waypointIcon(index + 1);
            if (index === 0) icon = startIcon;
            if (isEnd && index > 0) icon = endIcon;

            const coords = livraison.localisation.coordinates;
            const position = [coords[1], coords[0]];

            return (
              <Marker key={livraison.id} position={position} icon={icon}>
                <Popup>{livraison.adresse}</Popup>
              </Marker>
            );
          })}
          
          {route && <Polyline positions={route} color="#0284c7" weight={5} opacity={0.8} />}
        </MapContainer>
      </main>
    </div>
  );
};

export default ItinerairePage;