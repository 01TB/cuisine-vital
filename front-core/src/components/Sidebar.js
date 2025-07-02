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
    <aside className="sidebar bg-gray-100 w-64 h-screen p-4 shadow">
      <nav className="space-y-2">

        <NavLink
          to="/admin/dashboard/overview"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded hover:bg-indigo-100 text-sm font-medium ${
              isActive ? 'bg-indigo-200 text-indigo-800 font-semibold' : 'text-gray-700'
            }`
          }
        >
          <ShoppingCart size={18} className="mr-2" />
          Commandes
        </NavLink>

        <NavLink
          to="/admin/dashboard/gestion-menu"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded hover:bg-indigo-100 text-sm font-medium ${
              isActive ? 'bg-indigo-200 text-indigo-800 font-semibold' : 'text-gray-700'
            }`
          }
        >
          <Menu size={18} className="mr-2" />
          Gestion du menu
        </NavLink>

        <div className="ml-6 space-y-1">
          <NavLink
            to="/admin/dashboard/gestion-menu/plats"
            className={({ isActive }) =>
              `block px-3 py-1.5 rounded hover:bg-indigo-50 text-sm ${
                isActive ? 'bg-indigo-100 text-indigo-800 font-medium' : 'text-gray-600'
              }`
            }
          >
            Plats
          </NavLink>
          <NavLink
            to="/admin/dashboard/gestion-menu/categories"
            className={({ isActive }) =>
              `block px-3 py-1.5 rounded hover:bg-indigo-50 text-sm ${
                isActive ? 'bg-indigo-100 text-indigo-800 font-medium' : 'text-gray-600'
              }`
            }
          >
            Catégories
          </NavLink>
          <NavLink
            to="/admin/dashboard/gestion-menu/nouveau-plat"
            className={({ isActive }) =>
              `block px-3 py-1.5 rounded hover:bg-indigo-50 text-sm ${
                isActive ? 'bg-indigo-100 text-indigo-800 font-medium' : 'text-gray-600'
              }`
            }
          >
            Ajouter un nouveau plat
          </NavLink>
          <NavLink
            to="/admin/dashboard/gestion-menu/promotions"
            className={({ isActive }) =>
              `block px-3 py-1.5 rounded hover:bg-indigo-50 text-sm ${
                isActive ? 'bg-indigo-100 text-indigo-800 font-medium' : 'text-gray-600'
              }`
            }
          >
            Promotions
          </NavLink>
        </div>

        <NavLink
          to="/admin/dashboard/gestion-cuisine"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded hover:bg-indigo-100 text-sm font-medium ${
              isActive ? 'bg-indigo-200 text-indigo-800 font-semibold' : 'text-gray-700'
            }`
          }
        >
          <ChefHat size={18} className="mr-2" />
          Gestion de la cuisine
        </NavLink>

        <NavLink
          to="/admin/dashboard/ingredients"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded hover:bg-indigo-100 text-sm font-medium ${
              isActive ? 'bg-indigo-200 text-indigo-800 font-semibold' : 'text-gray-700'
            }`
          }
        >
          <Package size={18} className="mr-2" />
          Ingrédients
        </NavLink>

        <NavLink
          to="/admin/dashboard/statistiques"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded hover:bg-indigo-100 text-sm font-medium ${
              isActive ? 'bg-indigo-200 text-indigo-800 font-semibold' : 'text-gray-700'
            }`
          }
        >
          <BarChart3 size={18} className="mr-2" />
          Statistiques & Analyses
        </NavLink>

        <NavLink
          to="/admin/dashboard/parametres"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded hover:bg-indigo-100 text-sm font-medium ${
              isActive ? 'bg-indigo-200 text-indigo-800 font-semibold' : 'text-gray-700'
            }`
          }
        >
          <Settings size={18} className="mr-2" />
          Paramètres
        </NavLink>
      </nav>

      <div className="mt-auto pt-6">
        <div className="flex items-center gap-3 px-3">
          <img
            src="https://via.placeholder.com/40x40/4f46e5/ffffff?text=TB"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="text-sm font-semibold">Admin</div>
            <div className="text-xs text-gray-500">Admin User</div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-4">
          Made with <span className="text-indigo-500 font-bold">Ysily</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
