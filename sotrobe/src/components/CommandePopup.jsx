import { useState, useEffect } from 'react';
import { Tab, Nav, Button, Row, Col, Image, ListGroup, Form } from 'react-bootstrap';
import '../styles/CommandePopup.css'
import publicApi from '../const/publicApi';
import api from '../const/api'; // Non utilisé dans ce snippet, mais important si tu l'utilises ailleurs
import LocalisationPopup from './LocalisationPopup';
import { createOrder } from '../services/clientService';

const CommandePopup = ({ show, onClose, selectedMenus, onMenuQuantityChange }) => {
  const [activeTab, setActiveTab] = useState('boissons');
  const [selectedExtras, setSelectedExtras] = useState({ boissons: [], accompagnements: [] });
  const [previewImage, setPreviewImage] = useState(null);
  const [boissons, setBoissons] = useState([]);
  const [accompagnements, setAccompagnements] = useState([]);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const [boissonsRes, accompagnementsRes] = await Promise.all([
          publicApi.get('/client/boissons'),
          publicApi.get('/client/accompagnements'),
        ]);
        setBoissons(boissonsRes.data);
        setAccompagnements(accompagnementsRes.data);
      } catch (error) {
        console.error('Error fetching extras:', error);
      }
    };

    if (show) {
      fetchExtras();
    }
  }, [show]);

  const handleRemoveMenu = (id) => {
    onMenuQuantityChange(id, 0); // Set quantity to 0 to remove from selectedMenus in parent
  };

  const handleAddExtra = (type, item) => {
    setSelectedExtras((prev) => {
      const existingItemIndex = prev[type].findIndex((extra) => extra.id === item.id);
      if (existingItemIndex > -1) {
        const updatedExtras = [...prev[type]];
        updatedExtras[existingItemIndex] = {
          ...updatedExtras[existingItemIndex],
          quantity: updatedExtras[existingItemIndex].quantity + 1,
        };
        return { ...prev, [type]: updatedExtras };
      } else {
        return { ...prev, [type]: [...prev[type], { ...item, quantity: 1 }] };
      }
    });
    setPreviewImage(item.image || item.photoUrl);
  };

  const handleExtraQuantityChange = (type, id, newQuantity) => {
    setSelectedExtras((prev) => ({
      ...prev,
      [type]: prev[type]
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
        )
        .filter((item) => item.quantity > 0),
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    selectedMenus.forEach((menu) => {
      total += parseFloat(menu.prixCarte) * menu.quantity;
    });
    selectedExtras.boissons.forEach((boisson) => {
      total += parseFloat(boisson.prix) * boisson.quantity;
    });
    selectedExtras.accompagnements.forEach((accompagnement) => {
      total += parseFloat(accompagnement.prixUnitaire) * accompagnement.quantity;
    });
    return total.toLocaleString();
  };

  const handleOpenLocationPopup = () => {
    setShowLocationPopup(true);
  };

  const handleLocationSelected = (position, address) => {
    setDeliveryLocation(position);
    setDeliveryAddress(address);
    setShowLocationPopup(false); // Close location popup first
    handleConfirmOrder(position, address); // Then confirm the order
  };

  const handleConfirmOrder = async (location, address) => {
    const commandeDetails = [];

    selectedMenus.forEach((menu) => {
      commandeDetails.push({
        menuId: menu.id,
        quantite: menu.quantity,
        prixUnitaire: parseFloat(menu.prixCarte),
        notes: '',
      });
    });

    selectedExtras.boissons.forEach((boisson) => {
      commandeDetails.push({
        boissonId: boisson.id,
        quantite: boisson.quantity,
        prixUnitaire: parseFloat(boisson.prix),
        notes: '',
      });
    });

    selectedExtras.accompagnements.forEach((accompagnement) => {
      commandeDetails.push({
        accompagnementId: accompagnement.id,
        quantite: accompagnement.quantity,
        prixUnitaire: parseFloat(accompagnement.prixUnitaire),
        notes: '',
      });
    });

    const commandeData = {
      numeroCommande: `CMD-${Date.now()}`,
      clientId: '', // This will be set by the backend from the token
      statutId: 1, // Assuming 1 is the initial status for a new order
      dateCommande: new Date().toISOString(),
      dateLivraison: new Date().toISOString().split('T')[0], // Example: today's date
      adresseLivraison: address, 
      montantTotal: parseFloat(calculateTotal().replace(/ /g, '')),
      details: commandeDetails,
      zoneDeLivraison: location ? { type: 'Point', coordinates: [location.lng, location.lat] } : null,
    };

    try {
      const response = await createOrder(commandeData);
      console.log('Commande créée avec succès:', response);
      onClose(); // Close CommandePopup after successful order
      alert('Commande créée avec succès!');
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error.response ? error.response.data : error.message);
      alert('Erreur lors de la création de la commande.');
    }
  };

  const extraList = activeTab === 'boissons' ? boissons : accompagnements;
  if (!show) return null;

  return (
    <>
      {/* Fond sombre personnalisé pour CommandePopup.
        Z-index ajusté à 1045 pour être en dessous de la modale react-bootstrap (1050+).
      */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1045 }}
        onClick={onClose}
      ></div>

      {/* Contenu principal de CommandePopup.
        Z-index ajusté à 1046 pour être au-dessus de son propre fond,
        mais en dessous du contenu de la modale react-bootstrap (1055).
      */}
      <div
        className="position-fixed bottom-0 start-0 w-100 fade-in-up"
        style={{
          height: '90vh',
          backgroundColor: 'rgb(255, 255, 255, 0.8)',
          borderTopLeftRadius: '2rem',
          borderTopRightRadius: '2rem',
          zIndex: 1046, // Ajusté pour être en dessous de LocalisationPopup
          overflowY: 'auto',
          boxShadow: '0 -5px 15px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)' 
        }}
      >
        <div className="p-4">
          <Row>
            <Col md={6}>
              <h5 className="fw-bold mb-3">🧾 Vos Plats</h5>
              <ListGroup variant="flush">
                {selectedMenus.map((menu) => (
                  <ListGroup.Item
                    key={menu.id}
                    className="d-flex align-items-center justify-content-between border-0 p-2 bg-light rounded-4 mb-2"
                  >
                    <Image
                      src={menu.photoUrl}
                      rounded
                      className='rounded-5'
                      style={{
                        width: 55,
                        height: 55,
                        objectFit: 'cover',
                      }}
                    />
                    <div className="ms-2 flex-grow-1">
                      <strong>{menu.nom}</strong>
                      <div className="text-muted small">Ar {parseFloat(menu.prixCarte).toLocaleString()}</div>
                    </div>
                    <Form.Control
                      type="number"
                      min="1"
                      value={menu.quantity}
                      onChange={(e) => onMenuQuantityChange(menu.id, parseInt(e.target.value))}
                      style={{ width: '70px', marginRight: '10px' }}
                    />
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

              <h5 className="fw-bold mt-4 mb-3">🛒 Résumé de la Commande</h5>
              <ListGroup variant="flush">
                {selectedMenus.map((menu) => (
                  <ListGroup.Item key={`summary-menu-${menu.id}`} className="d-flex justify-content-between align-items-center border-0 p-1">
                    <span>{menu.nom} x {menu.quantity}</span>
                    <span>Ar {(parseFloat(menu.prixCarte) * menu.quantity).toLocaleString()}</span>
                  </ListGroup.Item>
                ))}
                {selectedExtras.boissons.map((boisson) => (
                  <ListGroup.Item key={`summary-boisson-${boisson.id}`} className="d-flex justify-content-between align-items-center border-0 p-1">
                    <span>{boisson.nom} x {boisson.quantity}</span>
                    <span>Ar {(parseFloat(boisson.prix) * boisson.quantity).toLocaleString()}</span>
                  </ListGroup.Item>
                ))}
                {selectedExtras.accompagnements.map((accompagnement) => (
                  <ListGroup.Item key={`summary-acc-${accompagnement.id}`} className="d-flex justify-content-between align-items-center border-0 p-1">
                    <span>{accompagnement.nom} x {accompagnement.quantity}</span>
                    <span>Ar {(parseFloat(accompagnement.prixUnitaire) * accompagnement.quantity).toLocaleString()}</span>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item className="d-flex justify-content-between align-items-center border-0 p-1 fw-bold">
                  <span>Total:</span>
                  <span>Ar {calculateTotal()}</span>
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={6}>
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
                              src={item.image || item.photoUrl}
                              style={{
                                height: 100,
                                objectFit: 'cover',
                                borderRadius: '1rem'
                              }}
                            />
                            <div className="mt-2 fw-bold">{item.nom}</div>
                            <div className="text-muted small mb-2">Ar {item.prix ? parseFloat(item.prix).toLocaleString() : (item.prixUnitaire ? parseFloat(item.prixUnitaire).toLocaleString() : "Prix non disponible pour l'instant")}</div>
                            <div className="d-flex justify-content-center align-items-center">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleExtraQuantityChange(activeTab, item.id, (selectedExtras[activeTab].find(e => e.id === item.id)?.quantity || 0) - 1)}
                              >
                                -
                              </Button>
                              <Form.Control
                                type="number"
                                min="0"
                                value={selectedExtras[activeTab].find(e => e.id === item.id)?.quantity || 0}
                                onChange={(e) => handleExtraQuantityChange(activeTab, item.id, parseInt(e.target.value))}
                                style={{ width: '60px', margin: '0 5px', textAlign: 'center' }}
                              />
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleAddExtra(activeTab, item)}
                              >
                                +
                              </Button>
                            </div>
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
              onClick={handleOpenLocationPopup}
              className="rounded-pill px-4 py-2 fw-bold"
              style={{ backgroundColor: '#4CAF50', border: 'none' }}
            >
              <i className="bi bi-check-circle me-2"></i>
              Valider la commande
            </Button>
          </div>
        </div>
      </div>
      
      {/* LocalisationPopup (qui est une modale react-bootstrap) */}
      <LocalisationPopup
        show={showLocationPopup}
        handleClose={() => setShowLocationPopup(false)}
        onSelectLocation={handleLocationSelected}
      />
    </>
  );
}

export default CommandePopup;