import { useEffect, useState } from 'react';
import CommandePopup from '../components/CommandePopup';
import '../styles/Menu.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import publicApi from '../const/publicApi';
import { useAuth } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedMenus, setSelectedMenus] = useState([]);
    const [menus, setMenus] = useState([]);
    const [search, setSearch] = useState('');
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await publicApi.get('/client/menus');
        setMenus(response.data);
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    };

    fetchMenus();
  }, []);

  const handleSelect = (menu) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setSelectedMenus((prev) => {
      const existingMenu = prev.find((item) => item.id === menu.id);
      if (existingMenu) {
        // If menu is already selected, remove it (checkbox behavior)
        return prev.filter((item) => item.id !== menu.id);
      } else {
        // Add new menu with quantity 1
        return [...prev, { ...menu, quantity: 1 }];
      }
    });
  };

  const handleMenuQuantityChange = (menuId, quantity) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setSelectedMenus((prev) =>
      prev.map((menu) =>
        menu.id === menuId ? { ...menu, quantity: Math.max(1, quantity) } : menu
      )
    );
  };

  const filteredMenus = menus.filter(menu =>
    menu.nom.toLowerCase().includes(search.toLowerCase()) ||
    menu.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleOrder = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
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
                checked={selectedMenus.some(item => item.id === menu.id)}
                onChange={() => handleSelect(menu)}
              />
              <label htmlFor={`check-${menu.id}`} className={`menu-grid-checkbox-icon ${selectedMenus.some(item => item.id === menu.id) ? 'selected' : ''}`}>
                <i className="bi bi-check-circle-fill"></i>
              </label>
            </div>
              {menu.photoUrl ? (
                <img
                  src={menu.photoUrl}
                  alt={menu.nom}
                  className="menu-grid-image-square"
                />
              ) : (
                <div className="menu-grid-image-placeholder">Image non disponible</div>
              )}
              <div className="menu-grid-overlay-always d-flex flex-column justify-content-end p-3">
                <h5 className="text-white fw-bold mb-1">{menu.nom}</h5>
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
            Commander ({selectedMenus.reduce((sum, menu) => sum + menu.quantity, 0)})
          </Button>
        </div>
      )}
      {showPopup && (
        <CommandePopup
            show={showPopup}
            onClose={() => setShowPopup(false)}
            selectedMenus={selectedMenus}
            onMenuQuantityChange={handleMenuQuantityChange}
        />
        )}
    </Container>
  );
};

export default Menu;
