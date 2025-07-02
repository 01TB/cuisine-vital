import { useState } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import '../styles/Commandes.css';

function Commandes() {
  const [commande, setCommande] = useState({ menuId: '', quantite: 1, dateLivraison: '' });
  const [commandes, setCommandes] = useState([
    { id: 1, menu: 'Salade de Saumon', quantite: 1, statut: 'En préparation', date: '2025-06-29 12:00' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCommandes([...commandes, { id: commandes.length + 1, menu: `Menu ${commande.menuId}`, ...commande, statut: 'Reçue' }]);
    setCommande({ menuId: '', quantite: 1, dateLivraison: '' });
  };

  return (
    <Container className="mt-4">
      <h2>Gestion des Commandes</h2>
      <Row className="mb-4">
        <Col md={6}>
          <h3>Prise de Commande</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Menu</Form.Label>
              <Form.Control as="select" value={commande.menuId} onChange={e => setCommande({ ...commande, menuId: e.target.value })}>
                <option value="">Sélectionner un menu</option>
                <option value="1">Salade de Saumon</option>
                <option value="2">Pizza Margherita</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantité</Form.Label>
              <Form.Control type="number" value={commande.quantite} min="1" onChange={e => setCommande({ ...commande, quantite: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date/Heure de Livraison</Form.Label>
              <Form.Control type="datetime-local" value={commande.dateLivraison} onChange={e => setCommande({ ...commande, dateLivraison: e.target.value })} />
            </Form.Group>
            <Button variant="primary" type="submit">Passer la Commande</Button>
          </Form>
        </Col>
        <Col md={6}>
          <h3>Suivi des Commandes</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Menu</th>
                <th>Quantité</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {commandes.map(cmd => (
                <tr key={cmd.id}>
                  <td>{cmd.menu}</td>
                  <td>{cmd.quantite}</td>
                  <td>{cmd.date}</td>
                  <td>{cmd.statut}</td>
                  <td>
                    <Button variant="warning" size="sm">Modifier</Button>{' '}
                    <Button variant="danger" size="sm">Annuler</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default Commandes;