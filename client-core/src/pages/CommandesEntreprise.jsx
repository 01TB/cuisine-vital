import React from 'react';
import '../styles/CommandesEntreprise.css';

function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fffbf3 0%, #fef3c7 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Navigation */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            backgroundColor: '#f97316',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.125rem'
          }}>
            🍞
          </div>
          <span style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937'
          }}>
            Foodie
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#" style={{ color: '#374151', textDecoration: 'none' }}>Accueil</a>
          <a href="#" style={{ color: '#374151', textDecoration: 'none' }}>Menu</a>
          <a href="#" style={{ color: '#374151', textDecoration: 'none' }}>Offres</a>
          <a href="#" style={{ color: '#374151', textDecoration: 'none' }}>Contact</a>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            backgroundColor: '#fbbf24',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            A
          </div>
          <span style={{ color: '#374151' }}>Aleya</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        gap: '3rem',
        flexWrap: 'wrap'
      }}>
        {/* Left Content */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            color: '#1f2937',
            lineHeight: '1.1',
            marginBottom: '1.5rem'
          }}>
            Goûtez La
            <br />
            <span style={{ color: '#f97316' }}>Différence</span>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#6b7280',
            marginBottom: '2rem',
            maxWidth: '24rem'
          }}>
            Notre approche artisanale de la nourriture
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button style={{
              backgroundColor: '#0f766e',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              Commander maintenant
            </button>
            <button style={{
              border: '2px solid #d1d5db',
              color: '#374151',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              Menu
            </button>
          </div>
        </div>

        {/* Right Content - Food Image */}
        <div style={{ flex: 1, position: 'relative', minWidth: '300px' }}>
          {/* Product Card */}
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            background: 'white',
            borderRadius: '1rem',
            padding: '1rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            zIndex: 10,
            transform: 'rotate(6deg)',
            minWidth: '200px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', margin: 0 }}>Pain Artisanal</h3>
              <button style={{
                width: '2rem',
                height: '2rem',
                backgroundColor: '#fbbf24',
                borderRadius: '50%',
                border: 'none',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                +
              </button>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <div style={{ color: '#fbbf24', marginRight: '0.5rem' }}>★★★★★</div>
              <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>(2.5K avis)</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>25€</div>
          </div>

          {/* Main Food Image */}
          <div style={{
            position: 'relative',
            width: '400px',
            height: '400px',
            margin: '0 auto'
          }}>
            {/* Background decorations */}
            <div style={{
              position: 'absolute',
              inset: '0',
              background: 'linear-gradient(45deg, #fed7aa 0%, #fde68a 100%)',
              borderRadius: '50%',
              transform: 'rotate(-12deg) scale(1.1)'
            }}></div>
            <div style={{
              position: 'absolute',
              inset: '0',
              border: '4px dashed #fdca74',
              borderRadius: '50%',
              transform: 'rotate(12deg)'
            }}></div>
            
            {/* Food Image */}
            <div style={{
              position: 'relative',
              zIndex: 5,
              background: 'white',
              borderRadius: '50%',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src="/assets/salmon-salad.jpg" 
                alt="Pain artisanal" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            </div>
          </div>

          {/* Small product images */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            display: 'flex',
            gap: '1rem'
          }}>
            <div style={{
              width: '5rem',
              height: '5rem',
              background: 'white',
              borderRadius: '50%',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              padding: '0.5rem',
              position: 'relative'
            }}>
              <img 
                src="/assets/burger.jpg" 
                alt="Burger" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
              <button style={{
                position: 'absolute',
                bottom: '-0.5rem',
                right: '-0.5rem',
                width: '1.5rem',
                height: '1.5rem',
                backgroundColor: '#0f766e',
                borderRadius: '50%',
                border: 'none',
                color: 'white',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}>
                +
              </button>
            </div>
            
            <div style={{
              width: '5rem',
              height: '5rem',
              background: 'white',
              borderRadius: '50%',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              padding: '0.5rem',
              position: 'relative'
            }}>
              <img 
                src="/assets/cupcake.jpg" 
                alt="Cupcake" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
              <button style={{
                position: 'absolute',
                bottom: '-0.5rem',
                right: '-0.5rem',
                width: '1.5rem',
                height: '1.5rem',
                backgroundColor: '#0f766e',
                borderRadius: '50%',
                border: 'none',
                color: 'white',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}>
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '2.5rem',
        width: '0.5rem',
        height: '0.5rem',
        backgroundColor: '#fdba74',
        borderRadius: '50%',
        animation: 'pulse 2s infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '5rem',
        width: '0.75rem',
        height: '0.75rem',
        backgroundColor: '#fcd34d',
        borderRadius: '50%',
        animation: 'pulse 2s infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: '25%',
        width: '0.5rem',
        height: '0.5rem',
        backgroundColor: '#fb923c',
        borderRadius: '50%',
        animation: 'pulse 2s infinite'
      }}></div>
    </div>
  );
}

export default Home;
