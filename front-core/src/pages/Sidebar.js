import React, { useState } from 'react';
import { ShoppingCart, BarChart3, Menu, ChefHat, Package, Settings, ChevronRight, ChevronDown } from 'lucide-react';
import '../styles/custom.css';

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
      hasSubmenu: false
    },
    { 
      id: 'ingredients', 
      label: 'Ingrédients', 
      icon: Package,
      hasSubmenu: false
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

export default Sidebar;
