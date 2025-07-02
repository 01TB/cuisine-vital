import { Navbar, Nav, Container } from 'react-bootstrap';

const AppNavbar = () => {
  return (
    <Navbar expand="lg" style={{  backgroundColor: '#FDF8E499' }} className="bg-opacity-75 backdrop-blur rounded" fixed="top">
      <Container>
        <Navbar.Brand href="home" className="navbar-brand-custom">Sotro Be</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="home" className="nav-link-custom d-flex align-items-center">
              <i className="bi bi-house-door-fill me-2"></i> Accueil
            </Nav.Link>
            <Nav.Link href="menus" className="nav-link-custom d-flex align-items-center">
              <i className="bi bi-book-fill me-2"></i> Menu
            </Nav.Link>
            <Nav.Link href="#restaurants" className="nav-link-custom d-flex align-items-center">
              <i className="bi bi-shop me-2"></i> Restaurants
            </Nav.Link>
            <Nav.Link href="#contact" className="nav-link-custom d-flex align-items-center">
              <i className="bi bi-envelope-fill me-2"></i> Contact
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="profile" className="profile-icon">
              <i className="bi bi-person-circle"></i>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;