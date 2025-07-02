import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css'; // <-- 1. IMPORTER LE NOUVEAU FICHIER CSS

// --- COMPOSANTS INTERNES ---

// Composant pour gérer les clics sur la carte
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => onMapClick(e),
  });
  return null;
};

// Icônes SVG pour l'interface
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

// --- COMPOSANT PRINCIPAL ---

const App = () => {
  // --- ÉTATS (State) ---
  const [points, setPoints] = useState([]);
  const [route, setRoute] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const mapRef = useRef();
  const dragPointIndex = useRef(null);

  // --- ICÔNES LEAFLET PERSONNALISÉES ---
  const createIcon = (color) => new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="36" height="36">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
      </svg>
    `),
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

  const startIcon = createIcon("#16a34a"); // Vert
  const endIcon = createIcon("#dc2626"); // Rouge
  const waypointIcon = createIcon("#2563eb"); // Bleu

  // --- EFFETS (useEffect) ---
  useEffect(() => {
    // La logique de classe est maintenant gérée par App.css via le sélecteur `html.dark`
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => handleSearch(), 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // --- GESTIONNAIRES D'ÉVÉNEMENTS ET LOGIQUE ---
  const handleMapClick = (e) => addPoint([e.latlng.lat, e.latlng.lng]);
  const addPoint = (point) => {
    if (route.length > 0) setRoute([]);
    setPoints(prevPoints => [...prevPoints, point]);
  };
  const removePoint = (indexToRemove) => {
    if (route.length > 0) setRoute([]);
    setPoints(points.filter((_, index) => index !== indexToRemove));
  };
  const resetSelection = () => {
    setPoints([]);
    setRoute([]);
  };
  const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=mg`, { headers: { 'User-Agent': 'ItineraireMadagascar/1.0' } });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Erreur de recherche Nominatim:", error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const selectSearchResult = (result) => {
    const point = [parseFloat(result.lat), parseFloat(result.lon)];
    addPoint(point);
    mapRef.current.setView(point, 14);
    setSearchQuery('');
    setSearchResults([]);
  };

  const getRoute = async () => {
    if (points.length < 2) return;
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/itineraire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points }),
      });
      if (!response.ok) throw new Error(`Erreur du serveur: ${response.status}`);
      const data = await response.json();
      if (data?.features?.[0]?.geometry?.coordinates) {
        const coords = data.features[0].geometry.coordinates;
        const latlngs = coords.map(c => [c[1], c[0]]);
        setRoute(latlngs);
      } else {
        throw new Error("Format de réponse invalide.");
      }
    } catch (error) {
      console.error("Erreur de calcul d'itinéraire:", error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (index) => { dragPointIndex.current = index; };
  const handleDrop = (e, dropIndex) => {
    const draggedIndex = dragPointIndex.current;
    if (draggedIndex === dropIndex) return;
    const newPoints = [...points];
    const [draggedItem] = newPoints.splice(draggedIndex, 1);
    newPoints.splice(dropIndex, 0, draggedItem);
    setPoints(newPoints);
    if (route.length > 0) setRoute([]);
    dragPointIndex.current = null;
  };

  // --- RENDU JSX avec les nouvelles classes CSS ---
  return (
    <div className="app-container">
      
      <header className="app-header">
        <h1>🗺️ Itinéraire Madagascar</h1>
        <button onClick={toggleTheme}>
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </header>

      <main className="main-content">
        
        <aside className="control-panel">
          <div className="card">
            <h2>Rechercher un lieu</h2>
            <div style={{ position: 'relative' }}>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ex: Gare de Soarano" />
              {isSearching && <div className="spinner" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}></div>}
            </div>
            {searchResults.length > 0 && (
              <ul>{searchResults.map(result => <li key={result.place_id} onClick={() => selectSearchResult(result)} className="search-result-item">{result.display_name}</li>)}</ul>
            )}
          </div>
          
          <div className="card points-list-card">
            <h2>Points de l'itinéraire ({points.length})</h2>
            <p style={{fontSize: '0.8rem', color: '#6b7280'}}>Cliquez, recherchez ou glissez-déposez.</p>
            <div className="points-list-scroll">
              {points.length === 0 ? <div style={{textAlign: 'center'}}>Aucun point sélectionné.</div> : (
                <ul>
                  {points.map((point, index) => {
                    let label = `Étape ${index}`;
                    if (index === 0) label = 'Départ';
                    if (index === points.length - 1 && points.length > 1) label = 'Arrivée';
                    return (
                      <li key={index} draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, index)} className="list-item">
                        <span>{index + 1}</span>
                        <div><span>{label}</span><p>{point[0].toFixed(4)}, {point[1].toFixed(4)}</p></div>
                        <button onClick={() => removePoint(index)} style={{marginLeft: 'auto'}}>
                          <svg height="20" width="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
          
          <div className="button-group card">
            <button onClick={resetSelection}>Réinitialiser</button>
            <button onClick={getRoute} disabled={points.length < 2 || isLoading}>
              {isLoading ? <div className="spinner"></div> : 'Calculer'}
            </button>
          </div>
        </aside>

        <section className="map-wrapper">
          <MapContainer 
            center={[-18.9066, 47.5186]} 
            zoom={13} 
            maxZoom={22} // <-- MODIFICATION ICI
            style={{ height: '100%', width: '100%' }} 
            ref={mapRef}
          >
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
            />
            <MapClickHandler onMapClick={handleMapClick} />
            {points.map((point, index) => {
              const isStart = index === 0;
              const isEnd = index === points.length - 1 && points.length > 1;
              let icon = waypointIcon;
              if (isStart) icon = startIcon;
              if (isEnd) icon = endIcon;
              return <Marker key={index} position={point} icon={icon} />;
            })}
            {route.length > 0 && <Polyline positions={route} color="#0284c7" weight={5} opacity={0.8} />}
          </MapContainer>
        </section>

      </main>
    </div>
  );
};

export default App;