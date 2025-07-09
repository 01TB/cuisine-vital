//src/App.js
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
import Ingredients from './pages/Ingredients';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import 'bootstrap/dist/css/bootstrap.min.css';
import Overview from './components/Overview';
import HistoriqueCommandes from './pages/historique_commandes';

function App() {
  return (
    <Router>
      <AdminNavbar />
      <div style={{ marginTop: '70px' }}>
        <Routes>
          {/* Redirection racine */}
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Route principale avec layout Dashboard */}
          <Route path="/admin/dashboard" element={<Dashboard />}>
            {/* Sous-routes rendues dans <Outlet /> de Dashboard */}
            <Route path="overview" element={<Overview />}/>
            
              <Route path="commandes" element={<Commandes />} />
              <Route path="gestion-menu" element={<Menu />} />
              <Route path="gestion-menu/plats" element={<Menu />} />
              <Route path="gestion-menu/categories" element={<Menu />} />
              <Route path="gestion-menu/nouveau-plat" element={<Menu />} />
              <Route path="gestion-menu/promotions" element={<Menu />} />
              <Route path="gestion-cuisine" element={<KitchenManagement />} />
              <Route path="ingredients" element={<Ingredients />} />
              <Route path="statistiques" element={<Statistics />} />
              <Route path="historique" element={<HistoriqueCommandes />} />
              <Route path="parametres" element={<Settings />} />
          </Route>

          {/* Autres routes à plat */}
          <Route path="/admin/abonnements" element={<Abonnements />} />
          <Route path="/admin/clients" element={<Clients />} />
          <Route path="/admin/stocks" element={<Stocks />} />
          <Route path="/admin/livraisons" element={<Livraisons />} />
          <Route path="/admin/facturation" element={<Facturation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
