import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function Statistics() {
  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Statistiques</h2>
          <Card>
            <Card.Body>
              <Card.Title>Analyse des performances</Card.Title>
              <Card.Text>
                Cette section est en cours de développement.
                Ici vous pourrez voir toutes vos statistiques.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Statistics;