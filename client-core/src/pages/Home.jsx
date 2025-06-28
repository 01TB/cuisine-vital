import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <Container className="text-center py-5 home-bg" style={{ minHeight: '80vh' }}>
      <h1 className="display-4 fw-bold text-dark">Bienvenue chez <span style={{ color: '#f4a261' }}>Foodie</span></h1>
      <h2 className="text-muted mb-4">et Profitez de la Nourriture</h2>
      <p className="lead text-muted mb-4">Découvrez une expérience culinaire unique avec nos plats délicieux.</p>
      <div className="position-relative mb-4">
        <img src="/assets/salmon-salad.jpg" alt="Plat du jour" className="img-fluid rounded-circle" style={{ maxWidth: '400px' }} />
        <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-2">Meilleur Plat</span>
      </div>
      <Button variant="warning" as={Link} to="/menus" className="me-2">Voir les Menus</Button>
      <Button variant="outline-warning" as={Link} to="/commandes">Commander</Button>
      <p className="text-muted mt-3">Ouvert : 11:00 - 22:00</p>
    </Container>
  );
}

export default Home;