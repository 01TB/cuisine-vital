// AdminNavbar.js - Version adaptée pour Cuisine Vital'
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiSearch, FiBell } from 'react-icons/fi';


function AdminNavbar() {
  return (
    <Navbar bg="white" variant="light" expand="lg" fixed="top" className="shadow-sm border-bottom">
      <Container fluid>
        {/* Logo et nom */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-dark">
          <span className="text-primary">✕</span> Cuisine Vital'
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Navigation principale */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/admin/commandes" className="text-dark">Commandes</Nav.Link>
            <Nav.Link as={Link} to="/admin/menu" className="text-dark">Gestion du menu</Nav.Link>
            <Nav.Link as={Link} to="/admin/kitchen" className="text-dark">Gestion de la cuisine</Nav.Link>
            <Nav.Link as={Link} to="/admin/ingredients" className="text-dark">Ingrédients</Nav.Link>
            <Nav.Link as={Link} to="/admin/statistics" className="text-dark">Statistiques & Analyses</Nav.Link>
            <Nav.Link as={Link} to="/admin/settings" className="text-dark">Paramètres</Nav.Link>
            <Nav.Link as={Link} to="/admin/gestionTrajet" className="text-dark">Gestion trajet</Nav.Link>
          </Nav>

          {/* Barre de recherche et actions */}
          <div className="d-flex align-items-center">
            {/* Barre de recherche */}
            <div className="position-relative me-3">
              <input
                type="text"
                className="form-control pe-5"
                placeholder="Rechercher..."
                style={{ width: '250px' }}
              />
              <FiSearch 
                className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" 
                size={18}
              />
            </div>

            {/* Notifications */}
            <button className="btn btn-light btn-sm me-2 position-relative">
              <FiBell size={18} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                3
              </span>
            </button>

            {/* Profil utilisateur */}
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" id="dropdown-basic" className="btn-sm d-flex align-items-center">
                <img 
                  src="/api/placeholder/32/32" 
                  alt="Profile" 
                  className="rounded-circle me-2"
                  style={{ width: '32px', height: '32px' }}
                />
                <span className="d-none d-sm-block">Tsitohaina Berthin</span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/profile">Mon Profil</Dropdown.Item>
                <Dropdown.Item href="#/settings">Paramètres</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="#/logout">Déconnexion</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AdminNavbar;