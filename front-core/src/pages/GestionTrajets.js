import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import api from '../services/api'; 
import LivreurMap from '../components/LivreurMap';

const GestionTrajets = () => {
  const [toutesLesLivraisons, setToutesLesLivraisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchToutesLesLivraisons = async () => {
      try {
        setLoading(true);
        const response = await api.get('/livreurs/livraisons/all');
        setToutesLesLivraisons(response.data);
        setError(null);
      } catch (err) {
        setError("Impossible de charger les données des livraisons.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchToutesLesLivraisons();
  }, []);

  // --- LOGIQUE DE STYLE RÉUTILISÉE DEPUIS LIVREURMAP ---
  const getStatusStyle = (statut) => {
    const styles = {
      EN_ROUTE: { backgroundColor: '#fff3cd', color: '#856404', icon: '🚚' },
      ASSIGNEE: { backgroundColor: '#d1ecf1', color: '#0c5460', icon: '📋' },
      LIVREE: { backgroundColor: '#d4edda', color: '#155724', icon: '✅' }
    };
    return styles[statut] || styles.ASSIGNEE;
  };

  const getStatusText = (statut) => {
    const text = { EN_ROUTE: 'En route', ASSIGNEE: 'Assignée', LIVREE: 'Livrée' };
    return text[statut] || statut;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner animation="border" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <style>{`@import url('https://unpkg.com/leaflet@1.7.1/dist/leaflet.css');`}</style>
      
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Gestion des Trajets en Temps Réel</h2>
      
      <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 120px)', minHeight: '500px' }}>
        {/* --- Colonne de la carte --- */}
        <div style={{ 
          flex: 1, 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          <div style={{ padding: '15px 20px', borderBottom: '1px solid #dee2e6' }}>
            <h5 style={{ margin: 0, color: '#666' }}>🗺️ Carte de toutes les livraisons</h5>
          </div>
          
          <div style={{ flex: 1, position: 'relative' }}>
            <LivreurMap livraisons={toutesLesLivraisons} />
          </div>
        </div>

        {/* --- Colonne de la liste --- */}
        <div style={{ 
          width: '400px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          <div style={{ padding: '15px 20px', borderBottom: '1px solid #dee2e6' }}>
            <h5 style={{ margin: 0, color: '#666' }}>
              📋 Liste des Livraisons ({toutesLesLivraisons.length})
            </h5>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {toutesLesLivraisons.length > 0 ? (
              toutesLesLivraisons.map(livraison => {
                const statusStyle = getStatusStyle(livraison.statut);
                return (
                  <div 
                    key={livraison.id} 
                    style={{ 
                      padding: '15px 20px', 
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: '10px' 
                    }}>
                      <strong style={{ color: '#333' }}>
                        📦 {livraison.id.substring(0, 8)}...
                      </strong>
                      <span 
                        style={{
                          backgroundColor: statusStyle.backgroundColor,
                          color: statusStyle.color,
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          border: `1px solid ${statusStyle.color}20`
                        }}
                      >
                        {statusStyle.icon} {getStatusText(livraison.statut)}
                      </span>
                    </div>
                    
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      <div style={{ marginBottom: '5px' }}>
                        <strong>📍 Adresse:</strong> 
                        <span style={{ marginLeft: '5px' }}>{livraison.adresse}</span>
                      </div>
                      <div style={{ marginBottom: '5px' }}>
                        <strong>👤 Livreur:</strong> 
                        <span style={{ marginLeft: '5px' }}>
                          {livraison.__livreur__?.prenom} {livraison.__livreur__?.nom || 'Non assigné'}
                        </span>
                      </div>
                      <div style={{ marginBottom: '5px' }}>
                        <strong>📋 Type:</strong> 
                        <span style={{ marginLeft: '5px' }}>{livraison.type || 'N/A'}</span>
                      </div>
                      {livraison.__livreur__?.telephone && (
                        <div style={{ marginBottom: '0' }}>
                          <strong>📞 Tél:</strong> 
                          <span style={{ marginLeft: '5px' }}>{livraison.__livreur__.telephone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                <div style={{ marginBottom: '10px' }}>📦</div>
                <div>Aucune livraison à afficher.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionTrajets;