import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Correction pour l'icône par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LivreurMap = ({ livraisons , children}) => {
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const mapCenter = [-18.91368, 47.52148]; // Coordonnées d'Antananarivo

  // Fonction pour forcer le redimensionnement de la carte
  const resizeMap = () => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }
  };

  useEffect(() => {
    // Redimensionner la carte quand les livraisons changent
    resizeMap();
  }, [livraisons]);

  useEffect(() => {
    // Redimensionner la carte après le montage
    if (mapReady) {
      resizeMap();
    }
  }, [mapReady]);

  useEffect(() => {
    // Écouter les changements de taille de la fenêtre
    const handleResize = () => {
      resizeMap();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fonction pour obtenir le style du statut
  const getStatusStyle = (statut) => {
    const styles = {
      EN_ROUTE: { 
        backgroundColor: '#fff3cd', 
        color: '#856404', 
        border: '1px solid #ffeaa7',
        icon: '🚚'
      },
      ASSIGNEE: { 
        backgroundColor: '#d1ecf1', 
        color: '#0c5460', 
        border: '1px solid #bee5eb',
        icon: '📋'
      },
      LIVREE: { 
        backgroundColor: '#d4edda', 
        color: '#155724', 
        border: '1px solid #c3e6cb',
        icon: '✅'
      }
    };
    return styles[statut] || styles.ASSIGNEE;
  };

  const getStatusText = (statut) => {
    const text = { 
      EN_ROUTE: 'En route', 
      ASSIGNEE: 'Assignée', 
      LIVREE: 'Livrée' 
    };
    return text[statut] || statut;
  };

  // Créer des icônes personnalisées pour chaque statut
  const createCustomIcon = (statut) => {
    const statusStyle = getStatusStyle(statut);
    return L.divIcon({
      html: `
        <div style="
          background: ${statusStyle.backgroundColor};
          color: ${statusStyle.color};
          border: ${statusStyle.border};
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        ">
          ${statusStyle.icon}
        </div>
      `,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
  };

  useEffect(() => {
    // Styles CSS personnalisés pour les popups et markers Leaflet
    const style = document.createElement('style');
    style.textContent = `
      .custom-marker {
        background: transparent !important;
        border: none !important;
      }
      
      .custom-popup .leaflet-popup-content-wrapper {
        background: white;
        color: #333;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        border: 1px solid #e9ecef;
        padding: 0;
        overflow: hidden;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      
      .custom-popup .leaflet-popup-content {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      
      .custom-popup .leaflet-popup-tip {
        background: white;
        border: 1px solid #e9ecef;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      .custom-popup .leaflet-popup-close-button {
        color: #6c757d;
        font-size: 16px;
        font-weight: bold;
        padding: 8px;
        right: 8px;
        top: 8px;
        width: 24px;
        height: 24px;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }
      
      .custom-popup .leaflet-popup-close-button:hover {
        background: #e9ecef;
        color: #495057;
        transform: scale(1.05);
      }
      
      .popup-header {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        padding: 16px 20px;
        border-bottom: 1px solid #dee2e6;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .popup-body {
        padding: 18px 20px;
        background: white;
      }
      
      .popup-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
        color: #495057;
      }
      
      .popup-info-row {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        gap: 8px;
      }
      
      .popup-info-row:last-child {
        margin-bottom: 0;
      }
      
      .popup-label {
        font-weight: 500;
        color: #6c757d;
        min-width: 70px;
        font-size: 13px;
      }
      
      .popup-value {
        color: #495057;
        font-size: 13px;
        flex: 1;
        font-weight: 500;
      }
      
      .status-badge {
        padding: 6px 10px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      .popup-icon {
        font-size: 18px;
        color: #007bff;
      }
      
      .leaflet-container {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #f8f9fa;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={12} 
      style={{ 
        height: '100%', 
        width: '100%',
        minHeight: '400px',
        zIndex: 1
      }}
      whenCreated={(mapInstance) => { 
        mapRef.current = mapInstance;
        setMapReady(true);
      }}
      scrollWheelZoom={true}
      zoomControl={true}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      
      {livraisons && livraisons.length > 0 && livraisons.map(livraison => {
        if (!livraison.localisation?.coordinates) {
          return null;
        }
        
        const coords = livraison.localisation.coordinates;
        const position = [coords[1], coords[0]];
        const statusStyle = getStatusStyle(livraison.statut);

        return (
          <Marker 
            key={livraison.id} 
            position={position}
            icon={createCustomIcon(livraison.statut)}
          >
            <Popup className="custom-popup" maxWidth={280} minWidth={250}>
              <div style={{ width: '250px' }}>
                <div className="popup-header">
                  <span className="popup-icon">📦</span>
                  <h6 className="popup-title">
                    Livraison {livraison.id.substring(0, 8)}...
                  </h6>
                </div>
                
                <div className="popup-body">
                  <div className="popup-info-row">
                    <span className="popup-label">📍 Adresse:</span>
                    <span className="popup-value">{livraison.adresse}</span>
                  </div>
                  
                  <div className="popup-info-row">
                    <span className="popup-label">📊 Statut:</span>
                    <span 
                      className="status-badge"
                      style={{
                        backgroundColor: statusStyle.backgroundColor,
                        color: statusStyle.color,
                        border: statusStyle.border
                      }}
                    >
                      <span>{statusStyle.icon}</span>
                      {getStatusText(livraison.statut)}
                    </span>
                  </div>
                  
                  <div className="popup-info-row">
                    <span className="popup-label">👤 Livreur:</span>
                    <span className="popup-value">
                      {livraison.__livreur__?.prenom} {livraison.__livreur__?.nom || 'Non assigné'}
                    </span>
                  </div>
                  
                  <div className="popup-info-row">
                    <span className="popup-label">📋 Type:</span>
                    <span className="popup-value">{livraison.type || 'N/A'}</span>
                  </div>
                  
                  {livraison.__livreur__?.telephone && (
                    <div className="popup-info-row">
                      <span className="popup-label">📞 Tél:</span>
                      <span className="popup-value">{livraison.__livreur__.telephone}</span>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
      {children}
    </MapContainer>
  );
};

export default LivreurMap;