import { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

function Abonnements() {
  const [abonnements, setAbonnements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAbonnement, setNewAbonnement] = useState({ clientId: '', type: '', startDate: '', status: 'pending' });

  useEffect(() => {
    // Récupérer la liste des abonnements depuis le back-end
    axios.get('http://localhost:3000/api/abonnements')
      .then(response => setAbonnements(response.data))
      .catch(error => console.error('Erreur lors de la récupération des abonnements:', error));
  }, []);

  const handleAddAbonnement = () => {
    axios.post('http://localhost:3000/api/abonnements', newAbonnement)
      .then(response => {
        setAbonnements([...abonnements, response.data]);
        setShowModal(false);
        setNewAbonnement({ clientId: '', type: '', startDate: '', status: 'pending' });
      })
      .catch(error => console.error('Erreur lors de l\'ajout:', error));
  };

  return (
    <Container className="mt-4">
      <h2>Gestion des Abonnements</h2>
      <Button variant="primary" onClick={() => setShowModal(true)}>Ajouter un abonnement</Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID Client</th>
            <th>Type</th>
            <th>Date de début</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {abonnements.map(abonnement => (
            <tr key={abonnement.id}>
              <td>{abonnement.clientId}</td>
              <td>{abonnement.type}</td>
              <td>{abonnement.startDate}</td>
              <td>{abonnement.status}</td>
              <td>
                <Button variant="warning" size="sm">Modifier</Button>{' '}
                <Button variant="danger" size="sm">Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal pour ajouter un abonnement */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Abonnement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID Client</Form.Label>
              <Form.Control
                type="text"
                value={newAbonnement.clientId}
                onChange={e => setNewAbonnement({ ...newAbonnement, clientId: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type d'abonnement</Form.Label>
              <Form.Control
                type="text"
                value={newAbonnement.type}
                onChange={e => setNewAbonnement({ ...newAbonnement, type: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date de début</Form.Label>
              <Form.Control
                type="date"
                value={newAbonnement.startDate}
                onChange={e => setNewAbonnement({ ...newAbonnement, startDate: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Statut</Form.Label>
              <Form.Select
                value={newAbonnement.status}
                onChange={e => setNewAbonnement({ ...newAbonnement, status: e.target.value })}
              >
                <option value="pending">En attente</option>
                <option value="active">Actif</option>
                <option value="cancelled">Annulé</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button variant="primary" onClick={handleAddAbonnement}>Ajouter</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Abonnements;