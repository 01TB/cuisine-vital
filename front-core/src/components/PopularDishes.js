import { ShoppingCart, BarChart3, Menu, ChefHat, Bell, Search, Package, Settings, ChevronRight, ChevronDown } from 'lucide-react';

const PopularDishes = () => {
  const dishes = [
    { name: 'Ravitoto au coco sy Hena kisoa', orders: '550 Commandes', image: 'https://via.placeholder.com/50x50/8b5a3c/ffffff?text=🍛' },
    { name: 'Ravitoto au coco sy Hena kisoa', orders: '480 Commandes', image: 'https://via.placeholder.com/50x50/8b5a3c/ffffff?text=🍛' },
    { name: 'Ravitoto au coco sy Hena kisoa', orders: '420 Commandes', image: 'https://via.placeholder.com/50x50/8b5a3c/ffffff?text=🍛' },
    { name: 'Ravitoto au coco sy Hena kisoa', orders: '390 Commandes', image: 'https://via.placeholder.com/50x50/8b5a3c/ffffff?text=🍛' },
    { name: 'Ravitoto au coco sy Hena kisoa', orders: '310 Commandes', image: 'https://via.placeholder.com/50x50/8b5a3c/ffffff?text=🍛' },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <ShoppingCart size={20} className="card-icon" />
        <h3 className="card-title">Plats les plus vendus</h3>
      </div>
      <div className="dishes-list">
        {dishes.map((dish, index) => (
          <div key={index} className="dish-item">
            <img src={dish.image} alt={dish.name} className="dish-image" />
            <div className="dish-info">
              <span className="dish-name">{dish.name}</span>
              <span className="dish-orders">{dish.orders}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default PopularDishes;