import React, { useEffect, useState } from 'react';
import { Modal, Button, Tabs, Tab, Table, Form } from 'react-bootstrap';

// Mockup des menus
const mockMenus = [
  { id: 1, nom: 'Menu Zebu', description: 'Viande zébu + riz', prix_carte: 12000 },
  { id: 2, nom: 'Menu Poulet', description: 'Poulet grillé + légumes', prix_carte: 15000 },
  { id: 3, nom: 'Menu Végétarien', description: 'Tofu + salade', prix_carte: 10000 },
];

// Mockup des détails des commandes
const mockDetails = {
  '1': [
    { menu_id: 1, quantite: 1, prix_unitaire: 12000, accompagnement_id: null, boisson_id: 1, notes: "Peu épicé" },
    { menu_id: 2, quantite: 2, prix_unitaire: 15000, accompagnement_id: null, boisson_id: 2, notes: "" }
  ],
  '2': [
    { menu_id: 2, quantite: 1, prix_unitaire: 15000, accompagnement_id: null, boisson_id: 1, notes: "Sans sauce" },
    { menu_id: 3, quantite: 3, prix_unitaire: 10000, accompagnement_id: null, boisson_id: 3, notes: "Vegan" }
  ],
  '3': [
    { menu_id: 1, quantite: 2, prix_unitaire: 12000, accompagnement_id: null, boisson_id: 1, notes: "" }
  ]
};

// Mockup des commandes
const mockCommandes = [
  {
    id: '1',
    numero_commande: 'CMD001',
    date_commande: new Date().toISOString(),
    nom_client: 'Jean Rakoto',
    montant_total: 35000,
    total_quantite: 3,
  },
  {
    id: '2',
    numero_commande: 'CMD002',
    date_commande: new Date().toISOString(),
    nom_client: 'Sophie Rasoanaivo',
    montant_total: 42000,
    total_quantite: 4,
  },
  {
    id: '3',
    numero_commande: 'CMD003',
    date_commande: new Date().toISOString(),
    nom_client: 'Tiana Randria',
    montant_total: 27000,
    total_quantite: 2,
  }
];

const Commandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [filteredCommandes, setFilteredCommandes] = useState([]);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [commandeDetails, setCommandeDetails] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteMessage, setNoteMessage] = useState('');
  const [filtre, setFiltre] = useState({ quantite: '', prix: '', ordre: '' });

  useEffect(() => {
    setCommandes(mockCommandes);
    setFilteredCommandes(mockCommandes);
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
    const details = mockDetails[commande.id] || [];
    setCommandeDetails(details);
    setShowDetailsModal(true);
  };

  const sendNote = () => {
    setShowNoteModal(false);
    setNoteMessage('');
    alert('Note envoyée !');
  };

  const getMenuName = (menuId) => {
    const menu = mockMenus.find(m => m.id === menuId);
    return menu ? menu.nom : 'Menu inconnu';
  };

  return (
    <div>
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
          <p className="mt-3">À venir : Historique global des commandes</p>
        </Tab>
      </Tabs>

      {/* MODAL DÉTAILS */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails de la commande</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCommande && (
            <>
              <p><strong>Commande :</strong> {selectedCommande.numero_commande}</p>
              <p><strong>Client :</strong> {selectedCommande.nom_client}</p>
              <p><strong>Montant total :</strong> {selectedCommande.montant_total} Ar</p>
              <h5 className="mt-4">Menus commandés</h5>
              <Table size="sm" bordered>
                <thead>
                  <tr>
                    <th>Menu</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {commandeDetails.map((detail, index) => (
                    <tr key={index}>
                      <td>{getMenuName(detail.menu_id)}</td>
                      <td>{detail.quantite}</td>
                      <td>{detail.prix_unitaire} Ar</td>
                      <td>{detail.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button onClick={() => setShowNoteModal(true)}>Envoyer une note</Button>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* MODAL NOTE */}
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
