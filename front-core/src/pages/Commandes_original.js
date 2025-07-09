import React, { useEffect, useState } from 'react';
import { Modal, Button, Tabs, Tab, Table, Form, InputGroup } from 'react-bootstrap';
import api from '../services/api';

const Commandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [filteredCommandes, setFilteredCommandes] = useState([]);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteMessage, setNoteMessage] = useState('');
  const [filtre, setFiltre] = useState({ quantite: '', prix: '', ordre: '' });

  const fetchCommandes = async () => {
    try {
      const res = await api.get('/commandes/aujourdhui');
      setCommandes(res.data);
      setFilteredCommandes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, []);

  const handleFiltrer = () => {
    let result = [...commandes];
    if (filtre.quantite) result = result.filter(c => c.total_quantite >= +filtre.quantite);
    if (filtre.prix) result = result.filter(c => c.montant_total >= +filtre.prix);
    if (filtre.ordre === 'asc') result.sort((a, b) => a.date_commande.localeCompare(b.date_commande));
    if (filtre.ordre === 'desc') result.sort((a, b) => b.date_commande.localeCompare(a.date_commande));
    setFilteredCommandes(result);
  };

  const openDetails = (commande) => {
    setSelectedCommande(commande);
    setShowDetailsModal(true);
  };

  const sendNote = () => {
    // Appel API ici pour envoyer la note
    setShowNoteModal(false);
    setNoteMessage('');
    alert('Note envoyée !');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Liste des Commandes</h2>
      <Tabs defaultActiveKey="aujourdhui">
        <Tab eventKey="aujourdhui" title="Commandes d'aujourd'hui">
          <div className="my-3">
            <Form className="d-flex gap-3 align-items-end">
              <Form.Group>
                <Form.Label>Quantité min</Form.Label>
                <Form.Control type="number" value={filtre.quantite} onChange={e => setFiltre({ ...filtre, quantite: e.target.value })} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Prix min</Form.Label>
                <Form.Control type="number" value={filtre.prix} onChange={e => setFiltre({ ...filtre, prix: e.target.value })} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Ordre</Form.Label>
                <Form.Select value={filtre.ordre} onChange={e => setFiltre({ ...filtre, ordre: e.target.value })}>
                  <option value="">--</option>
                  <option value="asc">Date croissante</option>
                  <option value="desc">Date décroissante</option>
                </Form.Select>
              </Form.Group>
              <Button variant="primary" onClick={handleFiltrer}>Filtrer</Button>
            </Form>
          </div>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Date</th>
                <th>Client</th>
                <th>Montant</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommandes.map(cmd => (
                <tr key={cmd.id}>
                  <td>{cmd.numero_commande}</td>
                  <td>{new Date(cmd.date_commande).toLocaleString()}</td>
                  <td>{cmd.nom_client}</td>
                  <td>{cmd.montant_total} Ar</td>
                  <td>
                    <Button size="sm" onClick={() => openDetails(cmd)}>Détails</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="historique" title="Historique des commandes">
          {/* Tu pourras ajouter ici un autre tableau avec les anciennes commandes */}
          <p className="mt-3">À venir : Historique global des commandes</p>
        </Tab>
      </Tabs>

      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails de la commande</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCommande && (
            <div>
              <p><strong>Commande :</strong> {selectedCommande.numero_commande}</p>
              <p><strong>Client :</strong> {selectedCommande.nom_client}</p>
              <p><strong>Montant total :</strong> {selectedCommande.montant_total} Ar</p>
              <Button onClick={() => setShowNoteModal(true)}>Envoyer une note</Button>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showNoteModal} onHide={() => setShowNoteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Envoyer une note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={3} value={noteMessage} onChange={e => setNoteMessage(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNoteModal(false)}>Annuler</Button>
          <Button variant="primary" onClick={sendNote}>Envoyer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Commandes;