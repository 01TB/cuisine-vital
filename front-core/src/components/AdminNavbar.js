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

          {/*Actions */}
          <div className="d-flex align-items-center ms-auto">


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
                  alt="" 
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