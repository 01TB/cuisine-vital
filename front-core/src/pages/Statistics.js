import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import api from '../const/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Statistics() {
  const [caData, setCaData] = useState([]);
  const [caLabels, setCaLabels] = useState([]);
  const [statuts, setStatuts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Chiffre d'affaires journalier sur 30 jours
        const now = new Date();
        const caLabelsTmp = [];
        const caDataTmp = [];
        for (let i = 29; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(now.getDate() - i);
          const dateStr = d.toISOString().slice(0, 10);
          caLabelsTmp.push(dateStr);
          // eslint-disable-next-line no-await-in-loop
          const res = await axios.get(api('admin/stats/chiffres-affaire/journalier'), { params: { date: dateStr } });
          const ca = Number(res.data.chiffre_affaire_individuel || 0) + Number(res.data.chiffre_affaire_entreprise || 0);
          caDataTmp.push(ca);
        }
        setCaLabels(caLabelsTmp);
        setCaData(caDataTmp);
        // 2. Statuts de commandes
        const resStatuts = await axios.get(api('admin/commandes/statuts'));
        setStatuts(resStatuts.data);
      } catch (err) {
        setError('Erreur de chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Préparation des datasets Chart.js
  const lineData = {
    labels: caLabels,
    datasets: [
      {
        label: "Chiffre d'affaires (30j)",
        data: caData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.2,
      },
    ],
  };

  const barData = {
    labels: statuts.map(s => s.statut),
    datasets: [
      {
        label: 'Commandes (total)',
        data: statuts.map(s => s.totalCommandes),
        backgroundColor: [
          '#fbbf24', // amber
          '#22c55e', // green
          '#3b82f6', // blue
          '#f87171', // red
          '#a78bfa', // purple
          '#f472b6', // pink
        ],
      },
    ],
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Statistiques</h2>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Analyse des performances</Card.Title>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                  <div>Chargement des statistiques...</div>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <>
                  <div className="mb-5">
                    <h5>Évolution du chiffre d'affaires (30 derniers jours)</h5>
                    <Line data={lineData} options={{
                      responsive: true,
                      plugins: { legend: { display: true }, title: { display: false } },
                      scales: { x: { ticks: { maxTicksLimit: 10 } } }
                    }} />
                  </div>
                  <div>
                    <h5>Commandes par statut</h5>
                    <Bar data={barData} options={{
                      responsive: true,
                      plugins: { legend: { display: false }, title: { display: false } },
                    }} />
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Statistics;