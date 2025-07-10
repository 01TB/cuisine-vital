import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Menus.css';

function Menus() {
  const menus = [
    { id: 1, nom: 'Salade de Saumon', prix: 12, image: '/assets/salmon-salad.jpg' },
    { id: 2, nom: 'Pizza Margherita', prix: 10, image: '/assets/pizza.jpg' },
  ];

  return (
    <Container className="mt-4">
      <h2>Menus Disponibles</h2>
      <Row>
        {menus.map(menu => (
          <Col md={4} key={menu.id} className="mb-4">
            <Card>
              <Card.Img variant="top" src={menu.image} alt={menu.nom} />
              <Card.Body>
                <Card.Title>{menu.nom}</Card.Title>
                <Card.Text>${menu.prix}</Card.Text>
                <Button variant="warning" as={Link} to={`/commandes?menu=${menu.id}`}>Commander</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Menus;