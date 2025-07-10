import { Container, Row, Col, Button, Image, Form, Nav, Badge, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getClientOrders, cancelOrder, getHistoricalOrders } from '../services/clientService';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('commandes');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorOrders, setErrorOrders] = useState(null);
  const [historicalOrders, setHistoricalOrders] = useState([]);
  const [loadingHistoricalOrders, setLoadingHistoricalOrders] = useState(false);
  const [errorHistoricalOrders, setErrorHistoricalOrders] = useState(null);

  const handleCancelOrder = async (orderId, isIndividualClient) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      try {
        await cancelOrder(orderId, isIndividualClient);
        alert('Commande annulée avec succès !');
        // Refresh current orders after cancellation
        const fetchedOrders = await getClientOrders(true, 6); 
        setOrders(fetchedOrders);
      } catch (error) {
        alert('Erreur lors de l\'annulation de la commande.');
        console.error('Error cancelling order:', error);
      }
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === 'commandes') {
        setLoadingOrders(true);
        setErrorOrders(null);
        try {
          // Assuming isIndividualClient is true for now, adjust as needed
          const fetchedOrders = await getClientOrders(true, 6); 
          setOrders(fetchedOrders);
        } catch (error) {
          setErrorOrders('Erreur lors du chargement des commandes.');
          console.error(error);
        } finally {
          setLoadingOrders(false);
        }
      }
    };

    const fetchHistoricalOrders = async () => {
      if (activeTab === 'historique') {
        setLoadingHistoricalOrders(true);
        setErrorHistoricalOrders(null);
        try {
          // Assuming isIndividualClient is true for now, adjust as needed
          const fetchedHistoricalOrders = await getHistoricalOrders(true, 6); // 6 for LIVREE status
          setHistoricalOrders(fetchedHistoricalOrders);
        } catch (error) {
          setErrorHistoricalOrders('Erreur lors du chargement de l\'historique des commandes.');
          console.error(error);
        } finally {
          setLoadingHistoricalOrders(false);
        }
      }
    };

    fetchOrders();
    fetchHistoricalOrders();
  }, [activeTab]);
  
  const [filterDateMin, setFilterDateMin] = useState('');
  const [filterDateMax, setFilterDateMax] = useState('');
  const [filterAddress, setFilterAddress] = useState('');

  const userImage = null; // Remplacez par une vraie image si disponible

  // Fonction pour obtenir le style du badge selon le statut
  const getStatusBadge = (statut) => {
    const statusName = statut ? statut.nom : 'N/A';
    switch (statusName.toLowerCase()) {
      case 'en_attente':
      case 'en attente':
        return <Badge style={{ backgroundColor: '#ff9500', color: 'white' }} className="px-3 py-2">{statusName}</Badge>;
      case 'en_cours':
      case 'en cours':
        return <Badge style={{ backgroundColor: '#6c5ce7', color: 'white' }} className="px-3 py-2">{statusName}</Badge>;
      case 'livree':
      case 'livrée':
        return <Badge style={{ backgroundColor: '#00b894', color: 'white' }} className="px-3 py-2">{statusName}</Badge>;
      case 'annulee':
      case 'annulée':
        return <Badge style={{ backgroundColor: '#e17055', color: 'white' }} className="px-3 py-2">{statusName}</Badge>;
      default:
        return <Badge style={{ backgroundColor: '#636e72', color: 'white' }} className="px-3 py-2">{statusName}</Badge>;
    }
  };

  // Fonction pour filtrer les commandes historiques
  const getFilteredHistoricalOrders = () => {
    return historicalOrders.filter(order => {
      const orderDate = new Date(order.dateCommande);
      const minDate = filterDateMin ? new Date(filterDateMin) : null;
      const maxDate = filterDateMax ? new Date(filterDateMax) : null;
      
      const dateMatch = (!minDate || orderDate >= minDate) && (!maxDate || orderDate <= maxDate);
      const addressMatch = !filterAddress || order.adresseLivraison.toLowerCase().includes(filterAddress.toLowerCase());
      
      return dateMatch && addressMatch;
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'commandes':
        return (
          <>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h5 className="fw-bold mb-0">Commandes en cours</h5>
              <Badge style={{ backgroundColor: '#6c5ce7', color: 'white' }} className="px-3 py-2">{orders.length} commande(s)</Badge>
            </div>
            {loadingOrders ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3 text-muted">Chargement des commandes...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="table-responsive">
                <div className="custom-table">
                  {orders.map((order, index) => (
                    <Card key={order.id} className="mb-3 border-0 shadow-sm">
                      <Card.Body className="p-4">
                        <Row className="align-items-center">
                          <Col md={2} className="text-center">
                            <div className="order-number">
                              <small className="text-muted d-block">N° Commande</small>
                              <span className="fw-bold" style={{ color: '#6c5ce7' }}>{order.numeroCommande}</span>
                            </div>
                          </Col>
                          <Col md={2}>
                            <small className="text-muted d-block">Date</small>
                            <span className="fw-semibold">{new Date(order.dateCommande).toLocaleDateString('fr-FR')}</span>
                          </Col>
                          <Col md={3}>
                            <small className="text-muted d-block">Adresse</small>
                            <span className="fw-semibold">{order.adresseLivraison}</span>
                          </Col>
                          <Col md={2}>
                            <small className="text-muted d-block">Montant</small>
                            <span className="fw-bold" style={{ color: '#00b894' }}>{order.montantTotal.toLocaleString()} Ar</span>
                          </Col>
                          <Col md={2}>
                            <small className="text-muted d-block">Statut</small>
                            {getStatusBadge(order.statut)}
                          </Col>
                          <Col md={1} className="text-end">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleCancelOrder(order.id, true)}
                              className="rounded-pill px-3"
                              style={{ 
                                borderColor: '#e17055', 
                                color: '#e17055',
                                backgroundColor: 'transparent'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#e17055';
                                e.target.style.color = 'white';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#e17055';
                              }}
                            >
                              <i className="bi bi-x-circle me-1"></i>
                              Annuler
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-cart-x" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                <h6 className="mt-3 text-muted">Aucune commande en cours</h6>
                <p className="text-muted">Vos commandes actuelles apparaîtront ici.</p>
              </div>
            )}
          </>
        );
      case 'historique':
        const filteredOrders = getFilteredHistoricalOrders();
        return (
          <>
            <Row className="mb-4">
              <Col md={4}>
                <Form.Group controlId="filterDateMin">
                  <Form.Label className="fw-semibold">Date min</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={filterDateMin} 
                    onChange={(e) => setFilterDateMin(e.target.value)} 
                    className="rounded-pill border-2" 
                    style={{ borderColor: '#e9ecef' }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="filterDateMax">
                  <Form.Label className="fw-semibold">Date max</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={filterDateMax} 
                    onChange={(e) => setFilterDateMax(e.target.value)} 
                    className="rounded-pill border-2" 
                    style={{ borderColor: '#e9ecef' }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="filterAddress">
                  <Form.Label className="fw-semibold">Filtrer par adresse</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Ex: Antananarivo" 
                    value={filterAddress} 
                    onChange={(e) => setFilterAddress(e.target.value)} 
                    className="rounded-pill border-2" 
                    style={{ borderColor: '#e9ecef' }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h5 className="fw-bold mb-0">Historique des commandes</h5>
                  <Badge style={{ backgroundColor: '#636e72', color: 'white' }} className="px-3 py-2">{filteredOrders.length} commande(s)</Badge>
                </div>
                {loadingHistoricalOrders ? (
                  <div className="text-center py-5">
                    <div className="spinner-border" style={{ color: '#636e72' }} role="status">
                      <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="mt-3 text-muted">Chargement de l'historique...</p>
                  </div>
                ) : filteredOrders.length > 0 ? (
                  <div className="table-responsive">
                    <div className="custom-table">
                      {filteredOrders.map((order, index) => (
                        <Card key={order.id} className="mb-3 border-0 shadow-sm">
                          <Card.Body className="p-4">
                            <Row className="align-items-center">
                              <Col md={2} className="text-center">
                                <div className="order-number">
                                  <small className="text-muted d-block">N° Commande</small>
                                  <span className="fw-bold" style={{ color: '#6c5ce7' }}>{order.numeroCommande}</span>
                                </div>
                              </Col>
                              <Col md={3}>
                                <small className="text-muted d-block">Date</small>
                                <span className="fw-semibold">{new Date(order.dateCommande).toLocaleDateString('fr-FR')}</span>
                              </Col>
                              <Col md={3}>
                                <small className="text-muted d-block">Adresse</small>
                                <span className="fw-semibold">{order.adresseLivraison}</span>
                              </Col>
                              <Col md={2}>
                                <small className="text-muted d-block">Montant</small>
                                <span className="fw-bold" style={{ color: '#00b894' }}>{order.montantTotal.toLocaleString()} Ar</span>
                              </Col>
                              <Col md={2}>
                                <small className="text-muted d-block">Statut</small>
                                {getStatusBadge(order.statut)}
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="bi bi-clock-history" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                    <h6 className="mt-3 text-muted">Aucune commande historique</h6>
                    <p className="text-muted">Votre historique de commandes apparaîtra ici.</p>
                  </div>
                )}
              </Col>
            </Row>
          </>
        );
      case 'favoris':
        return (
          <div className="text-center py-5">
            <i className="bi bi-heart" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
            <h6 className="mt-3 text-muted">Menus favoris</h6>
            <p className="text-muted">Vos menus favoris apparaîtront ici.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Container fluid className="p-5" style={{ width:'100vw', overflowX:'hidden', minHeight:'100vh', backgroundColor: '#FDF8E499' }}>
      <Row className="mb-4">
        <Col md={3} className="text-center">
          {userImage ? (
            <Image src={userImage} roundedCircle fluid />
          ) : (
            <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-sm" style={{ width: 120, height: 120, backgroundColor:'#f8f9fa', border: '3px solid #fff' }}>
              <i className="bi bi-person" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
            </div>
          )}
        </Col>
        <Col md={9} className="d-flex flex-column justify-content-center">
          <h4 className="fw-bold mb-1">Jean Dupont</h4>
          <p className="text-muted mb-0">jean.dupont@example.com</p>
          <Badge style={{ backgroundColor: '#00b894', color: 'white' }} className="w-fit-content mt-2 px-3 py-2">Client actif</Badge>
        </Col>
      </Row>

      <Nav variant="tabs" className="mb-4 border-0">
        <Nav.Item>
          <Nav.Link
            onClick={() => setActiveTab('commandes')}
            active={activeTab === 'commandes'}
            className={`border-0 fw-semibold rounded-pill px-4 py-2 me-2 ${activeTab === 'commandes' ? 'text-white' : 'bg-light text-dark'}`}
            style={activeTab === 'commandes' ? { backgroundColor: '#6c5ce7' } : {}}
          >
            <i className="bi bi-cart-check me-2"></i>
            Commandes en cours
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => setActiveTab('historique')}
            active={activeTab === 'historique'}
            className={`border-0 fw-semibold rounded-pill px-4 py-2 me-2 ${activeTab === 'historique' ? 'text-white' : 'bg-light text-dark'}`}
            style={activeTab === 'historique' ? { backgroundColor: '#6c5ce7' } : {}}
          >
            <i className="bi bi-clock-history me-2"></i>
            Historique
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => setActiveTab('favoris')}
            active={activeTab === 'favoris'}
            className={`border-0 fw-semibold rounded-pill px-4 py-2 ${activeTab === 'favoris' ? 'text-white' : 'bg-light text-dark'}`}
            style={activeTab === 'favoris' ? { backgroundColor: '#6c5ce7' } : {}}
          >
            <i className="bi bi-heart me-2"></i>
            Favoris
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="p-4 rounded-4 shadow-sm" style={{ backgroundColor: '#fff' }}>
        {renderTabContent()}
      </div>

      <style jsx>{`
        .w-fit-content {
          width: fit-content;
        }
        .custom-table .card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .custom-table .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }
        .order-number {
          padding: 0.5rem;
          border-radius: 0.5rem;
          background-color: #f8f9fa;
        }
        .nav-link {
          transition: all 0.3s ease;
        }
        .nav-link:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </Container>
  );
};

export default UserProfile;