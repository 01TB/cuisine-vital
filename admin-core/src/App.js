import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminNavbar from './components/AdminNavbar';
import Dashboard from './pages/Dashboard';
import Abonnements from './pages/Abonnements';
import Commandes from './pages/Commandes';
import Clients from './pages/Clients';
import Stocks from './pages/Stocks';
import Menu from './pages/Menu';
import Livraisons from './pages/Livraisons';
import Facturation from './pages/Facturation';
import KitchenManagement from './pages/KitchenManagement';
import Ingredients from './pages/Ingredients'; // ← Décommentez cette ligne
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import GestionTrajet from './pages/GestionTrajet'; // ← Décommentez cette ligne
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <AdminNavbar />
      <div style={{ marginTop: '70px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/abonnements" element={<Abonnements />} />
          <Route path="/admin/commandes" element={<Commandes />} />
          <Route path="/admin/clients" element={<Clients />} />
          <Route path="/admin/stocks" element={<Stocks />} />
          <Route path="/admin/menu" element={<Menu />} />
          <Route path="/admin/livraisons" element={<Livraisons />} />
          <Route path="/admin/facturation" element={<Facturation />} />
          <Route path="/admin/kitchen" element={<KitchenManagement />} />
          <Route path="/admin/ingredients" element={<Ingredients />} />
          <Route path="/admin/statistics" element={<Statistics />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/gestionTrajet" element={<GestionTrajet />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;