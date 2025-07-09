import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Changed to root
});

// Add a request interceptor to include the token for user authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_token'); // Using 'user_token' for separation
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// You can still export your specific functions
export const getAbonnements = () => api.get('/api/abonnements');
export const addAbonnement = (data) => api.post('/api/abonnements', data);
export const getStocks = () => api.get('/api/stocks');
export const validateStock = (id) => api.put(`/api/stocks/${id}/validate`);
export const getDashboardStats = () => api.get('/admin/stats');
export const getPopularDishes = () => api.get('/dashboard/popular-dishes');
export const getKitchenWorkflow = () => api.get('/dashboard/kitchen-workflow');

/**
 * Récupère la liste de base de tous les ingrédients.
 * Utile pour les menus déroulants.
 */
export const getAllIngredients = async () => {
  try {
    const response = await api.get('/admin/ingredients');
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des ingrédients:", error);
    throw error;
  }
};

/**
 * Récupère l'état actuel de tous les stocks.
 */
export const getStockOverview = async () => {
  try {
    const response = await api.get('/admin/stock');
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'état du stock:", error);
    throw error;
  }
};

/**
 * Ajoute une nouvelle entrée de stock.
 * @param {object} stockData - Les données de la nouvelle entrée.
 */
export const addStockEntry = async (stockData) => {
  try {
    const response = await api.post('/admin/stock/entry', stockData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'entrée de stock:", error);
    throw error;
  }
};

/**
 * Récupère l'historique des mouvements pour un ingrédient spécifique.
 * @param {number} ingredientId - L'ID de l'ingrédient.
 */
export const getStockHistory = async (ingredientId) => {
  if (!ingredientId) return [];
  try {
    const response = await api.get(`/admin/stock/${ingredientId}/history`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'historique pour l'ingrédient ${ingredientId}:`, error);
    throw error;
  }
};

/**
 * Consomme une certaine quantité d'un ingrédient.
 * @param {object} useData - Les données de la consommation.
 */
export const utiliserStock = async (useData) => {
    try {
        const response = await api.post('/admin/stock/use', useData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la consommation de stock:", error);
        throw error;
    }
};



export default api;
