import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import foodImg from '../assets/salade.png'

function Header() {
  return (
    <div className="home-bg">
      <div className="text-center">
        <h1 className="display-4 fw-bold text-dark">Bienvenue chez <span style={{ color: '#f4a261' }}>Sotro Be</span></h1>
        <h2 className="text-muted mb-4">Découvrez une expérience culinaire unique avec nos plats délicieux.</h2>
        <p className="lead text-muted mb-4">et profitez de la nourriture </p>
        <div className="position-relative mb-4">
          <img src={foodImg} alt="Plat du jour" className="floating-image img-fluid rounded-circle" style={{ maxWidth: '400px' }} />
        </div>
        <div className="food-items">
          {['Entrées', 'Plats', 'Desserts', 'Boissons'].map((category) => (
            <div key={category} className="food-circle">{category}</div>
          ))}
        </div>
        <Button variant="warning" as={Link} to="/menus" className="me-2">Voir les Menus</Button>
        <Button variant="outline-warning" as={Link} to="/commandes">Commander</Button>
        <p className="text-muted mt-3">Ouvert : 11:00 - 22:00</p>
      </div>
    </div>
  );
}

export default Header;
