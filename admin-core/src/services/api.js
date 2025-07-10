import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const getAbonnements = () => api.get('/abonnements');
export const addAbonnement = (data) => api.post('/abonnements', data);
export const getStocks = () => api.get('/stocks');
export const validateStock = (id) => api.put(`/stocks/${id}/validate`);
export const getDashboardStats = () => api.get('/dashboard/stats');
export const getPopularDishes = () => api.get('/dashboard/popular-dishes');
export const getKitchenWorkflow = () => api.get('/dashboard/kitchen-workflow');
// Ajoutez d'autres fonctions pour chaque endpoint