import { Container, Row, Col, Button } from "react-bootstrap";

const FooterSection = () => {
  return (
    <Container
      fluid
      className="py-5 text-white"
      style={{ backgroundColor: "#1c1c1c" }}
    >
      <Row className="justify-content-center mb-4">
        <Col xs="auto">
          <h5 className="fw-bold text-center mb-3">Rejoignez-nous</h5>
          <Button variant="light" className="rounded-pill px-4 fw-bold">
            Se connecter
          </Button>
        </Col>
      </Row>

      <Row className="text-center text-muted small">
        <Col md={4} className="mb-2">
          <p>© {new Date().getFullYear()} Sotro be</p>
        </Col>
        <Col md={4} className="mb-2">
          <a href="#privacy" className="text-muted text-decoration-none">
            Politique de confidentialité
          </a>
          {" · "}
          <a href="#terms" className="text-muted text-decoration-none">
            Conditions d'utilisation
          </a>
        </Col>
        <Col md={4} className="mb-2">
          <a href="#facebook" className="text-muted me-2">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="#instagram" className="text-muted me-2">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="#twitter" className="text-muted">
            <i className="bi bi-twitter"></i>
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export default FooterSection;
