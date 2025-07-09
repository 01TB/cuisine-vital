import { Container, Row, Col, Card, Badge, Button, ProgressBar, Nav, Table } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getEnterpriseClientProfile } from '../services/api';

const EnterpriseClientProfile = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clientInfo, setClientInfo] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [availableMenus, setAvailableMenus] = useState([]);
  const [availableAccompaniments, setAvailableAccompaniments] = useState([]);
  const [availableBoissons, setAvailableBoissons] = useState([]);
  const [orderVouchers, setOrderVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getEnterpriseClientProfile();
        setClientInfo(data.clientInfo);
        setSubscriptionData(data.subscriptionData);
        setAvailableMenus(data.availableMenus);
        setAvailableAccompaniments(data.availableAccompaniments);
        setAvailableBoissons(data.availableBoissons);
        setOrderVouchers(data.orderVouchers);
      } catch (err) {
        setError('Failed to fetch data: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSubscriptionTypeStyle = (type) => {
    switch (type) {
      case 'GOLD':
        return { 
          color: 'white',
          gradient: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)'
        };
      case 'SILVER':
        return { 
          color: 'white',
          gradient: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)'
        };
      default:
        return { 
          color: 'white',
          gradient: 'linear-gradient(135deg, #6c5ce7 0%, #5a4fcf 100%)'
        };
    }
  };

  const getVoucherStatusBadge = (statut) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return <Badge style={{ backgroundColor: '#ff9500', color: 'white' }} className="px-3 py-2">En Attente</Badge>;
      case 'VALIDE':
        return <Badge style={{ backgroundColor: '#00b894', color: 'white' }} className="px-3 py-2">Validé</Badge>;
      case 'TRAITE':
        return <Badge style={{ backgroundColor: '#636e72', color: 'white' }} className="px-3 py-2">Traité</Badge>;
      default:
        return <Badge style={{ backgroundColor: '#636e72', color: 'white' }} className="px-3 py-2">{statut}</Badge>;
    }
  };

  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateSubscriptionProgressBar = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    const totalDays = (end - start) / (1000 * 60 * 60 * 24);
    const elapsedDays = (today - start) / (1000 * 60 * 60 * 24);
    return Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: '#6c5ce7' }} role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3 text-muted">Chargement des données...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        const subscriptionStyle = getSubscriptionTypeStyle(subscriptionData?.typeAbonnement?.nom);
        const daysRemaining = calculateDaysRemaining(subscriptionData?.dateFin);
        const progress = calculateSubscriptionProgressBar(subscriptionData?.dateDebut, subscriptionData?.dateFin);
        
        return (
          <Row className="g-4">
            {/* Carte d'abonnement principale */}
            <Col md={8}>
              <Card className="h-100 border-0 shadow-lg position-relative overflow-hidden">
                <div 
                  className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
                ></div>
                <Card.Body className="p-4 position-relative">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <h3 className="fw-bold mb-1">Abonnement {subscriptionData?.typeAbonnement?.nom}</h3>
                      <p className="text-muted mb-0">{subscriptionData?.typeAbonnement?.description}</p>
                    </div>
                    <Badge 
                      className="px-4 py-2 fs-6"
                      style={{ 
                        background: subscriptionStyle.gradient,
                        border: 'none'
                      }}
                    >
                      {subscriptionData?.typeAbonnement?.nom}
                    </Badge>
                  </div>
                  
                  <Row className="mb-4">
                    <Col md={6}>
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-people-fill me-3" style={{ fontSize: '1.5rem', color: '#6c5ce7' }}></i>
                        <div>
                          <h5 className="mb-0">{subscriptionData?.nbEmployes}</h5>
                          <small className="text-muted">Employés couverts</small>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-cash-stack me-3" style={{ fontSize: '1.5rem', color: '#00b894' }}></i>
                        <div>
                          <h5 className="mb-0">{subscriptionData?.typeAbonnement?.prixJour} Ar/jour</h5>
                          <small className="text-muted">Prix par employé</small>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-semibold">ProgressBarion de l'abonnement</span>
                      <span className="text-muted">{Math.round(progress)}%</span>
                    </div>
                    <div className="progress" style={{ height: '8px', borderRadius: '20px' }}>
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${progress}%`,
                          background: subscriptionStyle.gradient,
                          borderRadius: '20px'
                        }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                      <small className="text-muted">
                        Début: {new Date(subscriptionData?.dateDebut).toLocaleDateString('fr-FR')}
                      </small>
                      <small className="text-muted">
                        Fin: {new Date(subscriptionData?.dateFin).toLocaleDateString('fr-FR')}
                      </small>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-muted">Jours restants: </span>
                      <span className="fw-bold" style={{ color: daysRemaining > 30 ? '#00b894' : '#e17055' }}>
                        {daysRemaining} jours
                      </span>
                    </div>
                    <Button 
                      variant="outline-primary" 
                      className="rounded-pill px-4"
                      style={{ 
                        borderColor: '#6c5ce7', 
                        color: '#6c5ce7'
                      }}
                    >
                      Renouveler
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Statistiques rapides */}
            <Col md={4}>
              <Row className="g-3 h-100">
                <Col xs={12}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="text-center p-4">
                      <i className="bi bi-menu-app" style={{ fontSize: '2.5rem', color: '#6c5ce7' }}></i>
                      <h4 className="mt-2 mb-1">{subscriptionData?.typeAbonnement?.nbMenusDisponibles}</h4>
                      <p className="text-muted mb-0">Menus disponibles</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="text-center p-4">
                      <i className="bi bi-receipt" style={{ fontSize: '2.5rem', color: '#00b894' }}></i>
                      <h4 className="mt-2 mb-1">{orderVouchers.length}</h4>
                      <p className="text-muted mb-0">Bons de commande</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>

            {/* Bons de commande récents */}
            <Col xs={12}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Bons de commande récents</h5>
                  <div className="row g-3">
                    {orderVouchers.slice(0, 3).map((voucher, index) => (
                      <div key={voucher.id} className="col-md-4">
                        <Card className="border-0 bg-light h-100">
                          <Card.Body className="p-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <small className="text-muted">#{voucher.id.slice(-6)}</small>
                              {getVoucherStatusBadge(voucher.statut)}
                            </div>
                            <p className="mb-1">
                              <strong>Semaine du</strong><br/>
                              {new Date(voucher.semaineDebut).toLocaleDateString('fr-FR')} - {new Date(voucher.semaineFin).toLocaleDateString('fr-FR')}
                            </p>
                            <small className="text-muted">
                              Créé le {new Date(voucher.createdAt).toLocaleDateString('fr-FR')}
                            </small>
                          </Card.Body>
                        </Card>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );

      case 'menus':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Menus disponibles</h5>
              <Badge style={{ backgroundColor: '#6c5ce7', color: 'white' }} className="px-3 py-2">
                {availableMenus.length} menus
              </Badge>
            </div>
            <Row className="g-3">
              {availableMenus.map((menu, index) => (
                <Col md={4} key={menu.id}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="p-3">
                      <h6 className="fw-bold mb-2">{menu.nom}</h6>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold" style={{ color: '#00b894' }}>
                          {menu.prix.toFixed(2)} Ar
                        </span>
                        <Badge 
                          style={{ 
                            backgroundColor: menu.disponible ? '#00b894' : '#e17055',
                            color: 'white'
                          }}
                          className="px-2 py-1"
                        >
                          {menu.disponible ? 'Disponible' : 'Indisponible'}
                        </Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        );

      case 'accompagnements':
        const boissons = availableBoissons.filter(acc => acc.type === 'boisson');
        const desserts = availableAccompaniments.filter(acc => acc.type === 'dessert');
        
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Boissons & Desserts inclus</h5>
              <Badge style={{ backgroundColor: '#f39c12', color: 'white' }} className="px-3 py-2">
                Abonnement GOLD
              </Badge>
            </div>
            
            <Row className="g-4">
              <Col md={6}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4">
                    <h6 className="fw-bold mb-3">
                      <i className="bi bi-cup-straw me-2" style={{ color: '#6c5ce7' }}></i>
                      Boissons
                    </h6>
                    <div className="row g-2">
                      {boissons.map((boisson) => (
                        <div key={boisson.id} className="col-12">
                          <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                            <span>{boisson.nom}</span>
                            <Badge 
                              style={{ backgroundColor: '#00b894', color: 'white' }}
                              className="px-2 py-1"
                            >
                              Inclus
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4">
                    <h6 className="fw-bold mb-3">
                      <i className="bi bi-cake2 me-2" style={{ color: '#f39c12' }}></i>
                      Desserts
                    </h6>
                    <div className="row g-2">
                      {desserts.map((dessert) => (
                        <div key={dessert.id} className="col-12">
                          <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                            <span>{dessert.nom}</span>
                            <Badge 
                              style={{ backgroundColor: '#00b894', color: 'white' }}
                              className="px-2 py-1"
                            >
                              Inclus
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        );

      case 'vouchers':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Bons de commande</h5>
              <Button 
                variant="outline-primary" 
                className="rounded-pill px-4"
                style={{ borderColor: '#6c5ce7', color: '#6c5ce7' }}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Nouveau bon
              </Button>
            </div>
            
            <div className="table-responsive">
              {orderVouchers.map((voucher) => (
                <Card key={voucher.id} className="mb-3 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <Row className="align-items-center">
                      <Col md={2}>
                        <small className="text-muted d-block">ID Bon</small>
                        <span className="fw-bold" style={{ color: '#6c5ce7' }}>
                          #{voucher.id.slice(-6)}
                        </span>
                      </Col>
                      <Col md={3}>
                        <small className="text-muted d-block">Période</small>
                        <span className="fw-semibold">
                          {new Date(voucher.semaineDebut).toLocaleDateString('fr-FR')} - {new Date(voucher.semaineFin).toLocaleDateString('fr-FR')}
                        </span>
                      </Col>
                      <Col md={2}>
                        <small className="text-muted d-block">Créé le</small>
                        <span className="fw-semibold">
                          {new Date(voucher.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </Col>
                      <Col md={2}>
                        <small className="text-muted d-block">Statut</small>
                        {getVoucherStatusBadge(voucher.statut)}
                      </Col>
                      <Col md={3} className="text-end">
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          className="rounded-pill me-2"
                        >
                          <i className="bi bi-eye me-1"></i>
                          Voir
                        </Button>
                        {voucher.statut === 'EN_ATTENTE' && (
                          <Button 
                            variant="outline-success" 
                            size="sm" 
                            className="rounded-pill"
                          >
                            <i className="bi bi-check-circle me-1"></i>
                            Valider
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Container fluid className="p-5" style={{ 
      width: '100vw', 
      overflowX: 'hidden', 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa' 
    }}>
      {/* En-tête entreprise */}
      <Row className="mb-4">
        <Col md={3} className="text-center">
          <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-sm" 
               style={{ width: 120, height: 120, backgroundColor: '#6c5ce7', border: '4px solid #fff' }}>
            <i className="bi bi-building" style={{ fontSize: '3rem', color: 'white' }}></i>
          </div>
        </Col>
        <Col md={9} className="d-flex flex-column justify-content-center">
          <h3 className="fw-bold mb-1">{clientInfo?.nom || "Nom de l'entreprise"}</h3>
          <p className="text-muted mb-1">{clientInfo?.email || "Email de l'entreprise"}</p>
          <p className="text-muted mb-2">{clientInfo?.adresse || "Adresse de l'entreprise"}</p>
          <div className="d-flex gap-2">
            <Badge style={{ backgroundColor: '#6c5ce7', color: 'white' }} className="px-3 py-2">
              {clientInfo?.secteurActivite || "Secteur d'activité"}
            </Badge>
            <Badge style={{ backgroundColor: '#00b894', color: 'white' }} className="px-3 py-2">
              Client Entreprise
            </Badge>
          </div>
        </Col>
      </Row>

      {/* Navigation */}
      <Nav variant="tabs" className="mb-4 border-0">
        <Nav.Item>
          <Nav.Link
            onClick={() => setActiveTab('dashboard')}
            active={activeTab === 'dashboard'}
            className={`border-0 fw-semibold rounded-pill px-4 py-2 me-2 ${
              activeTab === 'dashboard' ? 'text-white' : 'bg-light text-dark'
            }`}
            style={activeTab === 'dashboard' ? { backgroundColor: '#6c5ce7' } : {}}
          >
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => setActiveTab('menus')}
            active={activeTab === 'menus'}
            className={`border-0 fw-semibold rounded-pill px-4 py-2 me-2 ${
              activeTab === 'menus' ? 'text-white' : 'bg-light text-dark'
            }`}
            style={activeTab === 'menus' ? { backgroundColor: '#6c5ce7' } : {}}
          >
            <i className="bi bi-menu-app me-2"></i>
            Menus
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => setActiveTab('accompagnements')}
            active={activeTab === 'accompagnements'}
            className={`border-0 fw-semibold rounded-pill px-4 py-2 me-2 ${
              activeTab === 'accompagnements' ? 'text-white' : 'bg-light text-dark'
            }`}
            style={activeTab === 'accompagnements' ? { backgroundColor: '#6c5ce7' } : {}}
          >
            <i className="bi bi-cup-straw me-2"></i>
            Boissons & Desserts
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => setActiveTab('vouchers')}
            active={activeTab === 'vouchers'}
            className={`border-0 fw-semibold rounded-pill px-4 py-2 ${
              activeTab === 'vouchers' ? 'text-white' : 'bg-light text-dark'
            }`}
            style={activeTab === 'vouchers' ? { backgroundColor: '#6c5ce7' } : {}}
          >
            <i className="bi bi-receipt me-2"></i>
            Bons de commande
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Contenu principal */}
      <div className="rounded-4 shadow-sm p-4" style={{ backgroundColor: '#fff' }}>
        {renderTabContent()}
      </div>

      <style jsx>{`
        .progress-bar {
          transition: width 0.3s ease;
        }
        .card {
          transition: all 0.3s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
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

export default EnterpriseClientProfile;