import React from 'react';
import { Container, Card } from 'react-bootstrap';

const LivreurDashboard = () => {
  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Tableau de Bord Livreur</Card.Title>
          <Card.Text>
            Bienvenue ! Voici la liste des livraisons qui vous sont assignées.
            (Page en cours de développement)
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LivreurDashboard;
