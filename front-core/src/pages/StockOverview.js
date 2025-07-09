import React, { useState, useEffect } from "react";
import { getStockOverview, utiliserStock } from "../services/api";
import { Link } from "react-router-dom";
import { Button, Modal, Form } from "react-bootstrap";

const StockOverview = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [quantityToUse, setQuantityToUse] = useState(0);

  const fetchStock = async () => {
    try {
      setLoading(true);
      const data = await getStockOverview();
      setStock(data);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement du stock.");
      alert("Erreur lors du chargement du stock.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleShowModal = (ingredient) => {
    setSelectedIngredient(ingredient);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIngredient(null);
    setQuantityToUse(0);
  };

  const handleUseStock = async (e) => {
    e.preventDefault();
    if (quantityToUse <= 0) {
      alert("La quantité doit être supérieure à zéro.");
      return;
    }
    try {
      await utiliserStock({
        ingredientId: selectedIngredient.id,
        quantite: quantityToUse,
      });
      alert(`Quantité de ${selectedIngredient.nom} déduite avec succès.`);
      handleCloseModal();
      fetchStock(); // Refresh the stock list
    } catch (err) {
      alert(err.response?.data?.message || "Une erreur est survenue.");
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;
  if (error) return <div className="p-4 text-danger">{error}</div>;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>État du Stock</h1>
        <Link to="/admin/dashboard/stock/entry" className="btn btn-primary">
          Ajouter une entrée
        </Link>
      </div>
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Ingrédient</th>
            <th>Stock Actuel</th>
            <th>Unité</th>
            <th>Stock Minimum</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((item) => (
            <tr key={item.id}>
              <td>{item.nom}</td>
              <td>{item.stockActuel}</td>
              <td>{item.unite_mesure}</td>
              <td>{item.stock_minimum}</td>
              <td>
                {item.stockActuel <= item.stock_minimum ? (
                  <span className="badge bg-danger">Critique</span>
                ) : (
                  <span className="badge bg-success">OK</span>
                )}
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleShowModal(item)}
                >
                  Utiliser
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedIngredient && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Utiliser: {selectedIngredient.nom}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Stock actuel: {selectedIngredient.stockActuel}{" "}
              {selectedIngredient.unite_mesure}
            </p>
            <Form onSubmit={handleUseStock}>
              <Form.Group>
                <Form.Label>Quantité à utiliser</Form.Label>
                <Form.Control
                  type="number"
                  value={quantityToUse}
                  onChange={(e) => setQuantityToUse(parseFloat(e.target.value))}
                  min="0"
                  step="0.1"
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-3">
                Confirmer
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default StockOverview;
