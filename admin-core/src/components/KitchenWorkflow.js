import { ShoppingCart, BarChart3, Menu, ChefHat, Bell, Search, Package, Settings, ChevronRight, ChevronDown } from 'lucide-react';

const KitchenWorkflow = () => {
  return (
    <div className="card">
      <div className="card-header">
        <ChefHat size={20} className="card-icon" />
        <h3 className="card-title">Workflow en cuisine</h3>
      </div>
      <div className="workflow-list">
        <div className="workflow-item">
          <div className="workflow-header">
            <span className="workflow-status">En préparation</span>
          </div>
          <div className="workflow-progress">
            <div className="progress-bar-container">
              <div className="progress-bar blue" style={{ width: '70%' }}></div>
            </div>
            <span className="workflow-count">12 commandes</span>
          </div>
        </div>
        
        <div className="workflow-item">
          <div className="workflow-header">
            <span className="workflow-status">Prêtes</span>
          </div>
          <div className="workflow-progress">
            <div className="progress-bar-container">
              <div className="progress-bar blue" style={{ width: '40%' }}></div>
            </div>
            <span className="workflow-count">5 commandes, en attentes de leur livreur</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenWorkflow;