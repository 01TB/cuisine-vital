import { Container, Carousel } from 'react-bootstrap';
import { Parallax } from 'react-parallax';
import menu1 from '../assets/ravitoto-sy-henakisoa.png';
import menu3 from '../assets/poulet-sy-voanjo.jpg';
import bgParallax from '../assets/parallax-bg.jpg'; // <-- Ton image de fond

const menus = [
  {
    title: 'Ravitoto sy Henakisoa',
    description: 'Feuilles de manioc pilées et mijotées avec de la viande de porc fondante.',
    image: menu1,
  },
  {
    title: 'Romazava Royal',
    description: 'Un bouillon traditionnel aux brèdes, viande tendre et épices locales.',
    // image: menu2,
  },
  {
    title: 'Akoho sy Voanio',
    description: 'Poulet mijoté dans une sauce coco crémeuse aux notes douces et épicées.',
    image: menu3,
  },
];

const MenuCarousel = () => {
  return (
    <Parallax bgImage={bgParallax} strength={500}>
      <div>
        <Container fluid className="py-5 menu-carousel-section">
          <h2 className="text-center mb-5 fw-bold">Nos Plats Populaires</h2>
          <Carousel variant="dark" indicators={false} controls={true}>
            {menus.map((menu, index) => (
              <Carousel.Item key={index}>
                <div className="d-flex justify-content-center">
                  <div className="menu-card">
                    <div className="menu-image-wrapper">
                      {menu.image ? (
                        <img src={menu.image} alt={menu.title} className="menu-image" />
                      ) : (
                        <div className="menu-image-placeholder">Image non disponible</div>
                      )}
                    </div>
                    <div className="menu-content">
                      <div className='d-flex flex-column justify-content-between'>
                        <h3 className="menu-title">{menu.title}</h3>
                        <h6>Ar 15,000</h6>
                      </div>
                      <div className="menu-overlay">
                        <div className="menu-bottom-row">
                          <p className="menu-description">{menu.description}</p>
                          <div className="menu-buttons">
                            <button className="icon-button">
                              <i className="bi bi-cart-check"></i>
                            </button>
                            <button className="icon-button">
                              <i className="bi bi-info-circle"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </div>
    </Parallax>
  );
};

export default MenuCarousel;
