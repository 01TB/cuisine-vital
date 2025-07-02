import React, { useState } from 'react';

const MenuItemEditor = () => {
  const [itemName, setItemName] = useState('Ravitoto au coco sy Hena Kisoa');
  const [description, setDescription] = useState('Freshly sliced sashimi-grade tuna mixed with a zesty, spicy aioli, crisp cucumber, and creamy avocado; rolled in seasoned sushi rice and nori. Garnished with toasted sesame seeds and a drizzle of sriracha.');
  const [price, setPrice] = useState('15,000');
  const [ingredients, setIngredients] = useState([
    { name: 'Ravitoto', qty: 150, unit: 'g' },
    { name: 'Lait de coco', qty: 0.5, unit: 'L' },
    { name: 'Hena kisoa', qty: 3, unit: 'sheet' },
    { name: '', qty: 0.5, unit: 'medium' },
    { name: '', qty: 0.5, unit: 'large' },
    { name: '', qty: 2, unit: 'tbsp' },
    { name: '', qty: '', unit: '' },
    { name: '', qty: 'optional', unit: 'Unit' }
  ]);
  const [prepTime, setPrepTime] = useState('-- minutes');
  const [cookTime, setCookTime] = useState('0 minutes');
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', qty: '', unit: '' }]);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Bootstrap CSS CDN */}
      <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      
      {/* Sidebar */}
      <div className="bg-white border-end" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <div className="d-flex align-items-center mb-4">
            <i className="fas fa-bars me-2 text-muted"></i>
            <span className="text-muted small">Commandes</span>
          </div>
          
          <div className="mb-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small">
                <i className="fas fa-utensils me-2"></i>
                Gestion du menu
              </span>
              <i className="fas fa-chevron-down text-muted small"></i>
            </div>
            <div className="ms-3">
              <div className="py-1 text-primary small fw-medium">Plats</div>
              <div className="py-1 text-muted small">Catégories</div>
            </div>
          </div>

          <div className="small text-muted">
            <div className="py-2">Ajouter un nouveau plat</div>
            <div className="py-2">Abonnements</div>
            <div className="py-2 d-flex align-items-center">
              <i className="far fa-circle me-2"></i>
              Gestion de la cuisine
              <i className="fas fa-chevron-right ms-auto small"></i>
            </div>
            <div className="py-2 d-flex align-items-center">
              <i className="far fa-circle me-2"></i>
              Ingrédients
            </div>
            <div className="py-2 d-flex align-items-center">
              <i className="fas fa-chart-bar me-2"></i>
              Statistiques & Analyses
            </div>
            <div className="py-2 d-flex align-items-center">
              <i className="fas fa-cog me-2"></i>
              Paramètres
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Header */}
        <div className="bg-white border-bottom p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Modifier: <span className="text-primary">{itemName}</span></h5>
            <div>
              <button className="btn btn-outline-secondary btn-sm me-2">
                <i className="fas fa-eye me-1"></i>
                View Page
              </button>
              <button className="btn btn-danger btn-sm me-2">
                <i className="fas fa-trash me-1"></i>
                Delete
              </button>
              <button className="btn btn-primary btn-sm">
                <i className="fas fa-save me-1"></i>
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="row g-0">
          {/* Left Column */}
          <div className="col-md-8 p-4">
            {/* Basic Information */}
            <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
              <h6 className="fw-bold mb-3">Basic Information</h6>
              <p className="text-muted small mb-3">Core details of this menu item.</p>
              
              <div className="mb-3">
                <label className="form-label small fw-medium">Item Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={itemName} 
                  onChange={(e) => setItemName(e.target.value)} 
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label small fw-medium">Description</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-medium">Price</label>
                  <div className="input-group">
                    <span className="input-group-text">Ar</span>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)} 
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-medium">Category</label>
                  <select className="form-select">
                    <option>-----</option>
                  </select>
                </div>
              </div>
              
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  checked={isMenuVisible}
                  onChange={(e) => setIsMenuVisible(e.target.checked)}
                />
                <label className="form-check-label small">
                  Disponible au menu
                </label>
                <div className="form-check form-switch float-end">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    checked={isMenuVisible}
                    onChange={(e) => setIsMenuVisible(e.target.checked)}
                  />
                </div>
              </div>
              <small className="text-muted">Toggle to show/hide on public menu.</small>
            </div>

            {/* Image Section */}
            <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
              <h6 className="fw-bold mb-3">Image du plat</h6>
              <p className="text-muted small mb-3">Upload a high-quality image of this menu item.</p>
              
              <div className="text-center">
              <img 
                    src="ravitoto1.jpg" 
                    alt="Ravitoto dish" 
                    className="img-fluid rounded mb-2"
                    style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }}
                  />
                <p className="text-muted small">Recommended size: 800x600 pixels</p>
              </div>
            </div>

            {/* Preparation & Cooking */}
            <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
              <h6 className="fw-bold mb-3">Preparation & Cooking</h6>
              <p className="text-muted small mb-3">Estimated times and detailed instructions.</p>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Preparation Time</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={prepTime} 
                    onChange={(e) => setPrepTime(e.target.value)} 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Cooking Time</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={cookTime} 
                    onChange={(e) => setCookTime(e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label small fw-medium">Cooking Instructions</label>
                <textarea 
                  className="form-control" 
                  rows="4"
                  defaultValue="Faire revenir la viande :
Dans une grande marmite ou cocotte, chauffer un peu d'huile.
Ajouter la viande de porc et la faire revenir jusqu'à ce qu'elle soit dorée sur toutes ses faces.
Ajouter l'ail, le gingembre et l'oignon si utilisé. Faire revenir encore 2 à 3 minutes.
Ajouter le ravitoto :
Incorporer les feuilles de manioc pilées à la viande.
Bien mélanger pour que tout s'imprègne de l'huile et des arômes.
Voir plus..."
                ></textarea>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
              <h6 className="fw-bold mb-3">Performance Overview</h6>
              <p className="text-muted small mb-3">Quick insights into this menu item's sales.</p>
              
              <div className="row text-center">
                <div className="col-md-6">
                  <div className="p-3">
                    <i className="fas fa-shopping-cart fa-2x text-primary mb-2"></i>
                    <h4 className="fw-bold">1245</h4>
                    <small className="text-muted">Times Ordered</small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3">
                    <i className="fas fa-star fa-2x text-warning mb-2"></i>
                    <h4 className="fw-bold">4.7/5</h4>
                    <small className="text-muted">Average Rating</small>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-3">
                <small className="text-muted">For detailed analytics, visit the Reports section.</small>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-4 p-4" style={{ backgroundColor: '#f8f9fa' }}>
            {/* Ingredients */}
            <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
              <h6 className="fw-bold mb-3">Ingredients</h6>
              <p className="text-muted small mb-3">List all ingredients with their quantities.</p>
              
              <div className="row small fw-medium text-muted mb-2">
                <div className="col-5">Name</div>
                <div className="col-3">Qty</div>
                <div className="col-3">Unit</div>
                <div className="col-1"></div>
              </div>
              
              {ingredients.map((ing, index) => (
                <div key={index} className="row mb-2 align-items-center">
                  <div className="col-5">
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      value={ing.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      placeholder="-------"
                    />
                  </div>
                  <div className="col-3">
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      value={ing.qty}
                      onChange={(e) => handleIngredientChange(index, 'qty', e.target.value)}
                    />
                  </div>
                  <div className="col-3">
                    <select 
                      className="form-select form-select-sm"
                      value={ing.unit}
                      onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    >
                      <option value="">Unit</option>
                      <option value="g">g</option>
                      <option value="L">L</option>
                      <option value="sheet">sheet</option>
                      <option value="medium">medium</option>
                      <option value="large">large</option>
                      <option value="tbsp">tbsp</option>
                    </select>
                  </div>
                  <div className="col-1">
                    <button 
                      className="btn btn-link btn-sm text-danger p-0"
                      onClick={() => removeIngredient(index)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              ))}
              
              <button 
                className="btn btn-link btn-sm text-primary p-0 mt-2"
                onClick={handleAddIngredient}
              >
                <i className="fas fa-plus me-1"></i>
                Add Ingredient
              </button>
            </div>

            {/* Nutritional Information */}
            <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
              <h6 className="fw-bold mb-3">Nutritional Information</h6>
              <p className="text-muted small mb-3">Detailed facts per serving.</p>
              
              <button className="btn btn-outline-primary btn-sm">
                View Full Nutritional Details <i className="fas fa-chevron-down ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemEditor;