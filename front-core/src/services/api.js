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

export default api;
