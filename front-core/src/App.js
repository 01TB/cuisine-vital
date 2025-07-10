import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { UserAuthProvider } from './providers/UserAuthProvider'; // à ajouter si tu as ce provider
import { useUserAuth } from './hooks/useUserAuth';               // idem
import AdminNavbar from './components/AdminNavbar';
import LivreurNavbar from './components/LivreurNavbar';
import Dashboard from './pages/Dashboard';
import Abonnements from './pages/Abonnements';
import Commandes from './pages/Commandes';
import Clients from './pages/Clients';
import MenusPage from './pages/MenusPage';
import Stocks from './pages/Stocks';
import Menu from './pages/Menu';
import Livraisons from './pages/Livraisons';
import Facturation from './pages/Facturation';
import KitchenManagement from './pages/KitchenManagement';
import Ingredients from './pages/Ingredients';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import AbonnementsPage from './pages/Abonnements';
import Overview from './components/Overview';
import HistoriqueCommandes from './pages/historique_commandes';
import BonsCommandePage from './pages/BonsCommande';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import LivreurDashboard from './pages/LivreurDashboard';
import ItinerairePage from './pages/ItinerairePage';
import GestionTrajets from './pages/GestionTrajets';
import ItineraireAdminPage from './pages/ItineraireAdminPage';
import 'bootstrap/dist/css/bootstrap.min.css';

const roleMap = {
  1: 'ADMIN',
  2: 'CHEF_CUISINIER',
  3: 'livreur',
};


// Component to protect routes based on authentication and roles
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, user } = useUserAuth();
  const userRole = user ? roleMap[user.roleId] : null;

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }
  if (!allowedRoles || !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

// Layout principal avec Navbar et un espace pour sous-routes
const MainLayout = ({children}) => {

  return (
    <>
      <main>
        {children}
      </main>
    </>
  );
};

function App() {
  return (
    <Router>
      <UserAuthProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Redirection racine */}
          <Route path="/" element={<RootRedirect />} />

          {/* Routes admin + chef cuisinier */}
          <Route 
            path="/admin/dashboard" 
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN', 'CHEF_CUISINIER']}>
                <MainLayout>
                    <Dashboard/>
                  </MainLayout>
              </RoleProtectedRoute>
            }
          >
            {/* Sous-routes Dashboard */}
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
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
            <Route path="abonnements" element={<AbonnementsPage />} />
            <Route path="bonscommande" element={<BonsCommandePage />} />
          </Route>

          {/* Routes Admin uniquement */}
          <Route 
            path="/admin/clients" 
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <MainLayout>
                  <Clients />
                </MainLayout>
              </RoleProtectedRoute>
            }
          />
          <Route 
            path="/admin/stocks" 
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <MainLayout>
                  <Stocks />
                </MainLayout>
              </RoleProtectedRoute>
            }
          />
          <Route 
            path="/admin/livraisons" 
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <MainLayout>
                  <Livraisons />
                </MainLayout>
              </RoleProtectedRoute>
            }
          />
          <Route 
            path="/admin/facturation" 
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <MainLayout>
                  <Facturation />
                </MainLayout>
              </RoleProtectedRoute>
            }
          />
          
          {/* Route livreur */}
          <Route 
            path="/admin/livreur/dashboard" 
            element={
              <RoleProtectedRoute allowedRoles={['livreur']}>
                <MainLayout>
                  <LivreurDashboard />
                </MainLayout>
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/livreur/itineraire"
            element={
              <RoleProtectedRoute allowedRoles={['livreur']}>
                <MainLayout>
                  <ItinerairePage />
                </MainLayout>
              </RoleProtectedRoute>
            }
          />
          {/* Routes exclusivement pour chef cuisinier */}
          <Route 
            path="/admin/chef"
            element={
              <RoleProtectedRoute allowedRoles={['CHEF_CUISINIER']}>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </RoleProtectedRoute>
            }
          >
            <Route path="commandes" element={<Commandes />} />
            <Route path="menus" element={<MenusPage />} />
          </Route>
          <Route 
              path="gestion-trajets" 
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <GestionTrajets />
                </RoleProtectedRoute>
              } 
            />

            {/* ▼▼▼ AJOUTER LA NOUVELLE ROUTE ICI ▼▼▼ */}
            <Route 
              path="calcul-itineraire" 
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <ItineraireAdminPage />
                </RoleProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </UserAuthProvider>
    </Router>
  );
}

// Redirect après login selon rôle
const RootRedirect = () => {
  const { user } = useUserAuth();
  if (user) {
    switch (roleMap[user.roleId]) {
      case 'ADMIN':
      case 'CHEF_CUISINIER':
        return <Navigate to="/admin/dashboard/overview" replace />;
      case 'livreur':
        return <Navigate to="/admin/livreur/dashboard" replace />;
      default:
        return <Navigate to="/admin/login" replace />;
    }
  }
  return <Navigate to="/admin/login" replace />;
};

export default App;
