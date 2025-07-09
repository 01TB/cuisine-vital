import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../const/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (token) {
        setToken(token);
        setUser(user);
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
      setToken(access_token);
      setUser(user);
      setIsLoggedIn(true);
      navigate('/'); 
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
      setToken(null);
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
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
