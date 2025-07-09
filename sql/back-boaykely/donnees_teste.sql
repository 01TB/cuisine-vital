npm install react-chartjs-2 chart.js





TRUNCATE TABLE clients RESTART IDENTITY CASCADE;

-- Note : 'zones_livraison' et les autres tables de référence (roles, statuts_commande, etc.)
-- ne sont pas affectées, ce qui est le comportement souhaité.
-- Supprimer les zones de test spécifiques si elles existent
DELETE FROM zones_livraison WHERE id > 100;

-- ---------------------------------------------
-- 1. Création des entités de base (Clients, Abonnements)
-- ---------------------------------------------
INSERT INTO zones_livraison (id, nom) VALUES (101, 'Zone Test CA') ON CONFLICT (id) DO NOTHING;

-- Client Particulier pour le test
INSERT INTO clients (id, nom, prenom, email, telephone, adresse, zone_livraison_id, type_client) VALUES
('a11ce000-0000-0000-0000-000000000001', 'Martin', 'Alice', 'alice.test.ca@email.com', '0612345678', '1 Rue du Test', 101, 'PARTICULIER');

-- Client Entreprise pour le test
INSERT INTO clients (id, nom, email, telephone, adresse, zone_livraison_id, type_client) VALUES
('c0dec000-0000-0000-0000-000000000002', 'CodeCorp', 'contact.test.ca@codecorp.com', '0123456789', '2 Avenue de la Dev', 101, 'ENTREPRISE');

-- Abonnement pour l'entreprise
INSERT INTO abonnements (id, client_id, type_abonnement_id, nb_employes, date_debut) VALUES
('ab0ab0ab-0000-0000-0000-000000000003', 'c0dec000-0000-0000-0000-000000000002', (SELECT id FROM types_abonnement WHERE nom = 'GOLD'), 20, '2024-01-01');

-- ---------------------------------------------
-- 2. Création des Commandes, Factures et PAIEMENTS (avec des UUIDs valides)
-- Les triggers pour les numéros de commande vont maintenant fonctionner car la fonction a été corrigée.
-- ---------------------------------------------

-- --- SCÉNARIO 1 : Paiement INDIVIDUEL DANS la période de test (il y a 10 jours) ---
INSERT INTO commandes_individuelles (id, client_id, statut_id, date_livraison, adresse_livraison, montant_total) VALUES 
('11111111-1111-1111-1111-000000000001', 'a11ce000-0000-0000-0000-000000000001', (SELECT id FROM statuts_commande WHERE nom='LIVREE'), CURRENT_DATE - 12, '1 Rue du Test', 50.00);
INSERT INTO factures_individuelles (id, client_id, commande_id, numero_facture, date_echeance, montant_ht, montant_tva, montant_ttc, statut) VALUES
('11111111-2222-2222-2222-000000000001', 'a11ce000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-000000000001', 'FACT-IND-01', CURRENT_DATE + 20, 50.00, 10.00, 60.00, 'PAYEE');
INSERT INTO paiements_individuels (id, facture_id, date_paiement, montant, mode_paiement, statut) VALUES
('11111111-3333-3333-3333-000000000001', '11111111-2222-2222-2222-000000000001', CURRENT_TIMESTAMP - INTERVAL '10 days', 50.00, 'CARTE', 'CONFIRME');

-- --- SCÉNARIO 2 : Autre paiement INDIVIDUEL DANS la période de test (il y a 5 jours) ---
INSERT INTO commandes_individuelles (id, client_id, statut_id, date_livraison, adresse_livraison, montant_total) VALUES 
('22222222-1111-1111-1111-000000000002', 'a11ce000-0000-0000-0000-000000000001', (SELECT id FROM statuts_commande WHERE nom='LIVREE'), CURRENT_DATE - 7, '1 Rue du Test', 75.50);
INSERT INTO factures_individuelles (id, client_id, commande_id, numero_facture, date_echeance, montant_ht, montant_tva, montant_ttc, statut) VALUES
('22222222-2222-2222-2222-000000000002', 'a11ce000-0000-0000-0000-000000000001', '22222222-1111-1111-1111-000000000002', 'FACT-IND-02', CURRENT_DATE + 25, 75.50, 15.10, 90.60, 'PAYEE');
INSERT INTO paiements_individuels (id, facture_id, date_paiement, montant, mode_paiement, statut) VALUES
('22222222-3333-3333-3333-000000000002', '22222222-2222-2222-2222-000000000002', CURRENT_TIMESTAMP - INTERVAL '5 days', 75.50, 'PAYPAL', 'CONFIRME');

-- --- SCÉNARIO 3 : Paiement INDIVIDUEL HORS de la période de test (il y a 2 mois) ---
INSERT INTO commandes_individuelles (id, client_id, statut_id, date_livraison, adresse_livraison, montant_total) VALUES 
('33333333-1111-1111-1111-000000000003', 'a11ce000-0000-0000-0000-000000000001', (SELECT id FROM statuts_commande WHERE nom='LIVREE'), CURRENT_DATE - 65, '1 Rue du Test', 30.00);
INSERT INTO factures_individuelles (id, client_id, commande_id, numero_facture, date_echeance, montant_ht, montant_tva, montant_ttc, statut) VALUES
('33333333-2222-2222-2222-000000000003', 'a11ce000-0000-0000-0000-000000000001', '33333333-1111-1111-1111-000000000003', 'FACT-IND-03', CURRENT_DATE - 35, 30.00, 6.00, 36.00, 'PAYEE');
INSERT INTO paiements_individuels (id, facture_id, date_paiement, montant, mode_paiement, statut) VALUES
('33333333-3333-3333-3333-000000000003', '33333333-2222-2222-2222-000000000003', CURRENT_TIMESTAMP - INTERVAL '60 days', 30.00, 'CARTE', 'CONFIRME');

-- --- SCÉNARIO 4 : Paiement ENTREPRISE DANS la période de test (il y a 15 jours) ---
INSERT INTO commandes_entreprises (id, client_id, abonnement_id, statut_id, date_livraison, adresse_livraison, montant_total) VALUES 
('44444444-1111-1111-1111-000000000004', 'c0dec000-0000-0000-0000-000000000002', 'ab0ab0ab-0000-0000-0000-000000000003', (SELECT id FROM statuts_commande WHERE nom='LIVREE'), CURRENT_DATE - 17, '2 Avenue de la Dev', 450.00);
INSERT INTO factures_entreprises (id, client_id, abonnement_id, numero_facture, mois_facture, date_echeance, montant_ht, montant_tva, montant_ttc, nb_repas_factures, statut) VALUES
('44444444-2222-2222-2222-000000000004', 'c0dec000-0000-0000-0000-000000000002', 'ab0ab0ab-0000-0000-0000-000000000003', 'FACT-ENT-01', CURRENT_DATE - 17, CURRENT_DATE + 15, 450.00, 90.00, 540.00, 20, 'PAYEE');
INSERT INTO paiements_entreprises (id, facture_id, date_paiement, montant, mode_paiement, statut) VALUES
('44444444-3333-3333-3333-000000000004', '44444444-2222-2222-2222-000000000004', CURRENT_TIMESTAMP - INTERVAL '15 days', 450.00, 'VIREMENT', 'CONFIRME');

-- --- SCÉNARIO 5 : Paiement ENTREPRISE HORS de la période de test (il y a 3 mois) ---
INSERT INTO commandes_entreprises (id, client_id, abonnement_id, statut_id, date_livraison, adresse_livraison, montant_total) VALUES 
('55555555-1111-1111-1111-000000000005', 'c0dec000-0000-0000-0000-000000000002', 'ab0ab0ab-0000-0000-0000-000000000003', (SELECT id FROM statuts_commande WHERE nom='LIVREE'), CURRENT_DATE - 92, '2 Avenue de la Dev', 800.00);
INSERT INTO factures_entreprises (id, client_id, abonnement_id, numero_facture, mois_facture, date_echeance, montant_ht, montant_tva, montant_ttc, nb_repas_factures, statut) VALUES
('55555555-2222-2222-2222-000000000005', 'c0dec000-0000-0000-0000-000000000002', 'ab0ab0ab-0000-0000-0000-000000000003', 'FACT-ENT-02', CURRENT_DATE - 92, CURRENT_DATE - 62, 800.00, 160.00, 960.00, 40, 'PAYEE');
INSERT INTO paiements_entreprises (id, facture_id, date_paiement, montant, mode_paiement, statut) VALUES
('55555555-3333-3333-3333-000000000005', '55555555-2222-2222-2222-000000000005', CURRENT_TIMESTAMP - INTERVAL '90 days', 800.00, 'VIREMENT', 'CONFIRME');