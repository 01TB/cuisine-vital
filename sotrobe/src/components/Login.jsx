import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube } from "@fortawesome/free-solid-svg-icons";
import publicApi from '../const/publicApi';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom'; 

const Login = () => {
  const [loginData, setLoginData] = useState(null);
  const [formData, setFormData] = useState({ email: "", motDePasse: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = () => {
  };

  const handleError = () => {
    alert("Identifiants incorrects");
  };

  const isDataOk = (data) => {
    return data.status === 1 || data.user != null;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.motDePasse);
      navigate('/home'); 
    } catch (error) {
      alert(error); 
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 p-md-5 rounded-4 shadow w-100"
        style={{ maxWidth: "400px" }}
      >
        <div className="d-flex align-items-center justify-content-center mb-4">
          <h2 className="fw-bold mb-0">Sotro be</h2>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-semibold text-muted">
            Adresse e-mail
          </label>
          <input
            type="email"
            name="email"
            className="form-control rounded-pill bg-light"
            placeholder="Entrez votre email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="form-label fw-semibold text-muted">
            Mot de passe
          </label>
          <input
            type="password"
            name="motDePasse" 
            className="form-control rounded-pill bg-light"
            placeholder="Mot de passe"
            value={formData.motDePasse}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn w-100 rounded-pill fw-semibold mb-3" 
          style={{ backgroundColor:'#f0ad4e', color:'white' }}
        >
          Se connecter
        </button>

        <div className="text-center">
          <p className="mb-0 text-muted">
            Pas encore de compte ?{" "}
            <Link to="/signup" className="fw-semibold" style={{ color: '#f0ad4e' }}> 
              S'inscrire ici
            </Link>
          </p>
        </div>

      </form>
    </div>
  );
};

export default Login;