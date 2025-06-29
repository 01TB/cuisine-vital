import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Notez l'extension .jsx

// Importations cruciales pour les styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css' // Votre CSS personnalisé

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)