import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import api from '../const/api';

const MenusPage = () => {
  const [menus, setMenus] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [showDetails, setShowDetails] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [menuForm, setMenuForm] = useState({ nom: '', description: '', prix_carte: '', temps_preparation: '' });
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  useEffect(() => {
    fetchMenus();
    fetchIngredients();
  }, []);

  const fetchMenus = async () => {
    const res = await fetch(api('chef-cuisinier/menus'));
    const data = await res.json();
    setMenus(data);
  };

  const fetchIngredients = async () => {
    const res = await fetch(api('chef-cuisinier/ingredients')); 
    const data = await res.json();
    setIngredients(data);
  };

  const handleToggleIngredient = ing => {
    setSelectedIngredients(prev => {
      const exists = prev.some(i => i.id === ing.id);
      return exists ? prev.filter(i => i.id !== ing.id) : [...prev, { ...ing, quantite: 1 }];
    });
  };

  const handleQuantityChange = (id, quantite) => {
    setSelectedIngredients(prev =>
      prev.map(i => (i.id === id ? { ...i, quantite } : i))
    );
  };

  const handleCreateMenu = async () => {
    const payload = {
      ...menuForm,
      prix_carte: parseFloat(menuForm.prix_carte),
      temps_preparation: parseInt(menuForm.temps_preparation),
      recette: selectedIngredients.map(i => ({
        ingredient_id: i.id,
        quantite: parseFloat(i.quantite),
      })),
    };
    const res = await fetch(api('chef-cuisinier/menus'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Erreur');
    setShowAddMenu(false);
    setMenuForm({ nom: '', description: '', prix_carte: '', temps_preparation: '' });
    setSelectedIngredients([]);
    fetchMenus();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Liste des menus</h3>
        <Button variant="primary" onClick={() => setShowAddMenu(true)}>Ajouter un menu</Button>
      </div>

      {menus.map(menu => (
        <div key={menu.id} className="border rounded p-3 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5>{menu.nom}</h5>
              <p className="mb-1 text-muted">{menu.description}</p>
              <small>{menu.prixCarte} € - {menu.tempsPreparation} min</small>
            </div>
            <Button variant="outline-secondary" onClick={() => setShowDetails(menu)}>Détails</Button>
          </div>
        </div>
      ))}

      <Modal show={!!showDetails} onHide={() => setShowDetails(null)}>
        <Modal.Header closeButton><Modal.Title>Détails du menu</Modal.Title></Modal.Header>
        <Modal.Body>
          {showDetails && (
            <>
              <h5>{showDetails.nom}</h5>
              <p>{showDetails.description}</p>
              <p><strong>Prix :</strong> {showDetails.prixCarte} €</p>
              <p><strong>Temps de préparation :</strong> {showDetails.tempsPreparation} min</p>
              <h6>Ingrédients :</h6>
              <ul>
                {showDetails.recettes?.map(r => (
                  <li key={r.id}>
                    {r.ingredient.nom}: {r.quantite}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showAddMenu} onHide={() => setShowAddMenu(false)} size="xl">
        <Modal.Header closeButton><Modal.Title>Ajouter un nouveau menu</Modal.Title></Modal.Header>
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
                    placeholder="Description du menu"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Prix à la carte (Ar)</Form.Label>
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
                  placeholder="Rechercher..."
                  value={ingredientSearch}
                  onChange={e => setIngredientSearch(e.target.value)}
                />
              </Form.Group>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {ingredients.filter(ing => ing.nom.toLowerCase().includes(ingredientSearch.toLowerCase()))
                  .map(ing => (
                    <Form.Check
                      key={ing.id}
                      type="checkbox"
                      label={`${ing.nom}`}
                      checked={selectedIngredients.some(i => i.id === ing.id)}
                      onChange={() => handleToggleIngredient(ing)}
                    />
                  ))}
              </div>
              <h6>Ingrédients sélectionnés :</h6>
              {selectedIngredients.length === 0 && <p className="text-muted">Aucun ingrédient sélectionné.</p>}
              {selectedIngredients.map(i => (
                <InputGroup key={i.id} className="mb-2">
                  <InputGroup.Text>{i.nom}</InputGroup.Text>
                  <Form.Control
                    type="number"
                    value={i.quantite}
                    onChange={e => handleQuantityChange(i.id, e.target.value)}
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
