import { Container, Row, Col, Button } from 'react-bootstrap';
import '../styles/Profil.css';

function Profil() {
  const user = {
    nom: 'Sarobidy',
    email: 'sarobidy@example.com',
    telephone: '123-456-7890',
    adresse: '123 Rue Exemple, Antananarivo',
    pointsFidelite: 150,
  };

  return (
    <Container className="mt-4">
      <h2>Profil Utilisateur</h2>
      <Row className="mt-3">
        <Col md={6}>
          <p><strong>Nom :</strong> {user.nom}</p>
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Téléphone :</strong> {user.telephone}</p>
          <p><strong>Adresse :</strong> {user.adresse}</p>
          <p><strong>Points de Fidélité :</strong> {user.pointsFidelite}</p>
        </Col>
        <Col md={6}>
          <Button variant="primary">Modifier Profil</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Profil;