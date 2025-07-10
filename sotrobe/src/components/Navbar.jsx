import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

const AppNavbar = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Navbar expand="lg" style={{  backgroundColor: '#FDF8E499' }} className="bg-opacity-75 backdrop-blur rounded" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">Sotro Be</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/" className="nav-link-custom d-flex align-items-center">
              <i className="bi bi-house-door-fill me-2"></i> Accueil
            </Nav.Link>
            <Nav.Link as={Link} to="/menus" className="nav-link-custom d-flex align-items-center">
              <i className="bi bi-book-fill me-2"></i> Menu
            </Nav.Link>
            <Nav.Link as={Link} to="#restaurants" className="nav-link-custom d-flex align-items-center">
              <i className="bi bi-shop me-2"></i> Restaurants
            </Nav.Link>
            <Nav.Link as={Link} to="#contact" className="nav-link-custom d-flex align-items-center">
              <i className="bi bi-envelope-fill me-2"></i> Contact
            </Nav.Link>
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <Nav.Link as={Link} to="/profile" className="profile-icon">
                <i className="bi bi-person-circle"></i>
              </Nav.Link>
            ) : (
              <Button as={Link} to="/login" variant="outline-primary" className="rounded-pill px-3">
                Se connecter
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;