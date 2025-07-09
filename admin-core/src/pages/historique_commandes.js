import React, { useEffect, useState } from 'react';
import api from '../const/api';
import axios from 'axios';

const HistoriqueCommandes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(api('admin/commandes/historique'));
        setData(res.data);
      } catch (err) {
        console.error('Erreur détaillée:', err);
        if (err.code === 'ERR_NETWORK') {
          setError('Erreur de réseau: Vérifiez que le backend est démarré et accessible');
        } else if (err.response) {
          setError(`Erreur ${err.response.status}: ${err.response.data?.message || 'Erreur serveur'}`);
        } else {
          setError('Erreur lors du chargement de l\'historique: ' + err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMontant = (montant) => {
    return montant ? `${parseFloat(montant).toFixed(2)} €` : '0.00 €';
  };

  const getStatutBadge = (statut) => {
    const badges = {
      'EN_ATTENTE': 'badge bg-warning',
      'EN_PREPARATION': 'badge bg-info',
      'PRETE': 'badge bg-primary',
      'EN_LIVRAISON': 'badge bg-warning',
      'LIVREE': 'badge bg-success',
      'ANNULEE': 'badge bg-danger'
    };
    return badges[statut] || 'badge bg-secondary';
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Erreur!</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            <strong>Solutions possibles:</strong>
            <ul>
              <li>Vérifiez que le backend NestJS est démarré sur le port 3000</li>
              <li>Configurez CORS dans votre backend NestJS</li>
              <li>Vérifiez l'URL de l'API</li>
            </ul>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Historique des commandes</h2>
      
      {data.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          Aucune commande trouvée dans l'historique.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>N° Commande</th>
                <th>Type</th>
                <th>Client</th>
                <th>Statut</th>
                <th>Date Commande</th>
                <th>Date Livraison</th>
                <th>Montant</th>
                <th>Livreur</th>
              </tr>
            </thead>
            <tbody>
              {data.map((commande) => (
                <tr key={commande.commande_id}>
                  <td>
                    <code>{commande.numero_commande}</code>
                  </td>
                  <td>
                    <span className={`badge ${commande.type_commande === 'ENTREPRISE' ? 'bg-primary' : 'bg-secondary'}`}>
                      {commande.type_commande}
                    </span>
                  </td>
                  <td>{commande.client_nom}</td>
                  <td>
                    <span className={getStatutBadge(commande.statut_nom)}>
                      {commande.statut_nom.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{formatDate(commande.date_commande)}</td>
                  <td>{formatDate(commande.date_livraison)}</td>
                  <td>
                    <strong>{formatMontant(commande.montant_total)}</strong>
                  </td>
                  <td>{commande.livreur_nom || 'Non assigné'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-3">
            <small className="text-muted">
              Total: {data.length} commande{data.length > 1 ? 's' : ''}
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoriqueCommandes;