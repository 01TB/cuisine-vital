import { useState, useEffect, useRef } from 'react';

const REPULSION_RADIUS = 120; 
const MAX_REPULSION_STRENGTH = 40; 

const FloatingPill = ({ children, initialStyle, animationDelay, mousePos }) => { 
  const pillRef = useRef(null);
  const [transform, setTransform] = useState('translate(0px, 0px)');

  useEffect(() => {
    if (!pillRef.current || !mousePos.x) {
      return;
    }
    const pillRect = pillRef.current.getBoundingClientRect();
    const pillCenterX = pillRect.left + pillRect.width / 2;
    const pillCenterY = pillRect.top + pillRect.height / 2;
    const dx = pillCenterX - mousePos.x;
    const dy = pillCenterY - mousePos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < REPULSION_RADIUS) {
      const angle = Math.atan2(dy, dx);
      const repulsionStrength = ((REPULSION_RADIUS - distance) / REPULSION_RADIUS) * MAX_REPULSION_STRENGTH;
      const pushX = Math.cos(angle) * repulsionStrength;
      const pushY = Math.sin(angle) * repulsionStrength;
      setTransform(`translate(${pushX}px, ${pushY}px)`);
    } else {
      setTransform('translate(0px, 0px)');
    }
  }, [mousePos]);

  const combinedStyle = {
    ...initialStyle,
    animationDelay,
    transform,
  };

  return (
    <div ref={pillRef} className="floating-pill" style={combinedStyle}>
      {children} 
    </div>
  );
};

export default FloatingPill;