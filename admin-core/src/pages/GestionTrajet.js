import React, { useState } from 'react';

const GestionTrajet = () => {
  const [deliverers] = useState(3);
  const [activeDeliveries] = useState(5);
  const [avgDeliveryTime] = useState('35 min');

  const delivererStatus = [
    { label: 'Online', count: 3 },
    { label: 'In Delivery', count: 2 },
    { label: 'Offline', count: 1 },
    { label: 'Total Active Deliveries', count: 5 },
  ];

  const ongoingOrders = [
    { id: 'ORD001', customer: 'John Doe', deliverer: 'Alice Smith', status: 'In-transit', eta: '15:30' },
    { id: 'ORD003', customer: 'Peter Jones', deliverer: 'Alice Smith', status: 'Delayed', eta: '16:00' },
    { id: 'ORD004', customer: 'Mary Lee', deliverer: 'Eve Adams', status: 'In-transit', eta: '15:45' },
    { id: 'ORD005', customer: 'David Green', deliverer: 'Frank White', status: 'Pending', eta: 'N/A' },
    { id: 'ORD006', customer: 'Sarah Blue', deliverer: 'Bob Johnson', status: 'In-transit', eta: '15:15' },
    { id: 'ORD007', customer: 'Michael Red', deliverer: 'Unassigned', status: 'Pending', eta: 'N/A' },
    { id: 'ORD008', customer: 'Emily White', deliverer: 'Eve Adams', status: 'Delayed', eta: '17:00' },
  ];

  return (
    <div className="d-flex flex-column vh-100">
      {/* Header */}
      <div className="bg-light p-3 d-flex justify-content-between align-items-center border-bottom">
        <h2>Gestion des trajets</h2>
        <div className="user-info d-flex align-items-center">
          <img src="https://via.placeholder.com/40" alt="User" className="rounded-circle me-2" />
          <span>Tsitohaina Berthin</span>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar (Left) - Gestion du menu */}
        <div className="bg-light p-3" style={{ width: '250px', minWidth: '250px' }}>
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link" href="#">Commandes</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Gestion du menu</a>
              <ul className="nav flex-column ms-3">
                <li className="nav-item"><a className="nav-link" href="#">Plats</a></li>
                <li className="nav-item"><a className="nav-link" href="#">Catégories</a></li>
                <li className="nav-item"><a className="nav-link" href="#">Ajouter un nouveau plat</a></li>
                <li className="nav-item"><a className="nav-link" href="#">Promotions</a></li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Gestion de la cuisine</a>
              <ul className="nav flex-column ms-3">
                <li className="nav-item">
                  <a className="nav-link active" href="#">Ingrédients</a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Statistiques & Analyses</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Paramètres</a>
            </li>
          </ul>
        </div>

        {/* Main Content (Middle) - Total Active Deliveries and Map */}
        <div className="flex-grow-1 p-3">
          <div className="row row-cols-1 row-cols-md-4 g-3 mb-4">
            <div className="col">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-truck"></i>
                  <h5>Total Active Deliveries</h5>
                  <p>{activeDeliveries}</p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-person"></i>
                  <h5>Deliverers Online</h5>
                  <p>{deliverers}</p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-clock"></i>
                  <h5>Avg. Delivery Time</h5>
                  <p>{avgDeliveryTime}</p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card h-100">
                <div className="card-body">
                  <h5>Deliverer Status</h5>
                  {delivererStatus.map((item, index) => (
                    <p key={index}><span className="badge bg-success">{item.label}</span> {item.count}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="map-section mb-4">
            <div className="map">
              <img src="https://via.placeholder.com/600x400" alt="Map" className="img-fluid" />
              <div className="map-legend mt-2">
                <p><span className="dot in-transit"></span> In-Transit Order</p>
                <p><span className="dot pending"></span> Pending Order</p>
                <p><span className="dot online"></span> Online Deliverer</p>
                <p><span className="dot offline"></span> Offline Deliverer</p>
                <p><span className="dot optimized"></span> Optimized Route</p>
                <p><span className="dot trajectory"></span> Deliverer Trajectory</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Ongoing Orders */}
        <div className="p-3" style={{ width: '300px', minWidth: '300px' }}>
          <h5>Ongoing Orders</h5>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Deliverer</th>
                <th>Status</th>
                <th>ETA</th>
              </tr>
            </thead>
            <tbody>
              {ongoingOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.deliverer}</td>
                  <td><span className={`badge bg-${order.status.toLowerCase().replace(' ', '-')}`}>{order.status}</span></td>
                  <td>{order.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Inline styles for dots
  const styles = `
    .dot { height: 10px; width: 10px; border-radius: 50%; display: inline-block; margin-right: 5px; }
    .in-transit { background-color: blue; }
    .pending { background-color: gray; }
    .online { background-color: green; }
    .offline { background-color: red; }
    .optimized { background-color: orange; }
    .trajectory { background-color: purple; }
  `;
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
};

export default GestionTrajet;