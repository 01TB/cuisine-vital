import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [loginData, setLoginData] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

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

  const handleSubmit = (e) => {
    e.preventDefault();
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
            name="password"
            className="form-control rounded-pill bg-light"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn w-100 rounded-pill fw-semibold"
          style={{ backgroundColor:'#f0ad4e', color:'white' }}
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;
