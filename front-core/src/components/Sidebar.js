import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShoppingCart,
  BarChart3,
  Menu,
  ChefHat,
  Package,
  Settings,
  Box,
  UserCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList
} from 'lucide-react';
import '../styles/sidebar.css';

const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenuDropdown = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <aside
      className="d-flex flex-column bg-white vh-100 p-4 border-end shadow-sm"
      style={{ width: '260px' }}
    >
      {/* Titre */}
      <h1 className="d-flex align-items-center gap-2 text-primary fw-bold mb-4 fs-4">
        <Box className="icon-hover text-primary" size={24} />
        Sotrobe Manager
      </h1>

      {/* Navigation */}
      <nav className="nav flex-column gap-1">
        <NavItem to="/admin/dashboard/overview" icon={<ShoppingCart />} label="Commandes" />

        {/* Dropdown Gestion du menu */}
        <button
          onClick={toggleMenuDropdown}
          className="btn d-flex align-items-center justify-content-between px-3 py-2 rounded-3 text-start text-dark shadow-sm"
        >
          <div className="d-flex align-items-center gap-2">
            <Menu />
            Gestion du menu
          </div>
          {menuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {menuOpen && (
          <div className="ms-4 ps-2 border-start border-2 border-primary-subtle">
            <SubNavItem to="/admin/dashboard/gestion-menu/plats" label="Plats" />
            <SubNavItem to="/admin/dashboard/gestion-menu/categories" label="Catégories" />
            <SubNavItem to="/admin/dashboard/gestion-menu/nouveau-plat" label="Ajouter un plat" />
            <SubNavItem to="/admin/dashboard/gestion-menu/promotions" label="Promotions" />
          </div>
        )}

        <NavItem to="/admin/dashboard/abonnements" icon={<Box />} label="Abonnements" />
        <NavItem to="/admin/dashboard/bonscommande" icon={<ClipboardList />} label="Bons de commande" />
        <NavItem to="/admin/dashboard/gestion-cuisine" icon={<ChefHat />} label="Cuisine" />
        <NavItem to="/admin/dashboard/ingredients" icon={<Package />} label="Ingrédients" />
        <NavItem to="/admin/dashboard/statistiques" icon={<BarChart3 />} label="Statistiques" />
        <NavItem to="/admin/dashboard/parametres" icon={<Settings />} label="Paramètres" />
        <NavItem to="/admin/dashboard/historique" icon={<ShoppingCart />} label="Historique" />
      </nav>

      {/* Footer admin */}
      <div className="mt-auto pt-4 border-top">
        <div className="d-flex align-items-center gap-2 px-2">
          <UserCircle2 className="text-primary" size={40} />
          <div>
            <div className="fw-semibold small">Admin</div>
            <div className="text-muted small">Admin User</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// Composants utilitaires
const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `nav-link d-flex align-items-center rounded-3 px-3 py-2 gap-2 icon-hover ${
        isActive
          ? 'bg-primary text-white fw-semibold shadow-sm'
          : 'text-dark bg-light-subtle'
      }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

const SubNavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `nav-link px-3 py-1 rounded-2 small ${
        isActive ? 'text-primary fw-semibold bg-primary-subtle' : 'text-muted'
      }`
    }
  >
    {label}
  </NavLink>
);

export default Sidebar;
