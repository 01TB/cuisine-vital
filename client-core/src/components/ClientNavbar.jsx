import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function ClientNavbar() {
  const location = useLocation();
  const [userType, setUserType] = useState('individual');

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className="navbar-modern py-3"
    >
      <Container className="flex justify-between items-center max-w-7xl mx-auto px-4">
        <Navbar.Brand as={Link} to="/" className="text-2xl font-extrabold text-orange-500 flex items-center space-x-2">
          <span role="img" aria-label="Foodie" className="text-3xl">🍴</span>
          <span>Foodie</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 focus:outline-none" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto space-x-8">
            <Nav.Link
              as={Link}
              to="/"
              className={`nav-link-modern ${location.pathname === '/' ? 'active' : ''}`}
            >
              Accueil
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/menus"
              className={`nav-link-modern ${location.pathname === '/menus' ? 'active' : ''}`}
            >
              Menus
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/commandes"
              className={`nav-link-modern ${location.pathname === '/commandes' ? 'active' : ''}`}
            >
              Commandes
            </Nav.Link>
            {userType === 'company' && (
              <Nav.Link
                as={Link}
                to="/commandes-entreprise"
                className={`nav-link-modern ${location.pathname === '/commandes-entreprise' ? 'active' : ''}`}
              >
                Commandes Entreprise
              </Nav.Link>
            )}
          </Nav>
          <Nav className="space-x-3 flex items-center">
            <Button
              variant="outline"
              onClick={() => setUserType(userType === 'individual' ? 'company' : 'individual')}
              className="btn-modern btn-outline-green"
            >
              {userType === 'individual' ? 'Entreprise' : 'Particulier'}
            </Button>
            <Button
              variant="outline"
              as={Link}
              to="/profil"
              className="btn-modern btn-outline-blue hidden lg:inline-flex"
            >
              Profil
            </Button>
            <Button
              variant="outline"
              as={Link}
              to="/logout"
              className="btn-modern btn-outline-red hidden lg:inline-flex"
            >
              Déconnexion
            </Button>
            <Button
              variant="primary"
              as={Link}
              to="/login"
              className="btn-modern btn-primary-orange"
            >
              Log in
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ClientNavbar;