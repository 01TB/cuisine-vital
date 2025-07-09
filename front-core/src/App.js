import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserAuthProvider } from './providers/UserAuthProvider';
import { useUserAuth } from './hooks/useUserAuth';
import AdminNavbar from './components/AdminNavbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import 'bootstrap/dist/css/bootstrap.min.css';

// Page Imports
import Commandes from './pages/Commandes';
import MenusPage from './pages/MenusPage';
import Clients from './pages/Clients';
import Settings from './pages/Settings';
import LivreurDashboard from './pages/LivreurDashboard';
import StockOverview from './pages/StockOverview';
import StockEntry from './pages/StockEntry';
import StockHistory from './pages/StockHistory';


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
  const showNavbar = user?.roleId !== 3; // No navbar for livreur

  return (
    <>
      {showNavbar && <AdminNavbar />}
      <div style={{ marginTop: showNavbar ? '70px' : '0' }}>
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
            {/* Sous-routes pour le dashboard */}
            <Route path="commandes" element={<Commandes />} />
            <Route path="menus" element={<MenusPage />} />
            <Route path="stock" element={<StockOverview />} />
            <Route path="stock/entry" element={<StockEntry />} />
            <Route path="stock/history" element={<StockHistory />} />
            {/* Ajoutez d'autres sous-routes ici */}
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

// This component handles the initial redirect after login
const RootRedirect = () => {
  const { user } = useUserAuth();
  if (user) {
    switch (roleMap[user.roleId]) {
      case 'admin':
      case 'chef cuisinier':
        return <Navigate to="/admin/dashboard/stock" replace />; // Redirect to stock overview
      case 'livreur':
        return <Navigate to="/admin/livreur/dashboard" replace />;
      default:
        return <Navigate to="/admin/login" replace />;
    }
  }
  return <Navigate to="/admin/login" replace />;
}

export default App;
