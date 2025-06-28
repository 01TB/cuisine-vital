import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function ClientNavbar() {
  const location = useLocation();
  const [userType, setUserType] = useState('individual');

  return (
    <Navbar bg="light" expand="lg" fixed="top" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ color: '#f4a261' }}>
          <span role="img" aria-label="Foodie">🍴</span> Foodie
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
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
          <Nav>
            <Button variant="outline-success" onClick={() => setUserType(userType === 'individual' ? 'company' : 'individual')}>
              Changer pour {userType === 'individual' ? 'Entreprise' : 'Particulier'}
            </Button>
            <Button variant="outline-primary" as={Link} to="/profil">Profil</Button>
            <Button variant="outline-danger" as={Link} to="/logout">Déconnexion</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ClientNavbar;