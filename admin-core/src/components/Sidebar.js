import { NavLink } from 'react-router-dom';
import {
  ShoppingCart,
  BarChart3,
  Menu,
  ChefHat,
  Package,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="d-flex flex-column bg-light vh-100 p-3 border-end" style={{ width: '250px' }}>
      <nav className="nav nav-pills flex-column mb-auto">
        <NavLink
          to="/admin/dashboard/overview"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center mb-1 ${
              isActive ? 'active fw-semibold bg-primary text-white' : 'text-dark'
            }`
          }
        >
          <ShoppingCart size={18} className="me-2" />
          Commandes
        </NavLink>

        <NavLink
          to="/admin/dashboard/gestion-menu"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center mb-1 ${
              isActive ? 'active fw-semibold bg-primary text-white' : 'text-dark'
            }`
          }
        >
          <Menu size={18} className="me-2" />
          Gestion du menu
        </NavLink>

        <div className="ms-4">
          <NavLink
            to="/admin/dashboard/gestion-menu/plats"
            className={({ isActive }) =>
              `nav-link px-2 py-1 mb-1 ${
                isActive ? 'bg-secondary bg-opacity-10 text-primary fw-medium' : 'text-muted'
              }`
            }
          >
            Plats
          </NavLink>
          <NavLink
            to="/admin/dashboard/gestion-menu/categories"
            className={({ isActive }) =>
              `nav-link px-2 py-1 mb-1 ${
                isActive ? 'bg-secondary bg-opacity-10 text-primary fw-medium' : 'text-muted'
              }`
            }
          >
            Catégories
          </NavLink>
          <NavLink
            to="/admin/dashboard/gestion-menu/nouveau-plat"
            className={({ isActive }) =>
              `nav-link px-2 py-1 mb-1 ${
                isActive ? 'bg-secondary bg-opacity-10 text-primary fw-medium' : 'text-muted'
              }`
            }
          >
            Ajouter un nouveau plat
          </NavLink>
          <NavLink
            to="/admin/dashboard/gestion-menu/promotions"
            className={({ isActive }) =>
              `nav-link px-2 py-1 mb-1 ${
                isActive ? 'bg-secondary bg-opacity-10 text-primary fw-medium' : 'text-muted'
              }`
            }
          >
            Promotions
          </NavLink>
        </div>

        <NavLink
          to="/admin/dashboard/gestion-cuisine"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center mb-1 ${
              isActive ? 'active fw-semibold bg-primary text-white' : 'text-dark'
            }`
          }
        >
          <ChefHat size={18} className="me-2" />
          Gestion de la cuisine
        </NavLink>

        <NavLink
          to="/admin/dashboard/ingredients"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center mb-1 ${
              isActive ? 'active fw-semibold bg-primary text-white' : 'text-dark'
            }`
          }
        >
          <Package size={18} className="me-2" />
          Ingrédients
        </NavLink>

        <NavLink
          to="/admin/dashboard/statistiques"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center mb-1 ${
              isActive ? 'active fw-semibold bg-primary text-white' : 'text-dark'
            }`
          }
        >
          <BarChart3 size={18} className="me-2" />
          Statistiques & Analyses
        </NavLink>

        <NavLink
          to="/admin/dashboard/parametres"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center mb-1 ${
              isActive ? 'active fw-semibold bg-primary text-white' : 'text-dark'
            }`
          }
        >
          <Settings size={18} className="me-2" />
          Paramètres
        </NavLink>

        <NavLink
          to="/admin/dashboard/historique"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center mb-1 ${
              isActive ? 'active fw-semibold bg-primary text-white' : 'text-dark'
            }`
          }
        >
          <ShoppingCart size={18} className="me-2" />
          Historique des commandes
        </NavLink>
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
            <div className="fw-semibold small">Admin</div>
            <div className="text-muted small">Admin User</div>
          </div>
        </div>
        <div className="text-center text-muted small mt-3">
          Made with <span className="text-primary fw-bold">Ysily</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
