import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function Settings() {
  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Paramètres</h2>
          <Card>
            <Card.Body>
              <Card.Title>Configuration de l'application</Card.Title>
              <Card.Text>
                Cette section est en cours de développement.
                Ici vous pourrez configurer votre application.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Settings;