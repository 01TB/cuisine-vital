import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import { motion } from 'framer-motion';

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <Container className="text-center py-5" style={{ minHeight: '90vh', background: 'linear-gradient(145deg, #fefefe, #e6e6e6)', borderRadius: '2rem', boxShadow: '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff' }}>
        <h1 className="display-3 fw-bold mb-3" style={{ color: '#f4a261', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
          Bienvenue chez <span style={{ color: '#264653' }}>Foodie</span>
        </h1>
        <h4 className="text-muted mb-4">Profitez d'une expérience culinaire raffinée</h4>
        <p className="lead text-secondary mb-5">Savourez nos plats faits maison, préparés avec soin pour égayer vos journées.</p>

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          className="position-relative mb-4"
        >
          <img
            src="/assets/salmon-salad.jpg"
            alt="Plat du jour"
            className="img-fluid rounded-circle shadow"
            style={{ maxWidth: '400px', border: '10px solid white' }}
          />
          <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-3 fs-6 px-3 py-2 shadow">
            ⭐ Plat du Jour
          </span>
        </motion.div>

        <div className="d-flex justify-content-center gap-3 mb-3">
          <Button variant="warning" as={Link} to="/menus" className="px-4 py-2 shadow-sm rounded-pill">
            Voir les Menus
          </Button>
          <Button variant="outline-warning" as={Link} to="/commandes" className="px-4 py-2 shadow-sm rounded-pill">
            Commander
          </Button>
        </div>

        <p className="text-muted mt-4">Heures d'ouverture : <strong>11:00 - 22:00</strong></p>
      </Container>
    </motion.div>
  );
}

export default Home;
