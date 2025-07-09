import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';

const mockMenus = [
  { id: 1, nom: 'Poulet grillé', description: 'Délicieux poulet aux herbes', prix_carte: 12.5, temps_preparation: 30 },
  { id: 2, nom: 'Burger végé', description: 'Burger à base de lentilles', prix_carte: 10.0, temps_preparation: 20 },
];

const mockIngredients = [
  { id: 1, nom: 'Poulet', unite_mesure: 'kg' },
  { id: 2, nom: 'Salade', unite_mesure: 'g' },
  { id: 3, nom: 'Tomate', unite_mesure: 'pièce' },
  { id: 4, nom: 'Pain', unite_mesure: 'pièce' },
  { id: 5, nom: 'Lentilles', unite_mesure: 'g' },
];

const MenusPage = () => {
  const [showDetails, setShowDetails] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [menuForm, setMenuForm] = useState({ nom: '', description: '', prix_carte: '', temps_preparation: '' });
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const handleToggleIngredient = (ingredient) => {
    const exists = selectedIngredients.find((i) => i.id === ingredient.id);
    if (exists) {
      setSelectedIngredients(selectedIngredients.filter((i) => i.id !== ingredient.id));
    } else {
      setSelectedIngredients([...selectedIngredients, { ...ingredient, quantite: 1 }]);
    }
  };

  const handleQuantityChange = (id, quantite) => {
    setSelectedIngredients(
      selectedIngredients.map((i) => (i.id === id ? { ...i, quantite } : i))
    );
  };

  const handleCreateMenu = () => {
    const payload = {
      ...menuForm,
      prix_carte: parseFloat(menuForm.prix_carte),
      temps_preparation: parseInt(menuForm.temps_preparation),
      recette: selectedIngredients.map((i) => ({ ingredient_id: i.id, quantite: parseFloat(i.quantite) })),
    };
    console.log('Payload to send to API:', payload);
    setShowAddMenu(false);
    setMenuForm({ nom: '', description: '', prix_carte: '', temps_preparation: '' });
    setSelectedIngredients([]);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Liste des menus</h3>
        <Button variant="primary" onClick={() => setShowAddMenu(true)}>Ajouter un menu</Button>
      </div>

      {mockMenus.map((menu) => (
        <div key={menu.id} className="border rounded p-3 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5>{menu.nom}</h5>
              <p className="mb-1 text-muted">{menu.description}</p>
              <small>{menu.prix_carte} € - {menu.temps_preparation} min</small>
            </div>
            <Button variant="outline-secondary" onClick={() => setShowDetails(menu)}>Détails</Button>
          </div>
        </div>
      ))}

      {/* Modal Détails */}
      <Modal show={!!showDetails} onHide={() => setShowDetails(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Détails du menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showDetails && (
            <>
              <h5>{showDetails.nom}</h5>
              <p>{showDetails.description}</p>
              <p><strong>Prix :</strong> {showDetails.prix_carte} €</p>
              <p><strong>Temps de préparation :</strong> {showDetails.temps_preparation} min</p>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal Ajouter Menu */}
      <Modal show={showAddMenu} onHide={() => setShowAddMenu(false)} dialogClassName="modal-xl">
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un nouveau menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    value={menuForm.nom}
                    onChange={(e) => setMenuForm({ ...menuForm, nom: e.target.value })}
                    placeholder="Nom du menu"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={menuForm.description}
                    onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                    placeholder="Description"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Prix à la carte (€)</Form.Label>
                  <Form.Control
                    type="number"
                    value={menuForm.prix_carte}
                    onChange={(e) => setMenuForm({ ...menuForm, prix_carte: e.target.value })}
                    placeholder="12.50"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Temps de préparation (min)</Form.Label>
                  <Form.Control
                    type="number"
                    value={menuForm.temps_preparation}
                    onChange={(e) => setMenuForm({ ...menuForm, temps_preparation: e.target.value })}
                    placeholder="30"
                  />
                </Form.Group>
              </Form>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Recherche d'ingrédients</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Rechercher par nom..."
                  value={ingredientSearch}
                  onChange={(e) => setIngredientSearch(e.target.value)}
                />
              </Form.Group>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }} className="mb-3">
                {mockIngredients
                  .filter((ing) => ing.nom.toLowerCase().includes(ingredientSearch.toLowerCase()))
                  .map((ingredient) => (
                    <Form.Check
                      key={ingredient.id}
                      type="checkbox"
                      label={`${ingredient.nom} (${ingredient.unite_mesure})`}
                      checked={selectedIngredients.some((i) => i.id === ingredient.id)}
                      onChange={() => handleToggleIngredient(ingredient)}
                      className="mb-1"
                    />
                  ))}
              </div>
              <h6>Ingrédients sélectionnés :</h6>
              {selectedIngredients.length === 0 && <p className="text-muted">Aucun ingrédient sélectionné.</p>}
              {selectedIngredients.map((i) => (
                <InputGroup key={i.id} className="mb-2">
                  <InputGroup.Text>{i.nom}</InputGroup.Text>
                  <Form.Control
                    type="number"
                    value={i.quantite}
                    onChange={(e) => handleQuantityChange(i.id, e.target.value)}
                    placeholder={`Quantité en ${i.unite_mesure}`}
                  />
                </InputGroup>
              ))}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddMenu(false)}>Annuler</Button>
          <Button variant="success" onClick={handleCreateMenu}>Créer le menu</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MenusPage;