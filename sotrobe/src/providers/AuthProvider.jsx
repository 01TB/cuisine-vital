import axios from 'axios';
import publicApi from "../const/publicApi";
import { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

export function AuthProvider({ children })
{
    const [isAuthentified, setIsAuthentified] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/client/auth')
            .then((res) => { 
                setUser(res.data) 
                setIsAuthentified(true);
            })
            .catch(() => {
                localStorage.removeItem('token');
                setUser(null);
                setIsAuthentified(false);
            });
        } else {

        }
    }, []);

    async function login(email, password) {
        try {
            const response = await axios.post(publicApi('login'), { email, password });
            const { access_token, user } = response.data;
            localStorage.setItem('token', access_token);
            setUser(user);
            setIsAuthentified(true);
        } catch (error) {
            console.error("Erreur de login", error);
            setIsAuthentified(false);
            throw error;
        }
    }

    async function logout()
    {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthentified(false);
    }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthentified }}>
      {children}
    </AuthContext.Provider>
  );
}