import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import 'animate.css';

function ClientNavbar() {
  const location = useLocation();
  const [userType, setUserType] = useState('individual');

  return (
    <Navbar expand="lg" fixed="top" className="bg-white shadow-sm py-3 animate__animated animate__fadeInDown">
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-warning fw-bold fs-4">
          <span role="img" aria-label="Foodie">🍴</span> Foodie
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>Accueil</Nav.Link>
            <Nav.Link as={Link} to="/menus" active={location.pathname === '/menus'}>Menus</Nav.Link>
            <Nav.Link as={Link} to="/commandes" active={location.pathname === '/commandes'}>Commandes</Nav.Link>
            {userType === 'company' && (
              <Nav.Link as={Link} to="/commandes-entreprise" active={location.pathname === '/commandes-entreprise'}>
                Commandes Entreprise
              </Nav.Link>
            )}
          </Nav>
          <Nav className="gap-2">
            <Button variant="outline-warning" className="rounded-pill px-3" onClick={() => setUserType(userType === 'individual' ? 'company' : 'individual')}>
              {userType === 'individual' ? '👨‍💼 Entreprise' : '🙋‍♂️ Particulier'}
            </Button>
            <Button variant="outline-secondary" className="rounded-pill px-3" as={Link} to="/profil">Profil</Button>
            <Button variant="danger" className="rounded-pill px-3" as={Link} to="/logout">Déconnexion</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ClientNavbar;
