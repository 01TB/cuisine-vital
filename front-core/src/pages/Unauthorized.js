import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <Container className="text-center mt-5">
      <h2>403 - Accès non autorisé</h2>
      <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      <Button as={Link} to="/" variant="primary">Retour à l'accueil</Button>
    </Container>
  );
};

export default Unauthorized;
