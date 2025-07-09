import React, { useState, useEffect } from 'react';
import { Spinner, Form, Alert } from 'react-bootstrap';
import api from '../services/api';
import LivreurMap from '../components/LivreurMap'; // On va le modifier pour accepter une route
import { Polyline } from 'react-leaflet'; // On importe Polyline ici

const ItineraireAdminPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [livreurs, setLivreurs] = useState([]);
    const [selectedLivreurId, setSelectedLivreurId] = useState('');
    const [itineraireData, setItineraireData] = useState(null); // Pour stocker { route, livraisons }

    // Effet pour charger la liste des livreurs au montage
    useEffect(() => {
        const fetchLivreurs = async () => {
            setLoading(true);
            try {
                const response = await api.get('/livreurs');
                setLivreurs(response.data);
            } catch (err) {
                setError("Impossible de charger la liste des livreurs.");
            } finally {
                setLoading(false);
            }
        };
        fetchLivreurs();
    }, []);

    // Effet pour calculer l'itinéraire quand un livreur est sélectionné
    const handleLivreurChange = async (livreurId) => {
        setSelectedLivreurId(livreurId);
        if (!livreurId) {
            setItineraireData(null);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/livreurs/${livreurId}/itineraire`);
            setItineraireData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors du calcul de l'itinéraire.");
            setItineraireData(null);
        } finally {
            setLoading(false);
        }
    };

    const livraisonsAAfficher = itineraireData?.livraisons || [];
    
    // Traitement de la route comme dans ItinerairePage
    let routePolyline = null;
    if (itineraireData?.route?.features?.[0]?.geometry?.coordinates) {
        const routeCoordinates = itineraireData.route.features[0].geometry.coordinates;
        routePolyline = routeCoordinates.map(c => [c[1], c[0]]); // Conversion [lon, lat] → [lat, lon]
    }

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
            <style>{`@import url('https://unpkg.com/leaflet@1.7.1/dist/leaflet.css');`}</style>
            
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Calcul d'Itinéraire par Livreur</h2>
            
            <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 120px)', minHeight: '500px' }}>
                {/* --- Colonne de gauche avec les contrôles --- */}
                <div style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Sélecteur de livreur */}
                    <div style={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px', 
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
                        padding: '20px' 
                    }}>
                        <h5 style={{ margin: '0 0 15px 0', color: '#333' }}>Sélectionner un livreur</h5>
                        <Form.Select 
                            value={selectedLivreurId}
                            onChange={(e) => handleLivreurChange(e.target.value)}
                            disabled={loading}
                            style={{ 
                                padding: '10px', 
                                borderRadius: '6px', 
                                border: '1px solid #ddd',
                                fontSize: '14px'
                            }}
                        >
                            <option value="">-- Choisissez un livreur --</option>
                            {livreurs.map(livreur => (
                                <option key={livreur.id} value={livreur.id}>
                                    {livreur.prenom} {livreur.nom}
                                </option>
                            ))}
                        </Form.Select>
                    </div>

                    {/* Liste des étapes */}
                    <div style={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px', 
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0
                    }}>
                        <div style={{ padding: '15px 20px', borderBottom: '1px solid #dee2e6' }}>
                            <h5 style={{ margin: 0, color: '#666' }}>
                                📋 Étapes de livraison ({livraisonsAAfficher.length})
                            </h5>
                        </div>
                        
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {loading && (
                                <div style={{ padding: '20px', textAlign: 'center' }}>
                                    <Spinner size="sm" />
                                </div>
                            )}
                            
                            {error && (
                                <div style={{ padding: '10px' }}>
                                    <Alert variant="warning" style={{ margin: 0 }}>{error}</Alert>
                                </div>
                            )}
                            
                            {!loading && livraisonsAAfficher.map((livraison, index) => (
                                <div 
                                    key={livraison.id} 
                                    style={{ 
                                        padding: '15px 20px', 
                                        borderBottom: '1px solid #f0f0f0',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '15px'
                                    }}
                                >
                                    <div style={{
                                        backgroundColor: '#0d6efd',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '30px',
                                        height: '30px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        flexShrink: 0
                                    }}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>
                                            {livraison.adresse}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            ID: {livraison.id.substring(0, 8)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {!loading && livraisonsAAfficher.length === 0 && !error && (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                    <div style={{ marginBottom: '10px' }}>🗺️</div>
                                    <div>Sélectionnez un livreur pour voir son itinéraire</div>
                                </div>
                            )}
                            
                            {!loading && livraisonsAAfficher.length === 1 && (
                                <div style={{ padding: '15px 20px', borderTop: '1px solid #f0f0f0', backgroundColor: '#f8f9fa' }}>
                                    <Alert variant="info" style={{ margin: 0, fontSize: '14px' }}>
                                        Un seul point de livraison. Aucun itinéraire à calculer.
                                    </Alert>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- Colonne de droite avec la carte --- */}
                <div style={{ 
                    flex: 1, 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
                    display: 'flex', 
                    flexDirection: 'column' 
                }}>
                    <div style={{ padding: '15px 20px', borderBottom: '1px solid #dee2e6' }}>
                        <h5 style={{ margin: 0, color: '#666' }}>
                            🗺️ Carte avec itinéraire optimisé
                        </h5>
                    </div>
                    
                    <div style={{ flex: 1, position: 'relative' }}>
                        <LivreurMap livraisons={livraisonsAAfficher}>
                            {routePolyline && (
                                <Polyline 
                                    positions={routePolyline} 
                                    color="#0284c7" 
                                    weight={5} 
                                    opacity={0.8} 
                                />
                            )}
                        </LivreurMap>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItineraireAdminPage;