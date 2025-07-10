// src/components/LivreurNavbar.js
import React from 'react';
// 1. Importer Nav de react-bootstrap et NavLink de react-router-dom
import { Navbar, Container, Dropdown, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useUserAuth } from '../hooks/useUserAuth';

const LivreurNavbar = () => {
  const { user, logout } = useUserAuth();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  if (!user) {
    return null; // Ne rien afficher si l'utilisateur n'est pas encore chargé
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container fluid>
        {/* On transforme la marque en lien vers le dashboard */}
        <Navbar.Brand as={NavLink} to="/admin/livreur/dashboard" className="fw-bold">
          <span className="text-primary">✕</span> Espace Livreur
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="livreur-navbar-nav" />
        <Navbar.Collapse id="livreur-navbar-nav">

          {/* 2. Ajout de la section de navigation principale */}
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/admin/livreur/dashboard">
              Tableau de bord
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/livreur/itineraire">
              Mon Itinéraire
            </Nav.Link>
          </Nav>

          {/* 3. Le menu déroulant de l'utilisateur reste à droite */}
          <Dropdown align="end">
            <Dropdown.Toggle variant="dark" id="dropdown-livreur" className="d-flex align-items-center">
              <img 
                src="https://i.pravatar.cc/32" 
                alt="avatar" 
                className="rounded-circle me-2"
                style={{ width: '32px', height: '32px' }}
              />
              <span>{user.prenom}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleLogout} className="text-danger">
                Déconnexion
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default LivreurNavbar;