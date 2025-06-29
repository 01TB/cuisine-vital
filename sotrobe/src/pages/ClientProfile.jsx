import { Container, Row, Col, Button, Image, Form, Nav } from 'react-bootstrap';
import { useState } from 'react';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('commandes');
  const [filterDateMin, setFilterDateMin] = useState('');
  const [filterDateMax, setFilterDateMax] = useState('');
  const [filterAddress, setFilterAddress] = useState('');

  const userImage = null; // Remplacez par une vraie image si disponible

  const renderTabContent = () => {
    switch (activeTab) {
      case 'commandes':
        return <p>Voici vos commandes en cours.</p>;
      case 'historique':
        return (
          <>
            <Row className="mb-4">
              <Col md={4}>
                <Form.Group controlId="filterDateMin">
                  <Form.Label>Date min</Form.Label>
                  <Form.Control type="date" value={filterDateMin} onChange={(e) => setFilterDateMin(e.target.value)} className="rounded-pill" />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="filterDateMax">
                  <Form.Label>Date max</Form.Label>
                  <Form.Control type="date" value={filterDateMax} onChange={(e) => setFilterDateMax(e.target.value)} className="rounded-pill" />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="filterAddress">
                  <Form.Label>Filtrer par adresse</Form.Label>
                  <Form.Control type="text" placeholder="Ex: Antananarivo" value={filterAddress} onChange={(e) => setFilterAddress(e.target.value)} className="rounded-pill" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <h5 className="fw-bold">Historique des commandes</h5>
                <ul className="list-unstyled">
                  <li className="py-3 border-bottom">
                    <strong>Commande du 15/06/2025</strong> - Livrée à Ampefiloha
                  </li>
                  <li className="py-3 border-bottom">
                    <strong>Commande du 10/06/2025</strong> - Livrée à Ankatso
                  </li>
                </ul>
              </Col>
            </Row>
          </>
        );
      case 'favoris':
        return <p>Voici vos menus favoris.</p>;
      default:
        return null;
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col md={3} className="text-center">
          {userImage ? (
            <Image src={userImage} roundedCircle fluid />
          ) : (
            <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{ width: 120, height: 120, backgroundColor:'rgb(0,0,0,0.2)' }}>
              <i className="bi bi-person" style={{ fontSize: '3rem', color: 'white' }}></i>
            </div>
          )}
        </Col>
        <Col md={9} className="d-flex flex-column justify-content-center">
          <h4 className="fw-bold">Jean Dupont</h4>
          <p className="text-muted">jean.dupont@example.com</p>
        </Col>
      </Row>

      <Nav variant="tabs" className="mb-4 border-bottom">
        <Nav.Item>
          <Nav.Link
            onClick={() => setActiveTab('commandes')}
            active={activeTab === 'commandes'}
            className="bg-transparent border-0 fw-semibold"
          >
            Commandes en cours
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => setActiveTab('historique')}
            active={activeTab === 'historique'}
            className="bg-transparent border-0 fw-semibold"
          >
            Historique de commande
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => setActiveTab('favoris')}
            active={activeTab === 'favoris'}
            className="bg-transparent border-0 fw-semibold"
          >
            Menus favoris
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="p-4 rounded-4 shadow-sm" style={{ backgroundColor: '#fff' }}>
        {renderTabContent()}
      </div>
    </Container>
  );
};

export default UserProfile;
