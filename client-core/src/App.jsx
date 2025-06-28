import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClientNavbar from './components/ClientNavbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profil from './pages/Profil';
import Menus from './pages/Menus';
import Commandes from './pages/Commandes';
import CommandesEntreprise from './pages/CommandesEntreprise';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

function App() {
  return (
    <Router>
      <ClientNavbar />
      <div style={{ marginTop: '70px', minHeight: 'calc(100vh - 70px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/menus" element={<Menus />} />
          <Route path="/commandes" element={<Commandes />} />
          <Route path="/commandes-entreprise" element={<CommandesEntreprise />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;