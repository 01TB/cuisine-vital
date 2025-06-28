import { Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{ backgroundColor: '#f8f9fa', padding: '20px 0', marginTop: 'auto' }}>
      <Container>
        <Nav className="justify-content-center">
          <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
          <Nav.Link as={Link} to="/about">À propos</Nav.Link>
          <Nav.Link as={Link} to="/blog">Blog</Nav.Link>
        </Nav>
        <p className="text-center mt-2">© 2025 Foodie Restaurant</p>
      </Container>
    </footer>
  );
}

export default Footer;