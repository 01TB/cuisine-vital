import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import { useUserAuth } from '../hooks/useUserAuth';
import api from '../services/api';
import LivreurMap from '../components/LivreurMap';

const LivreurDashboard = () => {
  const { user } = useUserAuth();
  const [mesLivraisons, setMesLivraisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      const fetchLivraisons = async () => {
        try {
          const response = await api.get(`/livreurs/${user.id}/livraisons`);
          setMesLivraisons(response.data);
          setError(null);
        } catch (err) {
          setError("Erreur lors de la récupération des données de livraison.");
          console.error("Erreur API:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchLivraisons();
    } else {
      setLoading(false);
      setMesLivraisons([]); 
    }
  }, [user]);

  const livraisonsEnCours = mesLivraisons.filter(l => l.statut === 'EN_ROUTE' || l.statut === 'ASSIGNEE');
  const livraisonsLivrees = mesLivraisons.filter(l => l.statut === 'LIVREE');
  const livreursActifs = new Set(mesLivraisons.map(l => l.__livreur__?.id)).size;

  const getStatusBadge = (statut) => {
    const styles = {
      // CORRECTION : Utiliser EN_ROUTE au lieu de EN_LIVRAISON
      EN_ROUTE: { backgroundColor: '#ffc107', color: '#212529', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' },
      ASSIGNEE: { backgroundColor: '#007bff', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' },
      LIVREE: { backgroundColor: '#28a745', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }
    };
    const text = { EN_ROUTE: 'En route', ASSIGNEE: 'Assignée', LIVREE: 'Livrée' };
    return <span style={styles[statut] || styles.ASSIGNEE}>{text[statut] || statut}</span>;
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spinner animation="border" /></div>;
  }
  if (error) {
    return <div className="p-4"><Alert variant="danger">{error}</Alert></div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <style>{`@import url('https://unpkg.com/leaflet@1.7.1/dist/leaflet.css');`}</style>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>{mesLivraisons.length}</div>
          <div style={{ color: '#666', fontSize: '14px' }}>Total livraisons</div>
        </div>
        <div style={{ backgroundColor: '#e8f5e8', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#388e3c' }}>{livreursActifs}</div>
          <div style={{ color: '#666', fontSize: '14px' }}>Livreurs actifs</div>
        </div>
        <div style={{ backgroundColor: '#fff3e0', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f57c00' }}>{livraisonsEnCours.length}</div>
          <div style={{ color: '#666', fontSize: '14px' }}>En cours</div>
        </div>
        <div style={{ backgroundColor: '#f3e5f5', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7b1fa2' }}>{livraisonsLivrees.length}</div>
          <div style={{ color: '#666', fontSize: '14px' }}>Livrées</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 180px)', minHeight: '500px' }}>
        <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '15px 20px', borderBottom: '1px solid #dee2e6' }}>
            <h6 style={{ margin: 0 }}>📍 Carte des livraisons en temps réel</h6>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <LivreurMap livraisons={mesLivraisons} />
          </div>
        </div>

        <div style={{ width: '350px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '15px 20px', borderBottom: '1px solid #dee2e6' }}>
            <h6 style={{ margin: 0 }}>📋 Livraisons en cours</h6>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {livraisonsEnCours.length > 0 ? livraisonsEnCours.map(livraison => (
              <div key={livraison.id} style={{ padding: '15px 20px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>{livraison.id.substring(0, 8)}</div>
                  {getStatusBadge(livraison.statut)}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}><strong>Adresse:</strong> {livraison.adresse}</div>
                {/* CORRECTION : Utiliser __livreur__ pour accéder au téléphone */}
                <div style={{ fontSize: '14px', color: '#666' }}><strong>Téléphone:</strong> {livraison.__livreur__?.telephone || 'Non renseigné'}</div>
              </div>
            )) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Aucune livraison en cours</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivreurDashboard;