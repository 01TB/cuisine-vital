import { NavLink } from 'react-router-dom';
import {
  ShoppingCart,
  BarChart3,
  Menu,
  ChefHat,
  Package,
  Settings,
  Route,
  Calculator
} from 'lucide-react';
import { useUserAuth } from '../hooks/useUserAuth';

const Sidebar = () => {
  const { user, logout } = useUserAuth();

  const roleMap = {
    1: 'admin',
    2: 'chef cuisinier',
    3: 'livreur'
  };

  const currentUserRole = roleMap[user?.roleId];

  const allNavLinks = [
    {
      to: '/admin/dashboard/chef/commandes',
      label: 'Commandes',
      icon: ShoppingCart,
      roles: ['admin', 'chef cuisinier']
    },
    {
      to: '/admin/dashboard/gestion-menu',
      label: 'Gestion du menu',
      icon: Menu,
      roles: ['admin'],
      subLinks: [
        { to: '/admin/dashboard/chef/menus', label: 'Plats', roles: ['admin', 'chef cuisinier'] },
        { to: '/admin/dashboard/gestion-menu/categories', label: 'Catégories', roles: ['admin', 'chef cuisinier'] },
        { to: '/admin/dashboard/gestion-menu/nouveau-plat', label: 'Ajouter un nouveau plat', roles: ['admin', 'chef cuisinier'] },
        { to: '/admin/dashboard/gestion-menu/promotions', label: 'Promotions', roles: ['admin', 'chef cuisinier'] },
      ]
    },
    {
      to: '/admin/dashboard/chef/menus',
      label: 'Menus',
      icon: Menu,
      roles: ['chef cuisinier']
    },
    {
      to: '/admin/dashboard/gestion-cuisine',
      label: 'Gestion de la cuisine',
      icon: ChefHat,
      roles: ['admin']
    },
    {
      to: '/admin/dashboard/ingredients',
      label: 'Ingrédients',
      icon: Package,
      roles: ['admin']
    },
    {
      to: '/admin/dashboard/statistiques',
      label: 'Statistiques & Analyses',
      icon: BarChart3,
      roles: ['admin']
    },
    {
      to: '/admin/dashboard/parametres',
      label: 'Paramètres',
      icon: Settings,
      roles: ['admin']
    },
    {
      to: '/admin/dashboard/historique',
      label: 'Historique des commandes',
      icon: ShoppingCart,
      roles: ['admin']
    },
    {
      to: '/admin/dashboard/gestion-trajets',
      label: 'Gestion des trajets',
      icon: Route,
      roles: ['admin']
    },
    {
      to: '/admin/dashboard/calcul-itineraire', // Nouvelle URL
      label: "Calcul d'itinéraire",
      icon: Calculator,
      roles: ['admin']
    },
  ];

  const filteredNavLinks = allNavLinks.filter(link => link.roles.includes(currentUserRole));

  return (
    <aside className="d-flex flex-column bg-light vh-100 p-3 border-end" style={{ width: '280px' }}>
      <nav className="nav nav-pills flex-column mb-auto">
        {filteredNavLinks.map((link, index) => (
          <div key={index}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center mb-1 ${isActive ? 'active fw-semibold bg-primary text-white' : 'text-dark'
                }`
              }
            >
              <link.icon size={18} className="me-2" />
              {link.label}
            </NavLink>
            {link.subLinks && (
              <div className="ms-4">
                {link.subLinks.filter(subLink => subLink.roles.includes(currentUserRole)).map((subLink, subIndex) => (
                  <NavLink
                    key={subIndex}
                    to={subLink.to}
                    className={({ isActive }) =>
                      `nav-link px-2 py-1 mb-1 ${isActive ? 'bg-secondary bg-opacity-10 text-primary fw-medium' : 'text-muted'
                      }`
                    }
                  >
                    {subLink.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-3 border-top">
        <div className="d-flex align-items-center gap-2 px-2">
          <img
            src="https://via.placeholder.com/40x40/4f46e5/ffffff?text=TB"
            alt="User"
            className="rounded-circle"
            width="40"
            height="40"
          />
          <div>
            <div className="fw-semibold small">{user?.nom} {user?.prenom}</div>
            <div className="text-muted small">{currentUserRole}</div>
          </div>
        </div>
        <div className="px-2">
          <button
            className="btn btn-outline-danger btn-sm w-100"
            onClick={logout}
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;