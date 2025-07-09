import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Make sure this points to your configured axios instance
import { UserAuthContext } from '../context/UserAuthContext';

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('user_token'));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // You might want to verify the token with the backend here
      // For now, we'll assume the token is valid
      // You could decode the token to get user info if it's a JWT
      setIsLoggedIn(true);
      // To keep user info across sessions, you could store it in localStorage as well
      const storedUser = localStorage.getItem('user');
      if(storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else {
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/user-auth/login', { email, password });
      const { access_token, user } = response.data;
      localStorage.setItem('user_token', access_token);
      localStorage.setItem('user', JSON.stringify(user)); // Store user info
      setToken(access_token);
      setUser(user);
      setIsLoggedIn(true);

      // Redirect based on role
      switch (user.roleId) {
        case 1: // admin
        case 2: // chef cuisinier
          navigate('/admin/dashboard/overview');
          break;
        case 3: // livreur
          navigate('/admin/livreur/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      localStorage.removeItem('user_token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
      setToken(null);
      console.error('User login failed:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    navigate('/admin/login');
  };

  return (
    <UserAuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
};


