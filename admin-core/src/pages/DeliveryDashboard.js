import React, { useState } from 'react';
import { Search, Bell, Settings, User, MapPin, Phone, Package, ChevronDown, MessageSquare, Edit } from 'lucide-react';

const DeliveryDashboard = () => {
  const [selectedOrder, setSelectedOrder] = useState('FD-1001');
  const [activeTab, setActiveTab] = useState('ready');

  const orders = [
    {
      id: 'FD-1001',
      customer: 'Alice Johnson',
      address: '123 Maple Dr, Springfield',
      time: '10:30 AM',
      status: 'Pending'
    },
    {
      id: 'FD-1003',
      customer: 'Carol White',
      address: '789 Oak Ave, Capital City',
      time: '11:45 AM',
      status: 'Pending'
    },
    {
      id: 'FD-1005',
      customer: 'Eve Miller',
      address: '50 Elm St, Rivertown',
      time: '01:00 PM',
      status: 'Pending'
    }
  ];

  const selectedOrderData = orders.find(order => order.id === selectedOrder);

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
        <div className="navbar-brand d-flex align-items-center">
          <div className="bg-primary rounded me-2 p-2">
            <Package className="text-white" size={24} />
          </div>
          <span className="fw-bold fs-4">FastDeliver</span>
        </div>
        
        <div className="d-flex align-items-center ms-auto">
          <div className="input-group me-3" style={{width: '300px'}}>
            <span className="input-group-text bg-transparent border-end-0">
              <Search size={16} className="text-muted" />
            </span>
            <input 
              type="text" 
              className="form-control border-start-0" 
              placeholder="Search orders or customers..."
            />
          </div>
          <button className="btn btn-outline-secondary me-2">
            <Bell size={18} />
          </button>
          <button className="btn btn-outline-secondary me-2">
            <Settings size={18} />
          </button>
          <button className="btn btn-primary">
            <User size={18} />
          </button>
        </div>
      </nav>

      <div className="container-fluid mt-4">
        <div className="row">
          {/* Left Panel - Orders List */}
          <div className="col-md-5">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-3">Delivery Orders</h5>
                <ul className="nav nav-pills">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'ready' ? 'active' : ''}`}
                      onClick={() => setActiveTab('ready')}
                    >
                      Ready for Delivery
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'out' ? 'active' : ''}`}
                      onClick={() => setActiveTab('out')}
                    >
                      Out for Delivery
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'delivered' ? 'active' : ''}`}
                      onClick={() => setActiveTab('delivered')}
                    >
                      Delivered
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Customer / Address</th>
                        <th>Due Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr 
                          key={order.id}
                          className={selectedOrder === order.id ? 'table-active' : ''}
                          style={{cursor: 'pointer'}}
                          onClick={() => setSelectedOrder(order.id)}
                        >
                          <td className="fw-bold">{order.id}</td>
                          <td>
                            <div>
                              <div className="fw-semibold">{order.customer}</div>
                              <small className="text-muted">{order.address}</small>
                            </div>
                          </td>
                          <td>{order.time}</td>
                          <td>
                            <span className="badge bg-warning text-dark">
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">
                              →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Order Details */}
          <div className="col-md-7">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5>Order #{selectedOrder}</h5>
              </div>
              <div className="card-body">
                {/* Customer & Delivery Section */}
                <div className="mb-4">
                  <h6 className="text-primary mb-3">
                    <User size={16} className="me-2" />
                    Customer & Delivery
                  </h6>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <User size={16} className="text-muted me-2" />
                        <span className="fw-semibold">{selectedOrderData?.customer}</span>
                      </div>
                      <div className="d-flex align-items-start mb-2">
                        <MapPin size={16} className="text-muted me-2 mt-1" />
                        <span className="text-muted">{selectedOrderData?.address}</span>
                      </div>
                      <div className="text-muted small mb-3">
                        <strong>Drop-off Notes:</strong> Leave at front door, no knock please.
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-3">
                        <Phone size={16} className="text-muted me-2" />
                        <span>555-0101</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Preview */}
                <div className="mb-4">
                  <div className="bg-light rounded p-5 text-center">
                    <MapPin size={48} className="text-muted mb-2" />
                    <div className="text-muted">Map Preview</div>
                  </div>
                </div>

                {/* Order Contents */}
                <div className="mb-4">
                  <h6 className="text-primary mb-3">
                    <Package size={16} className="me-2" />
                    Order Contents
                  </h6>
                  <button className="btn btn-outline-secondary btn-sm">
                    <ChevronDown size={14} className="me-1" />
                    View Details
                  </button>
                </div>

                {/* Preparation Notes */}
                <div className="mb-4">
                  <button className="btn btn-outline-secondary btn-sm">
                    <ChevronDown size={14} className="me-1" />
                    Preparation Notes
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-secondary flex-fill">
                    <MessageSquare size={16} className="me-2" />
                    Change Status
                  </button>
                  <button className="btn btn-primary flex-fill">
                    ✓ Confirm Delivery
                  </button>
                </div>
                
                <div className="mt-2">
                  <button className="btn btn-outline-secondary btn-sm">
                    <Edit size={14} className="me-1" />
                    Modify Delivery Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-5 py-3 bg-white border-top">
        <div className="container-fluid">
          <div className="text-muted small">
            © 2023 FastDeliver Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DeliveryDashboard;