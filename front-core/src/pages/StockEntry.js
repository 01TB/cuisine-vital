
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllIngredients, addStockEntry } from '../services/api';

const StockEntry = () => {
  const [ingredients, setIngredients] = useState([]);
  const [formData, setFormData] = useState({
    ingredientId: '',
    quantite: '',
    prixUnitaireAchat: '',
    datePeremption: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = {
        ...formData,
        ingredientId: parseInt(formData.ingredientId),
        quantite: parseFloat(formData.quantite),
        prixUnitaireAchat: parseFloat(formData.prixUnitaireAchat),
      };
      await addStockEntry(dataToSubmit);
      alert('Entrée de stock ajoutée avec succès !');
      navigate('/admin/dashboard/stock');
    } catch (error) {
      alert(error.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-4">
      <h1>Ajouter une Entrée de Stock</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="ingredientId" className="form-label">Ingrédient</label>
          <select
            id="ingredientId"
            name="ingredientId"
            className="form-select"
            value={formData.ingredientId}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez un ingrédient</option>
            {ingredients.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="quantite" className="form-label">Quantité</label>
          <input
            type="number"
            id="quantite"
            name="quantite"
            className="form-control"
            value={formData.quantite}
            onChange={handleChange}
            required
            step="0.01"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="prixUnitaireAchat" className="form-label">Prix Unitaire d'Achat</label>
          <input
            type="number"
            id="prixUnitaireAchat"
            name="prixUnitaireAchat"
            className="form-control"
            value={formData.prixUnitaireAchat}
            onChange={handleChange}
            required
            step="0.01"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="datePeremption" className="form-label">Date de Péremption (Optionnel)</label>
          <input
            type="date"
            id="datePeremption"
            name="datePeremption"
            className="form-control"
            value={formData.datePeremption}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Ajout en cours...' : 'Ajouter'}
        </button>
      </form>
    </div>
  );
};

export default StockEntry;
