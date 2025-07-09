import { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import axios from 'axios';

function Stocks() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/stocks')
      .then(response => setStocks(response.data))
      .catch(error => console.error('Erreur lors de la récupération des stocks:', error));
  }, []);

  const handleValidate = (stockId) => {
    axios.put(`http://localhost:3000/api/stocks/${stockId}/validate`)
      .then(() => {
        setStocks(stocks.map(stock =>
          stock.id === stockId ? { ...stock, validated: true } : stock
        ));
      })
      .catch(error => console.error('Erreur lors de la validation:', error));
  };

  return (
    <Container className="mt-4">
      <h2>Gestion des Stocks</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Fournisseur</th>
            <th>Validé</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(stock => (
            <tr key={stock.id}>
              <td>{stock.product}</td>
              <td>{stock.quantity}</td>
              <td>{stock.supplier}</td>
              <td>{stock.validated ? 'Oui' : 'Non'}</td>
              <td>
                {!stock.validated && (
                  <Button variant="success" onClick={() => handleValidate(stock.id)}>
                    Valider
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default Stocks;