import React, { useState, useEffect } from 'react';
import { getStockHistory, getAllIngredients } from '../services/api';

const StockHistory = () => {
  const [history, setHistory] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await getAllIngredients();
        setIngredients(data);
      } catch (error) {
        alert('Erreur lors du chargement des ingrédients.');
      }
    };
    fetchIngredients();
  }, []);

  const handleSelectChange = async (e) => {
    const ingredientId = e.target.value;
    setSelectedIngredient(ingredientId);
    if (ingredientId) {
      setLoading(true);
      try {
        const data = await getStockHistory(ingredientId);
        setHistory(data);
      } catch (error) {
        alert("Erreur lors du chargement de l'historique.");
      } finally {
        setLoading(false);
      }
    } else {
      setHistory([]);
    }
  };

  return (
    <div className="container-fluid p-4">
      <h1>Historique des Mouvements de Stock</h1>
      <div className="mb-3">
        <label htmlFor="ingredientSelect" className="form-label">Sélectionnez un ingrédient</label>
        <select
          id="ingredientSelect"
          className="form-select"
          value={selectedIngredient}
          onChange={handleSelectChange}
        >
          <option value="">-- Choisissez un ingrédient --</option>
          {ingredients.map((ing) => (
            <option key={ing.id} value={ing.id}>
              {ing.nom}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Chargement de l'historique...</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Quantité</th>
              <th>Stock Avant</th>
              <th>Stock Après</th>
              <th>Utilisateur</th>
              <th>Commentaire</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.created_at).toLocaleString()}</td>
                  <td>
                    {item.type_mouvement === 'ENTREE' ? (
                      <span className="badge bg-success">Entrée</span>
                    ) : (
                      <span className="badge bg-danger">Sortie</span>
                    )}
                  </td>
                  <td>{item.quantite}</td>
                  <td>{item.stock_avant}</td>
                  <td>{item.stock_apres}</td>
                  <td>{item.utilisateur?.nom || 'N/A'}</td>
                  <td>{item.commentaire}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  {selectedIngredient ? 'Aucun mouvement trouvé pour cet ingrédient.' : 'Veuillez sélectionner un ingrédient pour voir son historique.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockHistory;
