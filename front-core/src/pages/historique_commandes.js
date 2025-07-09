import React, { useEffect, useState } from 'react';
import api from '../const/api';
import axios from 'axios';
import {
  FaBoxOpen,
  FaTruck,
  FaUser,
  FaSpinner,
  FaExclamationTriangle,
  FaClipboardList
} from 'react-icons/fa';

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
    return new Date(dateString).toLocaleString('fr-FR', {
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
    const pastelMap = {
      'EN_ATTENTE': 'bg-warning bg-opacity-25 text-warning',
      'EN_PREPARATION': 'bg-info bg-opacity-25 text-info',
      'PRETE': 'bg-primary bg-opacity-25 text-primary',
      'EN_LIVRAISON': 'bg-warning bg-opacity-25 text-warning',
      'LIVREE': 'bg-success bg-opacity-25 text-success',
      'ANNULEE': 'bg-danger bg-opacity-25 text-danger',
    };
    const colorClass = pastelMap[statut] || 'bg-secondary bg-opacity-25 text-secondary';
    return `badge rounded-pill px-3 py-2 ${colorClass}`;
  };

  return (
    <div className="container mt-5">
      <div className="card rounded-4 p-4 border-0 bg-light-subtle">
        <h3 className="mb-4 text-primary d-flex align-items-center">
          <FaClipboardList className="me-2" />
          Historique des commandes
        </h3>

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <FaSpinner className="fa-spin text-primary" size={40} />
          </div>
        ) : error ? (
          <div className="alert alert-danger shadow-sm rounded-3 bg-danger bg-opacity-10 text-danger">
            <h5 className="alert-heading">
              <FaExclamationTriangle className="me-2" />Erreur
            </h5>
            <p>{error}</p>
            <hr />
            <ul className="mb-0">
              <li>Backend NestJS doit être actif</li>
              <li>Configurer CORS si besoin</li>
              <li>Vérifier l’URL API</li>
            </ul>
          </div>
        ) : (
          <>
            {data.length === 0 ? (
              <div className="alert alert-info shadow-sm rounded-3 bg-info bg-opacity-10 text-info">
                <FaBoxOpen className="me-2" />
                Aucune commande trouvée dans l'historique.
              </div>
            ) : (
              <>
                <div className="table-responsive rounded-4 shadow-sm">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th><FaUser className="me-1" />Client</th>
                        <th>Statut</th>
                        <th>Commande</th>
                        <th>Livraison</th>
                        <th>Montant</th>
                        <th><FaTruck className="me-1" />Livreur</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((commande) => (
                        <tr key={commande.commande_id}>
                          <td><code>{commande.numero_commande}</code></td>
                          <td>
                            <span className={`badge rounded-pill px-3 py-2 ${commande.type_commande === 'ENTREPRISE'
                              ? 'bg-primary bg-opacity-25 text-primary'
                              : 'bg-secondary bg-opacity-25 text-secondary'
                              }`}>
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
                            <strong className="text-success">{formatMontant(commande.montant_total)}</strong>
                          </td>
                          <td>{commande.livreur_nom || <em className="text-muted">Non assigné</em>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 text-muted text-end">
                  Total : <strong>{data.length}</strong> commande{data.length > 1 ? 's' : ''}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HistoriqueCommandes;
