import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../const/api';
import { ShoppingCart } from 'lucide-react';

const PopularDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopMenus = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(api('admin/stats/top/menus'));
        setDishes(res.data);
      } catch (err) {
        setError('Erreur de chargement des plats populaires');
      } finally {
        setLoading(false);
      }
    };
    fetchTopMenus();
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <ShoppingCart size={20} className="card-icon" />
        <h3 className="card-title">Plats les plus vendus</h3>
      </div>
      <div className="dishes-list">
        {loading && <div>Chargement...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {!loading && !error && dishes.length === 0 && <div>Aucun plat populaire</div>}
        {!loading && !error && dishes.map((dish, index) => (
          <div key={index} className="dish-item">
            <img
              src={dish.photo_url || 'https://via.placeholder.com/50x50/8b5a3c/ffffff?text=🍛'}
              alt={dish.nom}
              className="dish-image"
            />
            <div className="dish-info">
              <span className="dish-name">{dish.nom}</span>
              <span className="dish-orders">{dish.quantiteTotale || dish.quantite_totale} Commandes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularDishes;