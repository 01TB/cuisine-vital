import React from 'react';

const style = `
body {
    background-color: #f8f9fa;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.sidebar {
    width: 250px;
    min-width: 250px;
    background: white;
    box-shadow: 2px 0 8px rgba(0,0,0,0.1);
    border-right: 1px solid #e9ecef;
}
.main-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
}
.right-panel {
    width: 320px;
    min-width: 320px;
    background: white;
    box-shadow: -2px 0 8px rgba(0,0,0,0.1);
    border-left: 1px solid #e9ecef;
}
.stats-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    border: 1px solid #e9ecef;
    transition: all 0.3s ease;
}
.stats-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}
.icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.icon-blue { background-color: #dbeafe; color: #2563eb; }
.icon-green { background-color: #dcfce7; color: #16a34a; }
.icon-orange { background-color: #fed7aa; color: #ea580c; }
.icon-purple { background-color: #e9d5ff; color: #9333ea; }
.map-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    border: 1px solid #e9ecef;
}
.map-placeholder {
    background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
    border-radius: 8px;
    height: 400px;
    position: relative;
    overflow: hidden;
}
.map-marker {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    position: absolute;
    animation: pulse 2s infinite;
}
@keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
}
.marker-blue { background-color: #3b82f6; top: 80px; left: 80px; }
.marker-green { background-color: #10b981; top: 120px; right: 100px; }
.marker-red { background-color: #ef4444; bottom: 80px; left: 120px; }
.marker-yellow { background-color: #f59e0b; bottom: 100px; right: 80px; }
.legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
}
.order-card {
    border: 1px solid #e9ecef;
    border-radius: 8px;
    transition: all 0.3s ease;
}
.order-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-1px);
}
.status-badge {
    font-size: 0.75rem;
    font-weight: 500;
}
.status-in-transit { background-color: #dbeafe; color: #1d4ed8; }
.status-delayed { background-color: #fee2e2; color: #dc2626; }
.status-pending { background-color: #fef3c7; color: #d97706; }
.nav-link {
    color: #6b7280;
    border-radius: 8px;
    transition: all 0.2s ease;
}
.nav-link:hover {
    background-color: #f3f4f6;
    color: #374151;
}
.nav-link.active {
    background-color: #dbeafe;
    color: #1d4ed8;
    font-weight: 500;
}
.user-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
}
.header-shadow {
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
`;

const GestionTrajet = () => (
  <>
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css"
      rel="stylesheet"
    />
    <style>{style}</style>
    <div className="d-flex flex-column vh-100">
      {/* Header */}
      <div className="bg-white p-3 d-flex justify-content-between align-items-center border-bottom header-shadow">
        <h1 className="h2 mb-0 fw-bold text-dark">Gestion des trajets</h1>
        <div className="d-flex align-items-center">
          <div className="user-avatar me-3">
            <i className="bi bi-person-fill"></i>
          </div>
          <span className="text-dark fw-medium">Tsitohaina Berthin</span>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Sidebar (Left) */}
        <div className="sidebar overflow-auto">
          <nav className="p-3">
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <a className="nav-link d-flex align-items-center" href="#">
                  <i className="bi bi-box-seam me-2"></i>
                  Commandes
                </a>
              </li>
              <li className="nav-item mb-2">
                <a className="nav-link" href="#">Gestion du menu</a>
                <ul className="nav flex-column ms-3 mt-2">
                  <li className="nav-item">
                    <a className="nav-link py-1 small" href="/menu">Plats</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link py-1 small" href="#">Catégories</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link py-1 small" href="#">Ajouter un nouveau plat</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link py-1 small" href="#">Promotions</a>
                  </li>
                </ul>
              </li>
              <li className="nav-item mb-2">
                <a className="nav-link" href="#">Gestion de la cuisine</a>
                <ul className="nav flex-column ms-3 mt-2">
                  <li className="nav-item">
                    <a className="nav-link py-1 small active" href="#">Ingrédients</a>
                  </li>
                </ul>
              </li>
              <li className="nav-item mb-2">
                <a className="nav-link" href="#">Statistiques & Analyses</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Paramètres</a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content (Middle) */}
        <div className="main-content">
          {/* Stats Cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-6 col-lg-3">
              <div className="stats-card p-3">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper icon-blue me-3">
                    <i className="bi bi-truck fs-4"></i>
                  </div>
                  <div>
                    <div className="small text-muted">Total de livraison </div>
                    <div className="h3 mb-0 fw-bold">5</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="stats-card p-3">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper icon-green me-3">
                    <i className="bi bi-people fs-4"></i>
                  </div>
                  <div>
                    <div className="small text-muted">Livreurs en ligne</div>
                    <div className="h3 mb-0 fw-bold">3</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="stats-card p-3">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper icon-orange me-3">
                    <i className="bi bi-clock fs-4"></i>
                  </div>
                  <div>
                    <div className="small text-muted">Temps de livraison moyen</div>
                    <div className="h3 mb-0 fw-bold">35 min</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="stats-card p-3">
                <h6 className="text-muted mb-3">Statut des livreurs</h6>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge status-in-transit">En ligne</span>
                  <span className="fw-semibold">3</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge status-in-transit">En cours de livraison</span>
                  <span className="fw-semibold">2</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-secondary">Hors ligne</span>
                  <span className="fw-semibold">1</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-info">Total Actif</span>
                  <span className="fw-semibold">5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="map-container p-4 mb-4">
            <div className="mb-3">
              <h5 className="fw-semibold mb-2">Carte de livraison en direct</h5>
              <div className="map-placeholder d-flex align-items-center justify-content-center position-relative">
                <div className="text-center">
                  <i className="bi bi-geo-alt display-1 text-muted mb-3"></i>
                  <p className="text-muted">Carte interactive des livraisons</p>
                </div>
                {/* Simulated map markers */}
                <div className="map-marker marker-blue"></div>
                <div className="map-marker marker-green"></div>
                <div className="map-marker marker-red"></div>
                <div className="map-marker marker-yellow"></div>
              </div>
            </div>
            {/* Map Legend */}
            <div className="row g-3">
              <div className="col-md-2 col-6">
                <div className="d-flex align-items-center small">
                  <span className="legend-dot" style={{ backgroundColor: "#3b82f6" }}></span>
                  <span className="text-muted">En cours de livraison</span>
                </div>
              </div>
              <div className="col-md-2 col-6">
                <div className="d-flex align-items-center small">
                  <span className="legend-dot" style={{ backgroundColor: "#6b7280" }}></span>
                  <span className="text-muted">En attente</span>
                </div>
              </div>
              <div className="col-md-2 col-6">
                <div className="d-flex align-items-center small">
                  <span className="legend-dot" style={{ backgroundColor: "#10b981" }}></span>
                  <span className="text-muted">En ligne</span>
                </div>
              </div>
              <div className="col-md-2 col-6">
                <div className="d-flex align-items-center small">
                  <span className="legend-dot" style={{ backgroundColor: "#ef4444" }}></span>
                  <span className="text-muted">Hors ligne</span>
                </div>
              </div>
              <div className="col-md-2 col-6">
                <div className="d-flex align-items-center small">
                  <span className="legend-dot" style={{ backgroundColor: "#f59e0b" }}></span>
                  <span className="text-muted">Optimisé</span>
                </div>
              </div>
              <div className="col-md-2 col-6">
                <div className="d-flex align-items-center small">
                  <span className="legend-dot" style={{ backgroundColor: "#8b5cf6" }}></span>
                  <span className="text-muted">Itinéraire</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Ongoing Orders */}
        <div className="right-panel overflow-auto">
          <div className="p-3">
            <div className="d-flex align-items-center mb-4">
              <i className="bi bi-navigation me-2 text-muted"></i>
              <h5 className="mb-0 fw-semibold">Commandes en cours</h5>
            </div>
            <div className="d-flex flex-column gap-3">
              <div className="order-card p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="fw-semibold small">ORD001</span>
                  <span className="badge status-in-transit status-badge">En cours</span>
                </div>
                <div className="small text-muted">
                  <div className="mb-1"><strong>Client:</strong> John Doe</div>
                  <div className="mb-1"><strong>Livreur:</strong> Alice Smith</div>
                  <div><strong>ETA:</strong> 15:30</div>
                </div>
              </div>
              <div className="order-card p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="fw-semibold small">ORD003</span>
                  <span className="badge status-delayed status-badge">Retardé</span>
                </div>
                <div className="small text-muted">
                  <div className="mb-1"><strong>Client:</strong> Peter Jones</div>
                  <div className="mb-1"><strong>Livreur:</strong> Alice Smith</div>
                  <div><strong>ETA:</strong> 16:00</div>
                </div>
              </div>
              <div className="order-card p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="fw-semibold small">ORD004</span>
                  <span className="badge status-in-transit status-badge">En cours</span>
                </div>
                <div className="small text-muted">
                  <div className="mb-1"><strong>Client:</strong> Mary Lee</div>
                  <div className="mb-1"><strong>Livreur:</strong> Eve Adams</div>
                  <div><strong>ETA:</strong> 15:45</div>
                </div>
              </div>
              <div className="order-card p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="fw-semibold small">ORD005</span>
                  <span className="badge status-pending status-badge">En attente</span>
                </div>
                <div className="small text-muted">
                  <div className="mb-1"><strong>Client:</strong> David Green</div>
                  <div className="mb-1"><strong>Livreur:</strong> Frank White</div>
                  <div><strong>ETA:</strong> N/A</div>
                </div>
              </div>
              <div className="order-card p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="fw-semibold small">ORD006</span>
                  <span className="badge status-in-transit status-badge">En cours</span>
                </div>
                <div className="small text-muted">
                  <div className="mb-1"><strong>Client:</strong> Sarah Blue</div>
                  <div className="mb-1"><strong>Livreur:</strong> Bob Johnson</div>
                  <div><strong>ETA:</strong> 15:15</div>
                </div>
              </div>
              <div className="order-card p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="fw-semibold small">ORD007</span>
                  <span className="badge status-pending status-badge">En attente</span>
                </div>
                <div className="small text-muted">
                  <div className="mb-1"><strong>Client:</strong> Michael Red</div>
                  <div className="mb-1"><strong>Livreur:</strong> Non attribué</div>
                  <div><strong>ETA:</strong> N/A</div>
                </div>
              </div>
              <div className="order-card p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="fw-semibold small">ORD008</span>
                  <span className="badge status-delayed status-badge">Retardé</span>
                </div>
                <div className="small text-muted">
                  <div className="mb-1"><strong>Client:</strong> Emily White</div>
                  <div className="mb-1"><strong>Livreur:</strong> Eve Adams</div>
                  <div><strong>ETA:</strong> 17:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
  </>
);

export default GestionTrajet;