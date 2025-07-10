import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function KitchenManagement() {
  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Gestion de Cuisine</h2>
          <Card>
            <Card.Body>
              <Card.Title>Kitchen Management</Card.Title>
              <Card.Text>
                Cette section est en cours de développement.
                Ici vous pourrez gérer la production en cuisine.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default KitchenManagement;