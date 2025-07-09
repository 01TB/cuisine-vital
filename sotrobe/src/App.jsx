import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MainApp from './pages/MainApp';
import './App.css';
import ClientProfile from './pages/ClientProfile';
import EnterpriseClientProfile from './pages/EnterpriseClientProfile';
import Menu from './pages/Menu';
import Login from './components/Login';
import { AuthProvider, useAuth } from './providers/AuthProvider';
import SignUp from './components/SignUp';
import AuthenticatedLandingPage from './pages/AuthenticatedLandingPage';
import CursorFollower from "./components/CursorFollower";
import AppNavbar from "./components/Navbar";
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/signup';

  return (
    <main className={showNavbar ? 'pt-5' : ''}>
      {showNavbar && <AppNavbar />}
      <AppRoutes />
    </main>
  );
}

function AppRoutes() {
  const { user, isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path='/' element={isLoggedIn ? <AuthenticatedLandingPage /> : <LandingPage />}></Route>
      <Route 
        path='/profile' 
        element={user?.typeClient === 'ENTREPRISE' ? <EnterpriseClientProfile /> : <ClientProfile />}
      ></Route>
      <Route path='/menus' element={<Menu/>}></Route>
      <Route path="/contact" element={<ContactPage/>} />
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/signup' element={<SignUp/>}></Route>        
    </Routes>
  );
}

export default App;