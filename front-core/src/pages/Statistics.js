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
        const now = new Date();
        const caLabelsTmp = [];
        const caDataTmp = [];
        for (let i = 29; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(now.getDate() - i);
          const dateStr = d.toISOString().slice(0, 10);
          caLabelsTmp.push(dateStr);
          const res = await axios.get(api('admin/stats/chiffres-affaire/journalier'), {
            params: { date: dateStr },
          });
          const ca =
            Number(res.data.chiffre_affaire_individuel || 0) +
            Number(res.data.chiffre_affaire_entreprise || 0);
          caDataTmp.push(ca);
        }
        setCaLabels(caLabelsTmp);
        setCaData(caDataTmp);

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

  const lineData = {
    labels: caLabels,
    datasets: [
      {
        label: 'Chiffre d’affaires',
        data: caData,
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        pointRadius: 1,
        pointHoverRadius: 4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: 'rgba(240, 240, 240, 0.8)' },
        ticks: {
          color: '#888',
          font: { size: 12 },
          maxTicksLimit: 7,
        },
      },
      y: {
        grid: { color: 'rgba(240, 240, 240, 0.8)' },
        ticks: {
          color: '#888',
          font: { size: 12 },
          callback: (value) => `€ ${value}`,
        },
      },
    },
  };

  const barData = {
    labels: statuts.map((s) => s.statut),
    datasets: [
      {
        data: statuts.map((s) => s.totalCommandes),
        backgroundColor: [
          '#a5b4fc',
          '#6ee7b7',
          '#93c5fd',
          '#fca5a5',
          '#fcd34d',
          '#f9a8d4',
        ],
        borderRadius: 8,
        barThickness: 24,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#888',
          font: { size: 12 },
        },
      },
      y: {
        grid: { color: 'rgba(240, 240, 240, 0.8)' },
        ticks: {
          color: '#888',
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <Container fluid className="px-4 py-4">
      <Row>
        <Col>
          <h2 className="mb-4 fw-semibold text-primary">Statistiques</h2>
          <Card className="bg-white border-0 rounded-4">
            <Card.Body>
              <Card.Title className="mb-4 text-muted fw-normal fs-5">
                Analyse des performances
              </Card.Title>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                  <div className="mt-2">Chargement des statistiques...</div>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <Row className="gy-4">
                  <Col lg={6} xs={12}>
                    <div
                      className="bg-light rounded-4 p-4"
                      style={{ height: '360px', overflow: 'hidden' }}
                    >
                      <h6 className="text-secondary fw-semibold mb-3">
                        Chiffre d’affaires (30 jours)
                      </h6>
                      <Line data={lineData} options={lineOptions} />
                    </div>
                  </Col>
                  <Col lg={6} xs={12}>
                    <div
                      className="bg-light rounded-4 p-4"
                      style={{ height: '360px', overflow: 'hidden' }}
                    >
                      <h6 className="text-secondary fw-semibold mb-3">
                        Commandes par statut
                      </h6>
                      <Bar data={barData} options={barOptions} />
                    </div>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Statistics;
