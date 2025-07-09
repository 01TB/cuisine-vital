import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../const/api';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Tab,
  Nav,
  Form,
  Table,
  Spinner,
  Alert,
} from 'react-bootstrap';

const colors = {
  background: '#F8F9FA', // Fond principal très clair
  cardBackground: '#FFFFFF', // Fond des cartes, légèrement plus blanc
  accent: 'rgb(45, 45, 48)', // Gris doux pour les textes et icônes (anciennement rgb(49, 49, 49))
  secondaryAccent: 'rgb(72, 74, 83)', // Gris plus clair pour les textes secondaires (anciennement #777)
  primaryButton: '#007BFF', // Bleu primaire pour les actions importantes
  primaryButtonHover: '#0056b3', // Bleu plus foncé au survol
  border: '#E0E0E0', // Bordure très subtile
  success: '#28a745',
  danger: '#dc3545',
};

// Styles de base pour les éléments (cartes, modales, etc.)
const baseElementStyle = {
  borderRadius: '15px', // Rondeur généreuse
  backgroundColor: colors.cardBackground,
  border: `1px solid ${colors.border}`, // Bordure très subtile
  transition: 'all 0.2s ease-in-out', // Transitions douces pour les interactions
};

// Style pour les champs de formulaire et les éléments "incrustés"
const inputFieldStyle = {
  ...baseElementStyle,
  backgroundColor: colors.background, // Légèrement plus foncé que le fond de carte pour un léger contraste
  border: `1px solid ${colors.border}`,
  padding: '10px 15px',
  outline: 'none',
};

// Style pour les boutons
const buttonStyle = {
  ...baseElementStyle,
  backgroundColor: colors.primaryButton,
  color: '#FFFFFF',
  border: 'none',
  padding: '10px 20px',
  fontWeight: '600',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: colors.primaryButtonHover,
    transform: 'translateY(-1px)', // Léger effet de soulèvement
  },
  '&:active': {
    backgroundColor: colors.primaryButtonHover,
    transform: 'translateY(0)', // Retour à la position normale au clic
  },
};

// Style pour les boutons secondaires (Fermer)
const secondaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: colors.secondaryAccent,
  '&:hover': {
    backgroundColor: '#86919B',
  },
};

// Style pour les onglets de navigation
const navLinkStyle = {
  ...baseElementStyle,
  backgroundColor: 'transparent', // Pas de fond par défaut
  border: 'none', // Pas de bordure par défaut
  padding: '10px 20px',
  marginRight: '10px',
  fontWeight: '500',
  color: colors.secondaryAccent,
  cursor: 'pointer',
  '&.active': {
    ...baseElementStyle, // L'onglet actif a le fond de carte pour le mettre en avant
    backgroundColor: colors.cardBackground,
    color: colors.accent,
    fontWeight: '600',
    borderBottom: `2px solid ${colors.primaryButton}`, // Souligne l'onglet actif
    borderRadius: '15px 15px 0 0', // Bordures du bas droites pour l'effet d'onglet
  },
  '&:hover': {
    backgroundColor: colors.background, // Léger changement de fond au survol
    color: colors.accent,
  },
};

function AbonnementsPage() {
  // États pour abonnements "clients"
  const [abonnements, setAbonnements] = useState([]);
  const [loadingAbonnements, setLoadingAbonnements] = useState(true);
  const [errorAbonnements, setErrorAbonnements] = useState(null);
  const [selectedAbonnement, setSelectedAbonnement] = useState(null);
  const [updatingAbonnement, setUpdatingAbonnement] = useState(false);

  // États pour types d'abonnements
  const [typesAbonnement, setTypesAbonnement] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [menus, setMenus] = useState([]);
  const [accompagnements, setAccompagnements] = useState([]);
  const [formData, setFormData] = useState({});

  // Chargements initiaux
  useEffect(() => {
    fetchAbonnements();
    fetchTypes();
  }, []);

  // --- Fonctions pour abonnements clients ---
  const fetchAbonnements = async () => {
    try {
      setLoadingAbonnements(true);
      const res = await axios.get(api('admin/abonnements'));
      setAbonnements(res.data);
      setErrorAbonnements(null);
    } catch (err) {
      setErrorAbonnements("Erreur lors du chargement des abonnements.");
    } finally {
      setLoadingAbonnements(false);
    }
  };

  const handleChangeAbonnement = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedAbonnement((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const saveChangesAbonnement = async () => {
    try {
      setUpdatingAbonnement(true);
      await axios.patch(api(`admin/abonnements/${selectedAbonnement.id}`), selectedAbonnement);
      await fetchAbonnements();
      setSelectedAbonnement(null);
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setUpdatingAbonnement(false);
    }
  };

  // --- Fonctions pour types d'abonnements ---
  const fetchTypes = async () => {
    const res = await axios.get(api('admin/types-abonnement'));
    setTypesAbonnement(res.data);
  };

  const openTypeDetail = async (type) => {
    setSelectedType(type);
    setFormData({ ...type });

    const [menusRes, accRes] = await Promise.all([
      axios.get(api(`admin/types-abonnement/${type.id}/menus`)),
      axios.get(api(`admin/types-abonnement/${type.id}/accompagnements`)),
    ]);

    setMenus(menusRes.data);
    setAccompagnements(accRes.data);
    setShowTypeModal(true);
  };

  const handleToggle = (setter) => (id) => {
    setter((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, inclus: !item.inclus } : item
      )
    );
  };

  const handleSaveType = async () => {
    const currentMenus = menus.filter((m) => m.inclus).map((m) => m.id);
    const currentAcc = accompagnements.filter((a) => a.inclus).map((a) => a.id);

    await axios.put(api(`admin/types-abonnement/${selectedType.id}`), formData);
    await axios.post(api(`admin/types-abonnement/${selectedType.id}/menus`), {
      menuIds: currentMenus,
    });
    await axios.post(api(`admin/types-abonnement/${selectedType.id}/accompagnements`), {
      accompagnementIds: currentAcc,
    });

    setShowTypeModal(false);
    fetchTypes();
  };

  return (
    <Container className="py-4" style={{ backgroundColor: colors.background, minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <h2 className="fw-bold mb-4" style={{ color: colors.accent }}>
        Abonnements
      </h2>
      <Tab.Container defaultActiveKey="abonnements">
        <Nav variant="tabs" className="mb-4" style={{ borderBottom: 'none' }}>
          <Nav.Item>
            <Nav.Link eventKey="abonnements" style={navLinkStyle} className="d-flex align-items-center justify-content-center">
              Abonnements
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="types" style={navLinkStyle} className="d-flex align-items-center justify-content-center">
              Catégories d'abonnements
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* Onglet Abonnements clients */}
          <Tab.Pane eventKey="abonnements">
            {loadingAbonnements ? (
              <div className="text-center py-5">
                <Spinner animation="border" style={{ color: colors.primaryButton }} />
                <div className="mt-2" style={{ color: colors.secondaryAccent }}>Chargement des abonnements...</div>
              </div>
            ) : errorAbonnements ? (
              <Alert variant="danger" style={{ ...baseElementStyle, backgroundColor: '#ffebe6', borderColor: colors.danger, color: colors.danger }}>
                {errorAbonnements}
              </Alert>
            ) : abonnements.length === 0 ? (
              <Card style={{ ...baseElementStyle, padding: '20px', textAlign: 'center', color: colors.secondaryAccent }}>
                Aucun abonnement disponible.
              </Card>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {abonnements.map((abonnement) => (
                  <Col key={abonnement.id}>
                    <Card
                      style={{
                        ...baseElementStyle,
                        padding: '20px',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                      onClick={() => setSelectedAbonnement(abonnement)}
                    >
                      <Card.Body>
                        <Card.Title
                          style={{ fontWeight: '600', color: colors.accent, marginBottom: '10px' }}
                        >
                          {abonnement.client.nom?.slice(0, 8) || 'N/A'}...
                        </Card.Title>
                        <div style={{ color: colors.secondaryAccent, fontSize: '0.9rem', lineHeight: '1.6' }}>
                          <div>Début: <span style={{ fontWeight: '500' }}>{abonnement.dateDebut}</span></div>
                          <div>Fin: <span style={{ fontWeight: '500' }}>{abonnement.dateFin || '—'}</span></div>
                          <div>Employés: <span style={{ fontWeight: '500' }}>{abonnement.nbEmployes}</span></div>
                          <div>
                            Status:{' '}
                            <span
                              style={{
                                fontWeight: '500',
                                color: abonnement.actif ? colors.success : colors.danger,
                              }}
                            >
                              {abonnement.actif ? 'Actif' : 'Inactif'}
                            </span>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Tab.Pane>

          {/* Onglet Types d'abonnement */}
          <Tab.Pane eventKey="types">
            <Row className="g-4">
              {typesAbonnement.map((type) => (
                <Col key={type.id} lg={4}>
                  <Card
                    style={{
                      ...baseElementStyle,
                      padding: '20px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    <Card.Body>
                      <Card.Title style={{ color: colors.accent, marginBottom: '10px' }}>
                        {type.nom}
                      </Card.Title>
                      <Card.Text style={{ color: colors.secondaryAccent, lineHeight: '1.6' }}>
                        Prix par jour: <strong style={{ color: colors.primaryButton }}>{type.prixJour} €</strong>
                      </Card.Text>
                      <Card.Text style={{ color: colors.secondaryAccent }}>
                        Menus disponibles: <span style={{ fontWeight: '500' }}>{type.nbMenusDisponibles}</span>
                      </Card.Text>
                      <Button
                        style={{ ...buttonStyle, marginTop: '15px' }}
                        onClick={() => openTypeDetail(type)}
                      >
                        Voir détails
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Modal détail/modif abonnement client */}
      <Modal show={!!selectedAbonnement} onHide={() => setSelectedAbonnement(null)} centered>
        <Modal.Header closeButton style={{ ...baseElementStyle, borderBottom: 'none' }}>
          <Modal.Title style={{ color: colors.accent }}>Détails de l’abonnement</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ ...baseElementStyle, borderTop: 'none', backgroundColor: colors.background }}>
          {selectedAbonnement && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: colors.accent, fontWeight: '500' }}>Client ID</Form.Label>
                <Form.Control
                  type="text"
                  name="clientId"
                  value={selectedAbonnement.clientId}
                  onChange={handleChangeAbonnement}
                  disabled
                  style={inputFieldStyle}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: colors.accent, fontWeight: '500' }}>Date de début</Form.Label>
                <Form.Control
                  type="date"
                  name="dateDebut"
                  value={selectedAbonnement.dateDebut}
                  onChange={handleChangeAbonnement}
                  style={inputFieldStyle}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: colors.accent, fontWeight: '500' }}>Date de fin</Form.Label>
                <Form.Control
                  type="date"
                  name="dateFin"
                  value={selectedAbonnement.dateFin || ''}
                  onChange={handleChangeAbonnement}
                  style={inputFieldStyle}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: colors.accent, fontWeight: '500' }}>Nombre d'employés</Form.Label>
                <Form.Control
                  type="number"
                  name="nbEmployes"
                  value={selectedAbonnement.nbEmployes}
                  onChange={handleChangeAbonnement}
                  style={inputFieldStyle}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Actif"
                  name="actif"
                  checked={selectedAbonnement.actif}
                  onChange={(e) =>
                    setSelectedAbonnement((prev) => ({ ...prev, actif: e.target.checked }))
                  }
                  className="mt-3"
                  style={{ color: colors.secondaryAccent }}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer style={{ ...baseElementStyle, borderTop: 'none', backgroundColor: colors.cardBackground, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => setSelectedAbonnement(null)} style={{ ...secondaryButtonStyle, marginRight: '10px' }}>
            Fermer
          </Button>
          <Button onClick={saveChangesAbonnement} disabled={updatingAbonnement} style={buttonStyle}>
            {updatingAbonnement ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Enregistrement...
              </>
            ) : (
              'Enregistrer'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal détail/modif type d'abonnement */}
      <Modal show={showTypeModal} onHide={() => setShowTypeModal(false)} size="xl" centered>
        <Modal.Header closeButton style={{ ...baseElementStyle, borderBottom: 'none' }}>
          <Modal.Title style={{ color: colors.accent }}>Détails du type d'abonnement</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ ...baseElementStyle, borderTop: 'none', backgroundColor: colors.background }}>
          <Row>
            <Col md={7}>
              <h5 style={{ color: colors.accent, marginBottom: '15px' }}>Menus</h5>
              <div style={{ ...baseElementStyle, backgroundColor: colors.cardBackground, padding: '15px', marginBottom: '20px' }}>
                <Table size="sm" borderless style={{ backgroundColor: 'transparent' }}>
                  <tbody>
                    {menus.map((m) => (
                      <tr key={m.id}>
                        <td style={{ color: colors.secondaryAccent, verticalAlign: 'middle', borderBottom: `1px solid ${colors.border}` }}>{m.nom}</td>
                        <td style={{ width: '50px', borderBottom: `1px solid ${colors.border}` }}>
                          <Form.Check
                            type="checkbox"
                            checked={m.inclus}
                            onChange={() => handleToggle(setMenus)(m.id)}
                            style={{ color: colors.primaryButton }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <h5 style={{ color: colors.accent, marginBottom: '15px' }}>Accompagnements</h5>
              <div style={{ ...baseElementStyle, backgroundColor: colors.cardBackground, padding: '15px' }}>
                <Table size="sm" borderless style={{ backgroundColor: 'transparent' }}>
                  <tbody>
                    {accompagnements.map((a) => (
                      <tr key={a.id}>
                        <td style={{ color: colors.secondaryAccent, verticalAlign: 'middle', borderBottom: `1px solid ${colors.border}` }}>{a.nom}</td>
                        <td style={{ width: '50px', borderBottom: `1px solid ${colors.border}` }}>
                          <Form.Check
                            type="checkbox"
                            checked={a.inclus}
                            onChange={() => handleToggle(setAccompagnements)(a.id)}
                            style={{ color: colors.primaryButton }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
            <Col md={5}>
              <Form style={{ ...baseElementStyle, backgroundColor: colors.cardBackground, padding: '25px' }}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: colors.accent, fontWeight: '500' }}>Nom</Form.Label>
                  <Form.Control
                    value={formData.nom || ''}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    style={inputFieldStyle}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: colors.accent, fontWeight: '500' }}>Prix par jour</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.prixJour || ''}
                    onChange={(e) => setFormData({ ...formData, prixJour: e.target.value })}
                    style={inputFieldStyle}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: colors.accent, fontWeight: '500' }}>Menus disponibles</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.nbMenusDisponibles || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, nbMenusDisponibles: parseInt(e.target.value) })
                    }
                    style={inputFieldStyle}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: colors.accent, fontWeight: '500' }}>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ ...inputFieldStyle, minHeight: '100px' }}
                  />
                </Form.Group>
                <Button onClick={handleSaveType} style={{ ...buttonStyle, backgroundColor: colors.success, '&:hover': { backgroundColor: '#218838' } }}>
                  Enregistrer
                </Button>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AbonnementsPage;