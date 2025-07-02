import { ShoppingCart, BarChart3, Menu, ChefHat, Bell, Search, Package, Settings, ChevronRight, ChevronDown } from 'lucide-react';
import StatsCard from './StatsCard';
import PopularDishes from './PopularDishes';
import KitchenWorkflow from './KitchenWorkflow';

const Overview = () => (
  <div className="dashboard">
    <div className="dashboard-header">
      <h1 className="dashboard-title">Bonjour, Admin!</h1>
      <p className="dashboard-subtitle">Votre journal d'opération pour Cuisine Vital'</p>
    </div>
    
    <div className="dashboard-content">
      <div className="dashboard-stats">
        <StatsCard
          title="Commandes en cours"
          value="0"
          subtitle="Actives et en progression"
          change="📈 +12% depuis hier"
          icon={Package}
          color="blue"
        />
        <StatsCard
          title="Revenus journaliers"
          value={`Ar`}
          subtitle="Revenus d'aujourd'hui"
          change="📈 +5%"
          icon={BarChart3}
          color="blue"
        />
      </div>
      
      <div className="dashboard-details">
        <PopularDishes />
        <KitchenWorkflow />
      </div>
    </div>
  </div>
);

export default Overview;