// src/pages/Ingredients.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Ingredients = () => {
  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Gestion des Ingrédients</h2>
          <Card>
            <Card.Body>
              <Card.Title>Liste des ingrédients</Card.Title>
              <Card.Text>
                Cette page permet de gérer les ingrédients du restaurant.
                <div>
                  <h3>Fonctionnalités :</h3>
                  <ul>
                    <li>Liste des ingrédients</li>
                    <li>Ajout d'ingrédients</li>
                    <li>Modification d'ingrédients</li>
                    <li>Suppression d'ingrédients</li>
                  </ul>
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Ingredients;