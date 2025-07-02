
import { ShoppingCart, BarChart3, Menu, ChefHat, Bell, Search, Package, Settings, ChevronRight, ChevronDown } from 'lucide-react';

const StatsCard = ({ title, value, subtitle, change, icon: Icon, color = 'blue' }) => (
  <div className="stats-card">
    <div className="stats-header">
      <div className="stats-title-container">
        <Icon size={20} className="stats-icon-header" />
        <h3 className="stats-title">{title}</h3>
      </div>
      <Icon size={24} className={`stats-icon-large text-${color}-500`} />
    </div>
    <div className="stats-content">
      <div className="stats-value">{value}</div>
      <div className="stats-subtitle">{subtitle}</div>
      <div className="stats-change">{change}</div>
    </div>
  </div>
);

export default StatsCard;