import React, { useState } from 'react';
import { ShoppingCart, BarChart3, Menu, ChefHat, Bell, Search, Package, Settings, ChevronRight, ChevronDown } from 'lucide-react';
// Correction du chemin CSS - choisissez le bon selon votre structure :
// Si Dashboard.js est dans src/pages/ et custom.css dans src/styles/ :
import '../styles/custom.css';
// OU si custom.css est dans src/pages/styles/ :
// import './styles/custom.css';
// OU si custom.css est dans public/styles/ :
// import '../../public/styles/custom.css';

// Composant Navbar (maintenant utilisé)
const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-left">
      <div className="logo-container">
        <span className="logo-icon">✕</span>
        <span className="logo-text">Cuisine Vital'</span>
      </div>
      <div className="nav-links">
        <a href="#commandes" className="nav-link">Commandes</a>
        <a href="#menu" className="nav-link">Gestion du menu</a>
        <a href="#cuisine" className="nav-link">Gestion de la cuisine</a>
        <a href="#ingredients" className="nav-link">Ingrédients</a>
        <a href="#stats" className="nav-link">Statistiques & Analyses</a>
        <a href="#settings" className="nav-link">Paramètres</a>
      </div>
    </div>
    <div className="navbar-right">
      <div className="search-container">
        <Search size={16} className="search-icon" />
        <input 
          type="text" 
          placeholder="Rechercher..." 
          className="search-input" 
        />
      </div>
      <div className="notification-container">
        <Bell className="notification-icon" size={20} />
      </div>
      <div className="messages-container">
        <Package className="messages-icon" size={20} />
      </div>
      <div className="user-profile">
        <img 
          src="https://via.placeholder.com/32x32/4f46e5/ffffff?text=TB" 
          alt="Utilisateur" 
          className="user-avatar" 
        />
      </div>
    </div>
  </nav>
);

// Composant Sidebar
const Sidebar = ({ currentPage, onNavigate }) => {
  const [expandedMenus, setExpandedMenus] = useState({
    'gestion-menu': true,
    'gestion-cuisine': false,
    'ingredients': false
  });

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const menuItems = [
    { 
      id: 'commandes', 
      label: 'Commandes', 
      icon: ShoppingCart,
      hasSubmenu: false
    },
    { 
      id: 'gestion-menu', 
      label: 'Gestion du menu', 
      icon: Menu,
      hasSubmenu: true,
      submenuItems: [
        { id: 'plats', label: 'Plats' },
        { id: 'categories', label: 'Catégories' },
        { id: 'nouveau-plat', label: 'Ajouter un nouveau plat' },
        { id: 'promotions', label: 'Promotions' }
      ]
    },
    { 
      id: 'gestion-cuisine', 
      label: 'Gestion de la cuisine', 
      icon: ChefHat,
      hasSubmenu: true,
      submenuItems: []
    },
    { 
      id: 'ingredients', 
      label: 'Ingrédients', 
      icon: Package,
      hasSubmenu: true,
      submenuItems: []
    },
    { 
      id: 'statistiques', 
      label: 'Statistiques & Analyses', 
      icon: BarChart3,
      hasSubmenu: false
    },
    { 
      id: 'parametres', 
      label: 'Paramètres', 
      icon: Settings,
      hasSubmenu: false
    }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map(item => {
          const IconComponent = item.icon;
          const isExpanded = expandedMenus[item.id];
          
          return (
            <div key={item.id} className="sidebar-menu-group">
              <button
                onClick={() => item.hasSubmenu ? toggleMenu(item.id) : onNavigate(item.id)}
                className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
              >
                <IconComponent size={18} className="sidebar-icon" />
                <span className="sidebar-label">{item.label}</span>
                {item.hasSubmenu && (
                  isExpanded ? 
                    <ChevronDown size={16} className="sidebar-chevron" /> :
                    <ChevronRight size={16} className="sidebar-chevron" />
                )}
              </button>
              
              {item.hasSubmenu && isExpanded && item.submenuItems && (
                <div className="sidebar-submenu">
                  {item.submenuItems.map(subItem => (
                    <button
                      key={subItem.id}
                      onClick={() => onNavigate(subItem.id)}
                      className={`sidebar-subitem ${currentPage === subItem.id ? 'active' : ''}`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <img 
            src="https://via.placeholder.com/40x40/4f46e5/ffffff?text=TB" 
            alt="Utilisateur" 
            className="sidebar-avatar" 
          />
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">Admin</span>
            <span className="sidebar-user-role">Admin User</span>
          </div>
        </div>
        <div className="sidebar-branding">
          <span className="made-with">Made with</span>
          <span className="brand-name">Ysily</span>
        </div>
      </div>
    </aside>
  );
};

// Composant des statistiques principales avec icônes
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

// Composant de la liste des plats populaires avec images
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

// Composant du workflow de cuisine
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

// Composant Dashboard principal
const Dashboard = () => (
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

// Composant principal App
const App = () => {
  const [currentPage, setCurrentPage] = useState('commandes');

  const renderPage = () => {
    switch (currentPage) {
      case 'commandes':
      case 'plats':
      case 'categories':
      case 'nouveau-plat':
      case 'promotions':
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <div className="app-content">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;