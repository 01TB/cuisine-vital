import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../const/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState( localStorage.getItem('client'));
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('client');
    const token = localStorage.getItem('token');
    if (token && user) {
        setToken(token);
        setUser(JSON.parse(user));
        setIsLoggedIn(true);
    } else {
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);
    }
  }, [token]);

  const login = async (email, motDePasse) => {
    try {
      const response = await api.post('/auth/login', { email, motDePasse });
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('client', JSON.stringify(user));
      setToken(access_token);
      setUser(user);
      setIsLoggedIn(true);
      navigate('/'); 
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('client');
      setIsLoggedIn(false);
      setUser(null);
      setToken(null);
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('client');
    setToken(null);
    setUser(null);
    navigate('/login');
  };


  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
