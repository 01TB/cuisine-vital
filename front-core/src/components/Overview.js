import { useEffect, useState, useCallback } from 'react'; // Importer useCallback
import axios from 'axios';
import api from '../const/api';
import { ShoppingCart, BarChart3, Menu, ChefHat, Bell, Search, Package, Settings, ChevronRight, ChevronDown, TrendingUp, Euro, AlertCircle } from 'lucide-react';
import StatsCard from './StatsCard';
import PopularDishes from './PopularDishes';
import KitchenWorkflow from './KitchenWorkflow';

const Overview = () => {
  const [chiffresAffaire, setChiffresAffaire] = useState({ chiffre_affaire_individuel: 0, chiffre_affaire_entreprise: 0 });
  const [loadingCA, setLoadingCA] = useState(true);
  const [errorCA, setErrorCA] = useState(null);

  // Nouveaux états pour commandes en cours
  const [nbCommandesEnCours, setNbCommandesEnCours] = useState(0);
  const [loadingCmd, setLoadingCmd] = useState(true);
  const [errorCmd, setErrorCmd] = useState(null);

  // Utilisation de useCallback pour que la fonction puisse être passée en dépendance ou à un événement onClick
  const fetchCA = useCallback(async () => {
    setLoadingCA(true);
    setErrorCA(null);
    try {
      const res = await axios.get(api('admin/stats/chiffres-affaire'));
      setChiffresAffaire(res.data);
    } catch (err) {
      setErrorCA('Erreur de chargement du C.A.');
      console.error(err);
    } finally {
      setLoadingCA(false);
    }
  }, []);

  // Nouvelle fonction pour récupérer le nombre de commandes en cours
  const fetchNbCommandesEnCours = useCallback(async () => {
    setLoadingCmd(true);
    setErrorCmd(null);
    try {
      const res = await axios.get(api('admin/commandes/en-cours/nb'));
      setNbCommandesEnCours(res.data.nombre_commande_en_cours || 0);
    } catch (err) {
      setErrorCmd('Erreur de chargement des commandes en cours');
      console.error(err);
    } finally {
      setLoadingCmd(false);
    }
  }, []);

  useEffect(() => {
    fetchCA();
    fetchNbCommandesEnCours();
  }, [fetchCA, fetchNbCommandesEnCours]);

  const totalCA = parseFloat(chiffresAffaire.chiffre_affaire_individuel) + parseFloat(chiffresAffaire.chiffre_affaire_entreprise);

  // Fonction pour afficher la card de Chiffre d'Affaires en fonction de l'état
  const renderRevenueCard = () => {
    if (loadingCA) {
      // Squelette de chargement pour une meilleure UX
      return (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="flex justify-center">
             <div className="h-6 bg-gray-200 rounded-full w-1/4"></div>
          </div>
        </div>
      );
    }

    if (errorCA) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-red-200 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
            <h3 className="text-sm font-medium text-red-600">{errorCA}</h3>
            <p className="text-xs text-gray-500 mb-3">Impossible de récupérer les données.</p>
            <button 
              onClick={fetchCA} 
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
            >
              Réessayer
            </button>
        </div>
      );
    }

    return (
      <StatsCard
        title="Chiffre d'affaires"
        value={`${totalCA.toFixed(2)} €`}
        subtitle={`Ind: ${parseFloat(chiffresAffaire.chiffre_affaire_individuel).toFixed(2)}€ | Ent: ${parseFloat(chiffresAffaire.chiffre_affaire_entreprise).toFixed(2)}€`}
        change="📈 +8.5% ce mois"
        icon={Euro}
        color="green"
      />
    );
  };

  // Fonction pour afficher la card Commandes en cours
  const renderCommandesEnCoursCard = () => {
    if (loadingCmd) {
      return (
        <StatsCard
          title="Commandes en cours"
          value="..."
          subtitle="Chargement..."
          change=""
          icon={Package}
          color="blue"
        />
      );
    }
    if (errorCmd) {
      return (
        <StatsCard
          title="Commandes en cours"
          value="Erreur"
          subtitle={errorCmd}
          change=""
          icon={Package}
          color="red"
        />
      );
    }
    return (
      <StatsCard
        title="Commandes en cours"
        value={nbCommandesEnCours}
        subtitle="Actives et en progression"
        change="📈 +12% depuis hier"
        icon={Package}
        color="blue"
      />
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Bonjour, Admin!</h1>
        <p className="dashboard-subtitle">Votre journal d'opération pour Cuisine Vital'</p>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-stats grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderCommandesEnCoursCard()}
          {renderRevenueCard()}
          <StatsCard
            title="Revenus journaliers"
            value={`0.00 €`}
            subtitle="Revenus d'aujourd'hui"
            change="📈 +5%"
            icon={BarChart3}
            color="purple"
          />
        </div>
        <div className="dashboard-details mt-6">
          <PopularDishes />
          <KitchenWorkflow />
        </div>
      </div>
    </div>
  );
};

export default Overview;