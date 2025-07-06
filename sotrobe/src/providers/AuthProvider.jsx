import { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import api from '../const/api';

export function AuthProvider({ children })
{
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/client/auth')
            .then((res) => {
                setUser(res.data);
                setToken(token);
            }) 
            .catch(() => {
                localStorage.removeItem('token');
                setUser(null);
                setToken(null);
                navigate('/login');
            });
        } else {
            navigate('/login');
            setUser(null);
            setToken(null);
        }
    }, []);

    async function login(email, motDePasse) {
        try {
            const response = await fetch('http://localhost:3000/client/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    motDePasse: motDePasse
                })
            })
            if(response.ok)
            {
                const { access_token, user } = await response.json();
                localStorage.setItem('token', access_token);
                setUser(user);
                setToken(access_token);
            } else {
                throw Error('Erreur de login');
            }
        } catch (error) {
            console.error("Erreur de login", error);
            throw error;
        }
    }

    async function logout()
    {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        navigate('/login');
    }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}