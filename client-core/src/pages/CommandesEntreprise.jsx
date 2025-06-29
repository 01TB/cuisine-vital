import { useState } from 'react';
import { Container, Form, Button, Table } from 'react-bootstrap';

function CommandesEntreprise() {
  const [bonCommande, setBonCommande] = useState({
    semaine: '',
    menus: { lundi: 0, mardi: 0, mercredi: 0, jeudi: 0, vendredi: 0 },
  });
  const [historique, setHistorique] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setHistorique([...historique, { ...bonCommande, dateSoumission: new Date().toISOString().split('T')[0] }]);
    setBonCommande({ semaine: '', menus: { lundi: 0, mardi: 0, mercredi: 0, jeudi: 0, vendredi: 0 } });
  };

  return (
    <Container className="mt-4">
      <h2>Commandes Entreprise</h2>
      <h3>Bon de Commande Hebdomadaire</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Semaine (ex. 2025-07-07)</Form.Label>
          <Form.Control type="date" value={bonCommande.semaine} onChange={e => setBonCommande({ ...bonCommande, semaine: e.target.value })} min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} />
        </Form.Group>
        {Object.keys(bonCommande.menus).map(day => (
          <Form.Group key={day} className="mb-3">
            <Form.Label>{day.charAt(0).toUpperCase() + day.slice(1)}</Form.Label>
            <Form.Control type="number" min="0" value={bonCommande.menus[day]} onChange={e => setBonCommande({
              ...bonCommande,
              menus: { ...bonCommande.menus, [day]: e.target.value }
            })} />
          </Form.Group>
        ))}
        <Button variant="primary" type="submit">Soumettre le Bon</Button>
      </Form>
      <h3>Historique</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Semaine</th>
            <th>Lundi</th>
            <th>Mardi</th>
            <th>Mercredi</th>
            <th>Jeudi</th>
            <th>Vendredi</th>
            <th>Date de Soumission</th>
          </tr>
        </thead>
        <tbody>
          {historique.map((hc, idx) => (
            <tr key={idx}>
              <td>{hc.semaine}</td>
              <td>{hc.menus.lundi}</td>
              <td>{hc.menus.mardi}</td>
              <td>{hc.menus.mercredi}</td>
              <td>{hc.menus.jeudi}</td>
              <td>{hc.menus.vendredi}</td>
              <td>{hc.dateSoumission}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="success" className="mt-3">Payer</Button>
    </Container>
  );
}

export default CommandesEntreprise;