import { useState } from 'react';
import { Modal, Tab, Nav, Button, Row, Col, Image, ListGroup } from 'react-bootstrap';

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
    // Notify parent if needed
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
      {/* Overlay */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
        onClick={onClose}
      ></div>

      {/* Popup */}
      <div className="position-fixed bottom-0 start-0 w-100" style={{ height: '90vh', backgroundColor: 'white', borderTopLeftRadius: '2.5rem', borderTopRightRadius: '2.5rem', zIndex: 1055, overflowY: 'auto' }}>
        <div className="p-4">
          <Row>
            <Col md={4}>
              <h5 className="fw-bold mb-3">Vos Plats</h5>
              <ListGroup variant="flush">
                {selectedMenus.map((menu) => (
                  <ListGroup.Item key={menu.id} className="d-flex align-items-center justify-content-between border-0">
                    <Image src={menu.image} rounded style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '1.2rem' }} />
                    <div className="ms-2 flex-grow-1">
                      <strong>{menu.title}</strong>
                      <div className="text-muted">Ar 15,000</div>
                    </div>
                    <Button variant="outline-danger" size="sm" className="rounded-pill" onClick={() => handleRemoveMenu(menu.id)}>
                      <i className="bi bi-x"></i>
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>

            <Col md={8}>
              <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav variant="tabs" className="mb-3 rounded-pill overflow-hidden">
                  <Nav.Item>
                    <Nav.Link eventKey="boissons" className="rounded-pill">Boissons</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="accompagnements" className="rounded-pill">Accompagnements</Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane eventKey={activeTab}>
                    {previewImage && (
                      <div className="text-center mb-3">
                        <Image src={previewImage} rounded style={{ height: 200, objectFit: 'cover', borderRadius: '1.5rem' }} />
                      </div>
                    )}

                    <Row>
                      {extraList.map((item) => (
                        <Col md={4} key={item.id} className="mb-3">
                          <div className="border rounded-4 p-3 text-center h-100 d-flex flex-column justify-content-between">
                            <Image src={item.image} style={{ height: 100, objectFit: 'cover', borderRadius: '1.2rem' }} />
                            <div className="mt-2 fw-bold">{item.name}</div>
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="rounded-pill"
                              onClick={() => handleAddExtra(activeTab, item)}
                            >
                              Ajouter
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
            <Button onClick={handleConfirm} className="rounded-pill px-4" style={{ backgroundColor: '#2C5530', border: 'none' }}>
              <i className="bi bi-check-circle me-2"></i>
              Effectuer la commande
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommandePopup;
