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
  ClipboardList,
  Route,
  Calculator,
  LogOut
} from 'lucide-react';
import { useUserAuth } from '../hooks/useUserAuth';
import '../styles/sidebar.css';

const roleMap = {
  1: 'ADMIN',
  2: 'CHEF_CUISINIER',
  3: 'livreur',
};

const allNavLinks = [
  {
    to: '/admin/dashboard/overview',
    label: 'Accueil',
    icon: <ShoppingCart />,
    roles: ['ADMIN'],
  },
  {
    label: 'Gestion du menu',
    icon: <Menu />,
    roles: ['ADMIN'],
    subLinks: [
      { to: '/admin/dashboard/gestion-menu/inventaire', label: 'Inventaire', roles: ['ADMIN'] },
      { to: '/admin/dashboard/gestion-menu/suggestions', label: 'Suggestion du chef', roles: ['ADMIN'] },
    ],
  },
  {
    to: '/admin/dashboard/abonnements',
    label: 'Abonnements',
    icon: <Box />,
    roles: ['ADMIN'],
  },
  {
    to: '/admin/dashboard/bonscommande',
    label: 'Bons de commande',
    icon: <ClipboardList />,
    roles: ['ADMIN'],
  },
  {
    to: '/admin/dashboard/gestion-cuisine',
    label: 'Cuisine',
    icon: <ChefHat />,
    roles: ['ADMIN'],
  },
  {
    to: '/admin/dashboard/ingredients',
    label: 'Ingrédients',
    icon: <Package />,
    roles: ['ADMIN'],
  },
  {
    to: '/admin/dashboard/statistiques',
    label: 'Statistiques',
    icon: <BarChart3 />,
    roles: ['ADMIN'],
  },
  {
    to: '/admin/dashboard/parametres',
    label: 'Paramètres',
    icon: <Settings />,
    roles: ['ADMIN'],
  },
  {
    to: '/admin/dashboard/historique',
    label: 'Historique',
    icon: <ShoppingCart />,
    roles: ['ADMIN'],
  },
  {
    to: '/admin/chef/menus',
    label: 'Inventaire de menu',
    icon: <Box />,
    roles: ['CHEF_CUISINIER'],
  },
  {
    to: '/admin/chef/commandes',
    label: 'Commandes',
    icon: <ShoppingCart />,
    roles: ['CHEF_CUISINIER'],
  },
  {
    to: '/admin/dashboard/gestion-trajets',
    label: 'Gestion des trajets',
    icon: <Route />,
    roles: ['ADMIN'],
  },
  {
    to: '/admin/dashboard/calcul-itineraire',
    label: "Calcul d'itinéraire",
    icon: <Calculator />,
    roles: ['ADMIN'],
  },
];

const Sidebar = () => {
  const { user, logout } = useUserAuth();
  const currentUserRole = roleMap[user?.roleId];
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const filteredNavLinks = allNavLinks.filter(link =>
    link.roles.includes(currentUserRole)
  );

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
        {filteredNavLinks.map((link, idx) => {
          if (link.subLinks) {
            return (
              <div key={idx}>
                <button
                  onClick={toggleMenuDropdown}
                  className="btn d-flex align-items-center justify-content-between px-3 py-2 rounded-3 text-start text-dark shadow-sm w-100"
                  type="button"
                >
                  <div className="d-flex align-items-center gap-2">
                    {link.icon}
                    {link.label}
                  </div>
                  {menuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {menuOpen && (
                  <div className="ms-4 ps-2 border-start border-2 border-primary-subtle">
                    {link.subLinks
                      .filter(subLink => subLink.roles.includes(currentUserRole))
                      .map((subLink, subIdx) => (
                        <NavLink
                          key={subIdx}
                          to={subLink.to}
                          className={({ isActive }) =>
                            `nav-link px-3 py-1 rounded-2 small ${
                              isActive
                                ? 'text-primary fw-semibold bg-primary-subtle'
                                : 'text-muted'
                            }`
                          }
                        >
                          {subLink.label}
                        </NavLink>
                      ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <NavLink
              key={idx}
              to={link.to}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center rounded-3 px-3 py-2 gap-2 icon-hover ${
                  isActive
                    ? 'bg-primary text-white fw-semibold shadow-sm'
                    : 'text-dark bg-light-subtle'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer utilisateur */}
      <div className="mt-auto pt-4 border-top px-2 position-relative">
        <div
          className="d-flex align-items-center gap-2 px-2 py-2 rounded-2 hover-bg"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowLogout(prev => !prev)}
        >
          <UserCircle2 className="text-primary" size={40} />
          <div>
            <div className="fw-semibold small">{user?.nom} {user?.prenom}</div>
            <div className="text-muted small">{currentUserRole}</div>
          </div>
        </div>

        {showLogout && (
          <div
            className="position-absolute"
            style={{
              bottom: '70px',
              left: '20px',
              backgroundColor: '#fefefe',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.05)',
              borderRadius: '10px',
              padding: '12px',
              zIndex: 1000,
              width: '220px',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-2 px-2 text-muted small">
              <LogOut size={16} />
              Déconnexion
            </div>
            <button
              className="btn btn-light w-100 border rounded-3"
              onClick={logout}
              style={{
                fontSize: '14px',
                fontWeight: 500,
                backgroundColor: '#f8f9fa',
              }}
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
