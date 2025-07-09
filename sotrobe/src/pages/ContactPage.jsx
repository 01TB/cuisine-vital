import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    serviceType: 'particulier'
  });
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique d'envoi du formulaire
    console.log('Form submitted:', formData);
    alert('Votre message a été envoyé ! Nous vous répondrons dans les plus brefs délais.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      serviceType: 'particulier'
    });
  };

  const handleOrderClick = () => {
    if (isLoggedIn) {
      navigate('/menus');
    } else {
      navigate('/login');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <Container fluid className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <h1 className="display-4 fw-bold text-dark mb-4">
              Contactez <span style={{ color: '#f4a261' }}>Sotro Be</span>
            </h1>
            <p className="lead text-muted mb-4">
              Une question ? Un besoin particulier ? Notre équipe est là pour vous accompagner 
              dans votre expérience culinaire.
            </p>
          </Col>
        </Row>
      </Container>

      <Container className="py-5">
        <Row>
          {/* Informations de contact */}
          <Col lg={4} className="mb-4">
            <h3 className="fw-bold mb-4">Nos Coordonnées</h3>
            
            <Card className="mb-3 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-geo-alt-fill text-warning me-3" style={{ fontSize: '1.5rem' }}></i>
                  <div>
                    <h6 className="mb-0 fw-bold">Adresse</h6>
                    <p className="text-muted mb-0">
                      Lot II M 25 Bis Ambohidahy<br />
                      Antananarivo 101, Madagascar
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="mb-3 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-telephone-fill text-warning me-3" style={{ fontSize: '1.5rem' }}></i>
                  <div>
                    <h6 className="mb-0 fw-bold">Téléphone</h6>
                    <p className="text-muted mb-0">
                      +261 34 12 345 67<br />
                      +261 32 98 765 43
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="mb-3 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-envelope-fill text-warning me-3" style={{ fontSize: '1.5rem' }}></i>
                  <div>
                    <h6 className="mb-0 fw-bold">Email</h6>
                    <p className="text-muted mb-0">
                      contact@sotrobe.mg<br />
                      commandes@sotrobe.mg
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-clock-fill text-warning me-3" style={{ fontSize: '1.5rem' }}></i>
                  <div>
                    <h6 className="mb-0 fw-bold">Horaires</h6>
                    <p className="text-muted mb-0">
                      Lundi - Vendredi : 11:00 - 22:00<br />
                      Samedi - Dimanche : 11:00 - 23:00
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Services */}
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Nos Services</h5>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-warning text-dark px-3 py-2">Livraison Particuliers</span>
                <span className="badge bg-warning text-dark px-3 py-2">Livraison Entreprises</span>
                <span className="badge bg-warning text-dark px-3 py-2">Repas Événements</span>
                <span className="badge bg-warning text-dark px-3 py-2">Traiteur</span>
              </div>
            </div>

            {/* Bouton de commande rapide */}
            <div className="text-center">
              <Button 
                variant="warning" 
                size="lg" 
                className="rounded-5 px-4"
                onClick={handleOrderClick}
              >
                <i className="bi bi-bicycle me-2"></i>
                Commander maintenant
              </Button>
            </div>
          </Col>

          {/* Formulaire de contact */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h3 className="fw-bold mb-4">Envoyez-nous un message</h3>
                
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nom complet *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Votre nom complet"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="votre@email.com"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Téléphone</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+261 34 12 345 67"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Type de service</Form.Label>
                        <Form.Select
                          name="serviceType"
                          value={formData.serviceType}
                          onChange={handleInputChange}
                        >
                          <option value="particulier">Particulier</option>
                          <option value="entreprise">Entreprise</option>
                          <option value="evenement">Événement</option>
                          <option value="traiteur">Traiteur</option>
                          <option value="autre">Autre</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Sujet *</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="Objet de votre message"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Message *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Décrivez votre demande, question ou commentaire..."
                    />
                  </Form.Group>

                  <div className="text-center">
                    <Button 
                      type="submit" 
                      style={{ backgroundColor: '#99621E', border: 'none' }}
                      size="lg"
                      className="rounded-5 px-5"
                    >
                      <i className="bi bi-send me-2"></i>
                      Envoyer le message
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Section FAQ rapide */}
      <Container fluid className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={10}>
              <h3 className="text-center fw-bold mb-5">Questions Fréquentes</h3>
              <Row>
                <Col md={6} className="mb-4">
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body>
                      <h6 className="fw-bold mb-3">
                        <i className="bi bi-question-circle text-warning me-2"></i>
                        Quels sont vos délais de livraison ?
                      </h6>
                      <p className="text-muted mb-0">
                        Nous livrons en 30-45 minutes pour les particuliers et proposons des créneaux 
                        sur mesure pour les entreprises.
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} className="mb-4">
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body>
                      <h6 className="fw-bold mb-3">
                        <i className="bi bi-question-circle text-warning me-2"></i>
                        Livrez-vous dans toute la ville ?
                      </h6>
                      <p className="text-muted mb-0">
                        Nous couvrons Antananarivo et ses environs. Contactez-nous pour vérifier 
                        si votre zone est desservie.
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} className="mb-4">
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body>
                      <h6 className="fw-bold mb-3">
                        <i className="bi bi-question-circle text-warning me-2"></i>
                        Proposez-vous des formules entreprise ?
                      </h6>
                      <p className="text-muted mb-0">
                        Oui ! Nous avons des formules spéciales pour les entreprises avec des tarifs 
                        préférentiels et des livraisons régulières.
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} className="mb-4">
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body>
                      <h6 className="fw-bold mb-3">
                        <i className="bi bi-question-circle text-warning me-2"></i>
                        Comment passer commande ?
                      </h6>
                      <p className="text-muted mb-0">
                        Créez un compte, parcourez nos menus, ajoutez vos plats favoris au panier 
                        et validez votre commande.
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* Réseaux sociaux */}
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <h5 className="fw-bold mb-3">Suivez-nous</h5>
            <div className="d-flex justify-content-center gap-3">
              <a href="#facebook" className="btn btn-outline-dark btn-lg rounded-circle">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#instagram" className="btn btn-outline-dark btn-lg rounded-circle">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#twitter" className="btn btn-outline-dark btn-lg rounded-circle">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#linkedin" className="btn btn-outline-dark btn-lg rounded-circle">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactPage;