import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Adjust as per your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getEnterpriseClientProfile = async () => {
  try {
    const response = await api.get('/client/enterprise-profile/:clientId'); // :clientId will be replaced by the interceptor or handled by backend
    return response.data;
  } catch (error) {
    console.error('Error fetching enterprise client profile:', error);
    throw error;
  }
};

// You can add other API calls here as needed
