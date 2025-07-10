import { useEffect, useState, useCallback } from 'react'; // Importer useCallback
import axios from 'axios';
import api from '../const/api';
import { ShoppingCart, BarChart3, Menu, ChefHat, Bell, Search, Package, Settings, ChevronRight, ChevronDown, TrendingUp, Euro, AlertCircle } from 'lucide-react';
import StatsCard from './StatsCard';
import PopularDishes from './PopularDishes';
import KitchenWorkflow from './KitchenWorkflow';

const Overview = () => {
  const [caMensuel, setCaMensuel] = useState(null);
  const [caAnnuel, setCaAnnuel] = useState(null);
  const [loadingCA, setLoadingCA] = useState(true);
  const [errorCA, setErrorCA] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Nouveaux états pour commandes en cours
  const [nbCommandesEnCours, setNbCommandesEnCours] = useState(0);
  const [loadingCmd, setLoadingCmd] = useState(true);
  const [errorCmd, setErrorCmd] = useState(null);;

  // Utilisation de useCallback pour que la fonction puisse être passée en dépendance ou à un événement onClick
  const fetchChiffresAffaire = useCallback(async () => {
    setLoadingCA(true);
    setErrorCA(null);
    try {
      const now = new Date();
      const dateFin = now.toISOString();
      // 30 jours avant
      const dateDebutMois = new Date(now);
      dateDebutMois.setDate(now.getDate() - 30);
      // 1er janvier
      const dateDebutAnnee = new Date(now.getFullYear(), 0, 1);

      const [resMois, resAnnee] = await Promise.all([
        axios.get(api('admin/stats/chiffres-affaire'), {
          params: { dateDebut: dateDebutMois.toISOString(), dateFin }
        }),
        axios.get(api('admin/stats/chiffres-affaire'), {
          params: { dateDebut: dateDebutAnnee.toISOString(), dateFin }
        })
      ]);
      setCaMensuel(resMois.data);
      setCaAnnuel(resAnnee.data);
    } catch (err) {
      setErrorCA('Erreur de chargement du C.A.');
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

  const [caJournalier, setCaJournalier] = useState(null);
  const [loadingCAJournalier, setLoadingCAJournalier] = useState(true);
  const [errorCAJournalier, setErrorCAJournalier] = useState(null);

  // Nouvelle fonction pour charger le chiffre d'affaires journalier
  const fetchChiffreAffaireJournalier = useCallback(async () => {
    setLoadingCAJournalier(true);
    setErrorCAJournalier(null);
    try {
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
      const res = await axios.get(api('admin/stats/chiffres-affaire/journalier'), {
        params: { date: dateStr }
      });
      setCaJournalier(res.data);
    } catch (err) {
      setErrorCAJournalier('Erreur de chargement du CA journalier');
    } finally {
      setLoadingCAJournalier(false);
    }
  }, []);

  useEffect(() => {
    fetchChiffresAffaire();
    fetchNbCommandesEnCours();
    fetchChiffreAffaireJournalier();
  }, [fetchChiffresAffaire, fetchNbCommandesEnCours, fetchChiffreAffaireJournalier]);

  // Carrousel automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalCA = parseFloat(caMensuel?.chiffre_affaire_individuel) + parseFloat(caMensuel?.chiffre_affaire_entreprise);

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
              onClick={fetchChiffresAffaire} 
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
        value={`${totalCA.toFixed(2)} Ariary`}
        subtitle={`Ind: ${parseFloat(caMensuel?.chiffre_affaire_individuel).toFixed(2)}Ar | Ent: ${parseFloat(caMensuel?.chiffre_affaire_entreprise).toFixed(2)}Ar`}
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

  // Carrousel pour le chiffre d'affaires
  const renderRevenueCarousel = () => {
    if (loadingCA) {
      return (
        <StatsCard
          title="Chiffre d'affaires"
          value="..."
          subtitle="Chargement..."
          change=""
          icon={Euro}
          color="green"
        />
      );
    }
    if (errorCA) {
      return (
        <StatsCard
          title="Chiffre d'affaires"
          value="Erreur"
          subtitle={errorCA}
          change=""
          icon={Euro}
          color="red"
        />
      );
    }
    const ca = carouselIndex === 0 ? caMensuel : caAnnuel;
    const label = carouselIndex === 0 ? "30 derniers jours" : "Année en cours";
    const totalCA = ca
      ? Number(ca.chiffre_affaire_individuel || 0) + Number(ca.chiffre_affaire_entreprise || 0)
      : 0;
    return (
      <StatsCard
        title={`Chiffre d'affaires (${label})`}
        value={`${totalCA.toFixed(2)} Ariary`}
        subtitle={`Ind: ${Number(ca?.chiffre_affaire_individuel || 0).toFixed(2)}Ar | Ent: ${Number(ca?.chiffre_affaire_entreprise || 0).toFixed(2)}Ar`}
        change={carouselIndex === 0 ? "📈 Mensuel" : "📈 Annuel"}
        icon={Euro}
        color="green"
      />
    );
  };

  // Fonction pour afficher la carte Revenus journaliers
  const renderRevenusJournaliersCard = () => {
    if (loadingCAJournalier) {
      return (
        <StatsCard
          title="Revenus journaliers"
          value="..."
          subtitle="Chargement..."
          change=""
          icon={BarChart3}
          color="purple"
        />
      );
    }
    if (errorCAJournalier) {
      return (
        <StatsCard
          title="Revenus journaliers"
          value="Erreur"
          subtitle={errorCAJournalier}
          change=""
          icon={BarChart3}
          color="red"
        />
      );
    }
    const totalCA = caJournalier
      ? Number(caJournalier.chiffre_affaire_individuel || 0) + Number(caJournalier.chiffre_affaire_entreprise || 0)
      : 0;
    return (
      <StatsCard
        title="Revenus journaliers"
        value={`${totalCA.toFixed(2)} €`}
        subtitle={`Ind: ${Number(caJournalier?.chiffre_affaire_individuel || 0).toFixed(2)}Ar | Ent: ${Number(caJournalier?.chiffre_affaire_entreprise || 0).toFixed(2)}Ar`}
        change={"Aujourd'hui"}
        icon={BarChart3}
        color="purple"
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
          {renderRevenueCarousel()}
          {renderRevenusJournaliersCard()}
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