import { useEffect, useState } from 'react';
import CommandePopup from '../components/CommandePopup';
import menu1 from '../assets/ravitoto-sy-henakisoa.png';
import menu2 from '../assets/salade.png';
import menu3 from '../assets/poulet-sy-voanjo.jpg';
import '../styles/Menu.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const allMenus = [
  {
    id: 1,
    title: 'Ravitoto sy Henakisoa',
    description: 'Feuilles de manioc pilées avec viande de porc fondante.',
    image: menu1,
  },
  {
    id: 2,
    title: 'Romazava Royal',
    description: 'Bouillon aux brèdes, viande tendre et épices locales.',
    image: menu2,
  },
  {
    id: 3,
    title: 'Akoho sy Voanio',
    description: 'Poulet au lait de coco et épices douces.',
    image: menu3,
  },
    {
    id: 4,
    title: 'Ravitoto sy Henakisoa',
    description: 'Feuilles de manioc pilées avec viande de porc fondante.',
    image: menu1,
  },
  {
    id: 5,
    title: 'Romazava Royal',
    description: 'Bouillon aux brèdes, viande tendre et épices locales.',
    image: menu2,
  },
  {
    id: 6,
    title: 'Akoho sy Voanio',
    description: 'Poulet au lait de coco et épices douces.',
    image: menu3,
  },
    {
    id: 7,
    title: 'Ravitoto sy Henakisoa',
    description: 'Feuilles de manioc pilées avec viande de porc fondante.',
    image: menu1,
  },
  {
    id: 8,
    title: 'Romazava Royal',
    description: 'Bouillon aux brèdes, viande tendre et épices locales.',
    image: menu2,
  },
  {
    id: 9,
    title: 'Akoho sy Voanio',
    description: 'Poulet au lait de coco et épices douces.',
    image: menu3,
  },
];

const Menu = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedMenus, setSelectedMenus] = useState([]);
    const [menus, setMenus] = useState([]);
    const [search, setSearch] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setMenus(allMenus);
    }, 500);
  }, []);

  const handleSelect = (menu) => {
    setSelectedMenus((prev) =>
        [...prev, menu]
    );
  };

  const filteredMenus = menus.filter(menu =>
    menu.title.toLowerCase().includes(search.toLowerCase()) ||
    menu.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleOrder = () => {
    const selectedItems = menus.filter(menu => selectedMenus.includes(menu.id));
    setShowPopup(true);
  };

  return (
    <Container fluid className="menu-grid-page py-5 position-relative">
      <h2 className="text-center mb-4 fw-bold">Nos Menus</h2>

      <div className="d-flex justify-content-center mb-5">
        <Form.Control
          type="text"
          placeholder="Rechercher un plat..."
          className="menu-grid-search w-75 w-md-50 w-lg-25"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Row className="g-4 justify-content-center px-4">
        {filteredMenus.map(menu => (
          <Col key={menu.id} xs={12} sm={6} md={4} lg={3}>
            <div className="menu-grid-card-square position-relative">
            <div className="menu-grid-checkbox-wrapper">
              <input
                type="checkbox"
                id={`check-${menu.id}`}
                className="menu-grid-checkbox visually-hidden"
                checked={selectedMenus.includes(menu.id)}
                onChange={() => handleSelect(menu)}
              />
              <label htmlFor={`check-${menu.id}`} className={`menu-grid-checkbox-icon ${selectedMenus.includes(menu.id) ? 'selected' : ''}`}>
                <i className="bi bi-check-circle-fill"></i>
              </label>
            </div>
              {menu.image ? (
                <img
                  src={menu.image}
                  alt={menu.title}
                  className="menu-grid-image-square"
                />
              ) : (
                <div className="menu-grid-image-placeholder">Image non disponible</div>
              )}
              <div className="menu-grid-overlay-always d-flex flex-column justify-content-end p-3">
                <h5 className="text-white fw-bold mb-1">{menu.title}</h5>
                <p className="text-white small mb-0">{menu.description}</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {selectedMenus.length > 0 && (
        <div className="menu-grid-order-button-wrapper">
          <Button
            className="px-4 py-2"
            style={{ backgroundColor:'rgb(112, 73, 255)', border: 'none' }}
            onClick={handleOrder}
          >
            <i className="bi bi-box2 me-2"></i>
            Commander ({selectedMenus.length})
          </Button>
        </div>
      )}
      {showPopup && (
        <CommandePopup
            show={showPopup}
            onClose={() => setShowPopup(false)}
            selectedMenus={selectedMenus}
        />
        )}
    </Container>
  );
};

export default Menu;
