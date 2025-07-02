import axios from 'axios';
import publicApi from "../const/publicApi";
import { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

export function AuthProvider({ children })
{
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/users/me')
            .then(res => setUser(res.data))
            .catch(() => {
                localStorage.removeItem('token');
                setUser(null);
            });
        }
    }, []);

    async function login(email, password) {
        try {
            const response = await axios.post(publicApi('login'), { email, password });
            const { access_token, user } = response.data;
            localStorage.setItem('token', access_token);
            setUser(user);
        } catch (error) {
            console.error("Erreur de login", error);
            throw error;
        }
    }

    async function logout()
    {
        localStorage.removeItem('token');
        setUser(null);
    }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}