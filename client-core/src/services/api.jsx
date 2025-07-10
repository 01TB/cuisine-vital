import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // À ajuster selon votre back-end
});

export const getMenus = () => api.get('/menus');
export const getCommandes = () => api.get('/commandes');
export const addCommande = (data) => api.post('/commandes', data);
export const getBonCommande = () => api.get('/bon-commande');
export const submitBonCommande = (data) => api.post('/bon-commande', data);