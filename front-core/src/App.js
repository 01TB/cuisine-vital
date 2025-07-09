import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserAuthProvider } from './providers/UserAuthProvider';
import { useUserAuth } from './hooks/useUserAuth';
import AdminNavbar from './components/AdminNavbar';
import LivreurNavbar from './components/LivreurNavbar';
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
import Login from './pages/Login';
import Overview from './components/Overview';
import HistoriqueCommandes from './pages/historique_commandes';
import LivreurDashboard from './pages/LivreurDashboard';
import Unauthorized from './pages/Unauthorized';
import 'bootstrap/dist/css/bootstrap.min.css';
import MenusPage from './pages/MenusPage';
import ItinerairePage from './pages/ItinerairePage';


const roleMap = { 1: 'admin', 2: 'chef cuisinier', 3: 'livreur' };

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

// Main layout for Admin and Chef Cuisinier
const MainLayout = ({ children }) => {
  const { user } = useUserAuth();
  const userRole = user ? roleMap[user.roleId] : null;

  return (
    <>
      {/* Affiche la bonne navbar en fonction du rôle */}
      {userRole === 'admin' || userRole === 'chef cuisinier' ? <AdminNavbar /> : null}
      {userRole === 'livreur' ? <LivreurNavbar /> : null}
      
      {/* Ajuster la marge dynamiquement */}
      <div style={{ marginTop: userRole ? '70px' : '0' }}>
        {children}
      </div>
    </>
  );
};


function App() {
  return (
    <Router>
      <UserAuthProvider>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* LIVREUR ROUTE */}
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

          {/* 2. Ajouter la nouvelle route pour l'itinéraire */}
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

          {/* ADMIN & CHEF CUISINIER ROUTES */}
        <Route 
          path="/admin/dashboard" 
          element={
            <RoleProtectedRoute allowedRoles={['admin', 'chef cuisinier']}>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </RoleProtectedRoute>
          }
        >
          {/* Sous-routes ici */}
          <Route path="chef/commandes" element={<Commandes />} />
          <Route path="chef/menus" element={<MenusPage />} />
          <Route path="overview" element={<Overview />} />
          {/* ... d'autres sous-routes */}
        </Route>


          {/* ADMIN ONLY ROUTES (Example) */}
           <Route 
            path="/admin/clients" 
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <Clients />
                </MainLayout>
              </RoleProtectedRoute>
            }
          />
          <Route 
            path="/admin/settings" 
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <Settings />
                </MainLayout>
              </RoleProtectedRoute>
            }
          />

          {/* REDIRECT for root path */}
          <Route path="/" element={<RootRedirect />} />

        </Routes>
      </UserAuthProvider>
    </Router>
  );
}

// This component handles the initial redirect after login, before a protected route takes over.
const RootRedirect = () => {
  const { user } = useUserAuth();
  if (user) {
    switch (roleMap[user.roleId]) {
      case 'admin':
      case 'chef cuisinier':
        return <Navigate to="/admin/dashboard/overview" replace />;
      case 'livreur':
        return <Navigate to="/admin/livreur/dashboard" replace />;
      default:
        return <Navigate to="/admin/login" replace />;
    }
  }
  return <Navigate to="/admin/login" replace />;
}

export default App;
