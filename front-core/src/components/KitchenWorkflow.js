import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../const/api';
import { ChefHat, Clock, CheckCircle, Truck } from 'lucide-react';

const KitchenWorkflow = () => {
  const [statuts, setStatuts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatuts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(api('admin/commandes/statuts'));
        setStatuts(res.data);
      } catch (err) {
        setError('Erreur de chargement du workflow');
      } finally {
        setLoading(false);
      }
    };
    fetchStatuts();
  }, []);

  // Filtrage des statuts
  const enPreparation = statuts.find(s => s.statut === 'EN_PREPARATION');
  const prete = statuts.find(s => s.statut === 'PRETE');
  const livree = statuts.find(s => s.statut === 'LIVREE');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ChefHat className="w-6 h-6 text-amber-500" />
        <h1 className="text-xl font-bold">Workflow Cuisine</h1>
      </div>

      {loading ? (
        <div className="text-center py-8">Chargement en cours...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Carte En préparation */}
          <div className="flex-1 border border-amber-100 bg-amber-50 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="font-semibold text-gray-800">En préparation</h2>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-gray-900">
                {enPreparation?.totalCommandes || 0}
              </span>
              <span className="text-sm text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                {enPreparation?.totalCommandes || 0} commandes
              </span>
            </div>
          </div>

          {/* Carte Prêtes */}
          <div className="flex-1 border border-green-100 bg-green-50 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="font-semibold text-gray-800">Prêtes</h2>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-gray-900">
                {prete?.totalCommandes || 0}
              </span>
              <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                En attente de livraison
              </span>
            </div>
          </div>

          {/* Carte Livrées */}
          <div className="flex-1 border border-blue-100 bg-blue-50 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="font-semibold text-gray-800">Livrées</h2>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-gray-900">
                {livree?.totalCommandes || 0}
              </span>
              <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                Aujourd'hui
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenWorkflow;