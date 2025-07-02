import React from 'react';
import { Bell, Search, Package } from 'lucide-react';
import '../styles/custom.css';

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
        <a href="#ingredients" className="nav-link">Ingrédientss</a>
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

export default Navbar;
