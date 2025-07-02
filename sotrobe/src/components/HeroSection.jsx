import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import foodImage from '../assets/food-image.png';
import FloatingPill from './FloatingPill';
import MapIcon from './MapIcon';

const qualityPills = [
  { text: 'Livraison Rapide & Fiable', initialStyle: { top: '5%', left: '15%' }, animationDelay: '0s' },
  { text: 'Produits Frais Garantis', initialStyle: { top: '20%', right: '5%' }, animationDelay: '-1s' },
  { text: 'Paiement Sécurisé', initialStyle: { bottom: '5%', right: '15%' }, animationDelay: '-3s' },
  { text: 'Plats Délicieux', initialStyle: { top: '55%', right: '-5%' }, animationDelay: '-4s' },
  { text: 'Service Client 24/7', initialStyle: { bottom: '15%', left: '10%' }, animationDelay: '-5s' },
  {
    isComplex: true, 
    content: (
      <>
        <MapIcon />
        Tracking en temps réel
      </>
    ),
    initialStyle: { top: '75%', left: '0%' },
    animationDelay: '-2s',
  },
];

const HeroSection = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // const handleScroll = () => {
    //   setScrollY(window.scrollY);
    // };

    // window.addEventListener('scroll', handleScroll);
    // return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePillMouseMove = (e) => {
    setMousePos({ x: e.clientX , y: e.clientY });
  }

  return (
    <Container
          fluid
          className="hero-section parallax-hero"
          onMouseMove={handlePillMouseMove}
        >
        <Row className="p-5 align-items-center w-100">
        <Col md={6} className="hero-text">
          <h1 className="fade-in-up">
            Le goût de la tradition,
            <span className="brand-name">Sotro Be</span>
          </h1>
          <p className="fade-in-up">
            Les meilleurs plats de votre ville, livrés chauds et rapidement à votre porte. Découvrez une expérience culinaire inoubliable.
          </p>
        <div className="cta-buttons fade-in-up">
        <Button className="btn-custom btn-order rounded-5" style={{ backgroundColor:'#99621E', border:'none' }}>
            <i className="bi bi-bicycle me-2"></i>
            Commander maintenant
        </Button>
        <Button className="btn-custom border-black rounded-5 mx-3" style={{ backgroundColor:'#2C5530', border:'none', color:'white' }}>
            <i className="bi bi-calendar-check me-2"></i> 
            Voir les plats du jour
        </Button>
        </div>
        </Col>

        <Col md={6} className="hero-image-wrapper">
          <img
            src={foodImage}
            alt="Plat délicieux"
            className="interactive-image"
          />

          {qualityPills.map((pill, index) => (
            <FloatingPill
              key={index}
              initialStyle={pill.initialStyle}
              animationDelay={pill.animationDelay}
              mousePos={mousePos}
            >
              {pill.isComplex ? pill.content : pill.text}
            </FloatingPill>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default HeroSection;