import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../const/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Garder autoTable pour le cas où tu voudrais un tableau rapide
import autoTable from 'jspdf-autotable';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Tab,
  Nav,
  Form,
  Table,
  Spinner,
  Alert,
} from 'react-bootstrap';

function BonsCommandePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [bonsHistory, setBonsHistory] = useState([]);
  const [filterClient, setFilterClient] = useState('');
  const [filterDateDebut, setFilterDateDebut] = useState('');
  const [filterDateFin, setFilterDateFin] = useState('');

  const [bonsPending, setBonsPending] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
    fetchPending();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(api('admin/bons-commande'));
      setBonsHistory(res.data);
    } catch {
      setError('Erreur lors du chargement de l’historique');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(api('admin/bons-commande/filtrer'), {
        clientId: filterClient || undefined,
        dateDebut: filterDateDebut || undefined,
        dateFin: filterDateFin || undefined,
      });
      setBonsHistory(res.data);
    } catch {
      setError('Erreur lors de l’application des filtres');
    } finally {
      setLoading(false);
    }
  };

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await axios.get(api('admin/bons-commande/non-valides'));
      setBonsPending(res.data);
    } catch {
      setError('Erreur lors du chargement des bons à valider');
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (bon) => {
    setLoading(true);
    try {
      const res = await axios.get(api(`admin/bons-commande/${bon.id}`));
      setSelected(res.data);
      setShowModal(true);
    } catch {
      alert('Erreur lors du chargement des détails');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (statut) => {
    if (!selected) return;
    setUpdateLoading(true);
    try {
      await axios.patch(api(`admin/bons-commande/${selected.id}/statut`), { statut });
      setShowModal(false);
      fetchPending();
      fetchHistory();
    } catch {
      alert("Erreur lors de la mise à jour du statut");
    } finally {
      setUpdateLoading(false);
    }
  };

const exportPDF = () => {
    const doc = new jsPDF();

    // Couleurs de la facture (inspirées de l'image)
    const black = '#222222';
    const lightGrey = '#F8F8F8';
    const borderGrey = '#CCCCCC';

    // Dimensions
    const pageMargin = 20; // Marge de chaque côté
    let yPos = 20; // Position Y de départ

    // --- En-tête de la facture ---
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(36);
    doc.setTextColor(black);
    doc.text('FACTURE', pageMargin, yPos);

    // Placeholder pour l'icône de soleil/engrenage (tu peux ajouter une image PNG si tu veux)
    doc.setDrawColor(black);
    doc.circle(doc.internal.pageSize.width - pageMargin - 5, yPos - 10, 8, 'S'); // Cercle simple pour simuler
    doc.setDrawColor(borderGrey); // Réinitialiser la couleur de dessin

    yPos += 20; // Espacement après le titre

    // Ligne de séparation sous le titre
    doc.setDrawColor(black);
    doc.setLineWidth(0.5);
    doc.line(pageMargin, yPos, doc.internal.pageSize.width - pageMargin, yPos);
    yPos += 10;

    // Numéro de facture et date (éléments avec fond gris clair)
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    
    // Style pour les "pilules" de numéro de facture et date
    const pillPadding = 3; // Padding interne pour le texte dans la "pilule"
    const pillHeight = 8;
    const pillRadius = 5;

    // Facture n°
    const factureNumText = `Facture n°${selected.id.substring(0, 8)}`; // Utilise l'ID du bon pour le numéro
    const factureNumWidth = doc.getTextWidth(factureNumText) + (pillPadding * 2);
    doc.setFillColor(lightGrey);
    doc.roundedRect(pageMargin, yPos - pillPadding, factureNumWidth, pillHeight + pillPadding * 2, pillRadius, pillRadius, 'F');
    doc.setTextColor(black);
    doc.text(factureNumText, pageMargin + pillPadding, yPos + pillPadding + 2); // Ajuste +2 pour le centrage vertical

    // Date
    const dateText = new Date(selected.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    const dateWidth = doc.getTextWidth(dateText) + (pillPadding * 2);
    doc.roundedRect(pageMargin + factureNumWidth + 10, yPos - pillPadding, dateWidth, pillHeight + pillPadding * 2, pillRadius, pillRadius, 'F');
    doc.text(dateText, pageMargin + factureNumWidth + 10 + pillPadding, yPos + pillPadding + 2);

    yPos += 25; // Espacement

    // --- Informations de l'entreprise (à gauche) ---
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(black);
    doc.text('SOTRO BE', pageMargin, yPos); // Nom de ton entreprise
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('123-456-7890', pageMargin, yPos + 5);
    doc.text('contact@sotro-be.com', pageMargin, yPos + 10);
    doc.text('www.sotro-be.com', pageMargin, yPos + 15);
    doc.text('123 Rue de l\'Exemple, Antananarivo', pageMargin, yPos + 20);

    // --- Informations du client (à droite) ---
    const clientName = selected.abonnement.client?.nom || 'Client inconnu';
    const clientContact = selected.abonnement.client?.contact || 'N/A';
    const clientAddress = selected.abonnement.client?.adresse || 'N/A'; // Assumes client object has an address

    const rightColX = doc.internal.pageSize.width - pageMargin - 60; // Ajuster pour alignement à droite

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('À L\'ATTENTION DE', rightColX, yPos, { align: 'right' });
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(clientName, rightColX, yPos + 5, { align: 'right' });
    doc.text(clientContact, rightColX, yPos + 10, { align: 'right' });
    doc.text(clientAddress, rightColX, yPos + 15, { align: 'right' });

    yPos += 35; // Espacement avant le tableau


    // --- Tableau des articles ---
    const tableStartY = yPos;
    const tableHeaderHeight = 10;
    const rowHeight = 8;
    const colWidths = {
      description: 60,
      prix: 30,
      quantite: 20,
      total: 30,
    };
    const tableX = pageMargin;

    // Largeur totale du tableau
    const tableWidth = Object.values(colWidths).reduce((a, b) => a + b, 0);

    // En-tête du tableau
    doc.setFillColor(black);
    doc.rect(tableX, tableStartY, tableWidth, tableHeaderHeight, 'F');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor('#FFFFFF'); // Texte blanc

    let currentX = tableX;
    doc.text('DESCRIPTION', currentX + 5, tableStartY + 6);
    currentX += colWidths.description;
    doc.text('PRIX', currentX + 5, tableStartY + 6);
    currentX += colWidths.prix;
    doc.text('QUANTITÉ', currentX + 5, tableStartY + 6);
    currentX += colWidths.quantite;
    doc.text('TOTAL', currentX + 5, tableStartY + 6);
    
    let currentY = tableStartY + tableHeaderHeight;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(black);

    let subTotal = 0;

    selected.selectionsHebdomadaires.forEach((sel, index) => {
        const jour = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'][sel.jourSemaine - 1];
        const description = `${jour}: ${sel.menu?.nom || ''} + ${sel.accompagnement?.nom || ''}`;
        const prixUnitaire = parseFloat(sel.menu?.prixCarte || 0);
        const quantite = sel.quantite;
        const ligneTotal = prixUnitaire * quantite;
        subTotal += ligneTotal;

        doc.setDrawColor(borderGrey);
        doc.setLineWidth(0.1);
        doc.rect(tableX, currentY, tableWidth, rowHeight, 'S'); // Cellule de la ligne

        currentX = tableX;
        doc.text(description, currentX + 5, currentY + rowHeight / 2 + 1); // +1 pour centrage vertical
        currentX += colWidths.description;
        doc.text(`${prixUnitaire.toFixed(2)} Ar`, currentX + 5, currentY + rowHeight / 2 + 1);
        currentX += colWidths.prix;
        doc.text(quantite.toString(), currentX + 5, currentY + rowHeight / 2 + 1);
        currentX += colWidths.quantite;
        doc.text(`${ligneTotal.toFixed(2)} Ar`, currentX + 5, currentY + rowHeight / 2 + 1);

        currentY += rowHeight;
    });

    yPos = currentY + 10; // Espacement après le tableau

    // --- Totaux ---
    const totalsColX = doc.internal.pageSize.width - pageMargin - colWidths.total; // Aligne les totaux à droite
    const totalsLabelX = totalsColX - 30; // Position des labels (Sous total, TVA, Total)

    // Sous total
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(black);
    doc.text('Sous total :', totalsLabelX, yPos, { align: 'right' });
    doc.text(`${subTotal.toFixed(2)} Ar`, totalsColX, yPos, { align: 'left' });
    yPos += 8;

    // TVA (exemple, tu peux l'ajuster ou la calculer si elle n'est pas dans les données)
    const tvaRate = 0.20; // 20%
    const tvaAmount = subTotal * tvaRate;
    doc.text('TVA (20%) :', totalsLabelX, yPos, { align: 'right' });
    doc.text(`${tvaAmount.toFixed(2)} Ar`, totalsColX, yPos, { align: 'left' });
    yPos += 10;

    // Ligne de séparation pour le total
    doc.setDrawColor(borderGrey);
    doc.line(totalsLabelX, yPos - 2, doc.internal.pageSize.width - pageMargin, yPos - 2); // Ligne au-dessus du total

    // Total final
    const finalTotal = subTotal + tvaAmount;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setFillColor(black);
    doc.rect(totalsLabelX - 5, yPos, doc.internal.pageSize.width - pageMargin - totalsLabelX + 10, 10, 'F'); // Rectangle noir de fond
    doc.setTextColor('#FFFFFF'); // Texte blanc
    doc.text('TOTAL :', totalsLabelX, yPos + 7, { align: 'right' });
    doc.text(`${finalTotal.toFixed(2)} Ar`, totalsColX, yPos + 7, { align: 'left' });

    yPos += 30; // Espacement

    // --- Informations de paiement et conditions ---
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(black);

    // Paiement à l'ordre de
    doc.text('Paiement à l\'ordre de Sotro Be', pageMargin, yPos);
    doc.text('N° de compte 1234 5678 9012 3456', pageMargin, yPos + 5); // Remplace par ton vrai numéro de compte

    // Conditions de paiement
    doc.text('Conditions de paiement', rightColX, yPos, { align: 'right' });
    doc.text('Paiement sous 30 jours', rightColX, yPos + 5, { align: 'right' });

    yPos += 20;

    // --- Message de remerciement ---
    doc.setFont('Helvetica', 'bold');
    doc.text('MERCI DE VOTRE CONFIANCE', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 20, { align: 'center' });

    doc.save(`facture-${selected.id.substring(0, 8)}.pdf`);
};


  const renderBonCard = (bon, pending = false) => {
    const client = bon.abonnement?.client;
    return (
      <Col key={bon.id} lg={4} className="mb-3">
        <Card
          className="shadow-sm"
          style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onClick={() => openDetail(bon)}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Card.Body>
            <Card.Title style={{ color: '#333' }}>
              {client ? `${client.nom}` : bon.abonnementId.substring(0,8) + '...'}
            </Card.Title>
            <Card.Text style={{ color: '#555', fontSize: '0.9rem' }}>
              Semaine : {bon.semaineDebut} → {bon.semaineFin}<br/>
              Statut : <strong>{bon.statut}</strong><br/>
              Créé : {new Date(bon.createdAt).toLocaleDateString()}
            </Card.Text>
            {pending && <Button variant="outline-primary" size="sm">Voir / Traiter</Button>}
          </Card.Body>
        </Card>
      </Col>
    );
  };

  return (
    <Container className="py-4">
      <h2 className="fw-bold mb-4 text-primary">Bons de commande</h2>
      <Tab.Container defaultActiveKey="history">
        <Nav variant="tabs">
          <Nav.Item><Nav.Link eventKey="history">Historique</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="pending">À valider</Nav.Link></Nav.Item>
        </Nav>

        <Tab.Content className="mt-4">
          <Tab.Pane eventKey="history">
            {/* Filtres */}
            <Form className="mb-4" onSubmit={handleFilter}>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Control
                    placeholder="Client ID"
                    value={filterClient}
                    onChange={e => setFilterClient(e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="date"
                    value={filterDateDebut}
                    onChange={e => setFilterDateDebut(e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="date"
                    value={filterDateFin}
                    onChange={e => setFilterDateFin(e.target.value)}
                  />
                </Col>
                <Col md={2}>
                  <Button type="submit" variant="primary">Filtrer</Button>
                </Col>
              </Row>
            </Form>

            {loading ? <Spinner /> :
              error ? <Alert variant="danger">{error}</Alert> :
              bonsHistory.length === 0 ? <Card className="p-4 text-muted">Aucun bon trouvé.</Card> :
              <Row>{bonsHistory.map(bon => renderBonCard(bon))}</Row>}
          </Tab.Pane>

          <Tab.Pane eventKey="pending">
            {loading ? <Spinner /> :
              error ? <Alert variant="danger">{error}</Alert> :
              bonsPending.length === 0 ? <Card className="p-4 text-muted">Aucun bon en attente.</Card> :
              <Row>{bonsPending.map(bon => renderBonCard(bon, true))}</Row>}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Modal détails */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails du bon de commande</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected ? (
            <>
              <p><strong>Client :</strong> {selected.abonnement.client?.nom}</p>
              <p><strong>Semaine :</strong> {selected.semaineDebut} → {selected.semaineFin}</p>
              <Table size="sm" bordered>
                <thead>
                  <tr>
                    <th>Jour</th><th>Menu</th><th>Accompagnement</th><th>Quantité</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.selectionsHebdomadaires.map(sel => (
                    <tr key={sel.id}>
                      <td>{['Lun','Mar','Mer','Jeu','Ven'][sel.jourSemaine - 1]}</td>
                      <td>{sel.menu?.nom}</td>
                      <td>{sel.accompagnement?.nom}</td>
                      <td>{sel.quantite}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          ) : (
            <Spinner animation="border" />
          )}
        </Modal.Body>
        <Modal.Footer>
          {selected?.statut === 'EN_ATTENTE' && (
            <>
              <Button variant="success" onClick={() => updateStatus('VALIDE')} disabled={updateLoading}>Valider</Button>
              <Button variant="danger" onClick={() => updateStatus('REFUSE')} disabled={updateLoading}>Refuser</Button>
            </>
          )}
          <Button variant="outline-dark" onClick={exportPDF}>Exporter PDF</Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default BonsCommandePage;