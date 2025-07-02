import { useState } from 'react';
import { Tab, Nav, Button, Row, Col, Image, ListGroup } from 'react-bootstrap';
import '../styles/CommandePopup.css'

const CommandePopup = ({ show, onClose, selectedMenus }) => {
  const [activeTab, setActiveTab] = useState('boissons');
  const [selectedExtras, setSelectedExtras] = useState({ boissons: [], accompagnements: [] });
  const [previewImage, setPreviewImage] = useState(null);

  const boissons = [
    { id: 1, name: 'Coca-Cola', image: 'https://via.placeholder.com/200', price: 3000 },
    { id: 2, name: 'Eau minérale', image: 'https://via.placeholder.com/200', price: 1500 },
  ];

  const accompagnements = [
    { id: 1, name: 'Riz nature', image: 'https://via.placeholder.com/200', price: 2000 },
    { id: 2, name: 'Salade fraîche', image: 'https://via.placeholder.com/200', price: 2500 },
  ];

  const handleRemoveMenu = (id) => {
    // à implémenter si nécessaire
  };

  const handleAddExtra = (type, item) => {
    setSelectedExtras((prev) => ({
      ...prev,
      [type]: [...prev[type], item],
    }));
    setPreviewImage(item.image);
  };

  const handleConfirm = () => {
    const commandeFinale = {
      plats: selectedMenus,
      boissons: selectedExtras.boissons,
      accompagnements: selectedExtras.accompagnements,
    };
    console.log("Commande envoyée:", commandeFinale);
    onClose();
  };

  const extraList = activeTab === 'boissons' ? boissons : accompagnements;
  if (!show) return null;

  return (
    <>
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
        onClick={onClose}
      ></div>

      <div
        className="position-fixed bottom-0 start-0 w-100 fade-in-up"
        style={{
          height: '90vh',
          backgroundColor: 'rgb(255, 255, 255, 0.8',
          borderTopLeftRadius: '2rem',
          borderTopRightRadius: '2rem',
          zIndex: 1055,
          overflowY: 'auto',
          boxShadow: '0 -5px 15px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)' 

        }}
      >
        <div className="p-4">
          <Row>
            <Col md={4}>
              <h5 className="fw-bold mb-3">🧾 Vos Plats</h5>
              <ListGroup variant="flush">
                {selectedMenus.map((menu) => (
                  <ListGroup.Item
                    key={menu.id}
                    className="d-flex align-items-center justify-content-between border-0 p-2 bg-light rounded-4 mb-2"
                  >
                    <Image
                      src={menu.image}
                      rounded
                      className='rounded-5'
                      style={{
                        width: 55,
                        height: 55,
                        objectFit: 'cover',
                      }}
                    />
                    <div className="ms-2 flex-grow-1">
                      <strong>{menu.title}</strong>
                      <div className="text-muted small">Ar 15 000</div>
                    </div>
                    <Button
                      size="sm"
                      className="deleteBtn rounded-circle"
                      onClick={() => handleRemoveMenu(menu.id)}
                    >
                      <i className="bi bi-x-lg"></i>
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>

            <Col md={8}>
              <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav className="mb-4 gap-2">
                  <Nav.Item>
                    <Nav.Link
                      eventKey="boissons"
                      className={`commande-tab ${activeTab === 'boissons' ? 'active-tab' : ''}`}
                    >
                      🥤 Boissons
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="accompagnements"
                      className={`commande-tab ${activeTab === 'accompagnements' ? 'active-tab' : ''}`}
                    >
                      🍚 Accompagnements
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content className='p-5' style={{ backgroundColor: 'rgb(255, 255, 255, 0.6)', transform:'translateY(-25px)', borderRadius:'30px', borderTopLeftRadius:'0px' }}>
                  <Tab.Pane eventKey={activeTab}>
                    {previewImage && (
                      <div className="text-center mb-4">
                        <Image
                          src={previewImage}
                          rounded
                          style={{ height: 180, objectFit: 'cover', borderRadius: '1.5rem' }}
                        />
                      </div>
                    )}

                    <Row>
                      {extraList.map((item) => (
                        <Col md={4} key={item.id} className="mb-4">
                          <div className="border rounded-4 p-3 text-center h-100 shadow-sm bg-light d-flex flex-column justify-content-between transition-all hover-scale">
                            <Image
                              src={item.image}
                              style={{
                                height: 100,
                                objectFit: 'cover',
                                borderRadius: '1rem'
                              }}
                            />
                            <div className="mt-2 fw-bold">{item.name}</div>
                            <div className="text-muted small mb-2">Ar {item.price.toLocaleString()}</div>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="rounded-pill"
                              onClick={() => handleAddExtra(activeTab, item)}
                            >
                              + Ajouter
                            </Button>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-4">
            <Button
              onClick={handleConfirm}
              className="rounded-pill px-4 py-2 fw-bold"
              style={{ backgroundColor: '#4CAF50', border: 'none' }}
            >
              <i className="bi bi-check-circle me-2"></i>
              Valider la commande
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommandePopup;
