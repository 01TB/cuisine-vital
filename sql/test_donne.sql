-- Créer une zone de livraison avec l'id 1 si elle n'existe pas
INSERT INTO zones_livraison (id, nom, description)
VALUES (1, 'Zone Test', 'Zone de test pour les clients')
ON CONFLICT (id) DO NOTHING;

-- Création de 2 menus
INSERT INTO menus (id, nom, prix_carte, temps_preparation, disponible)
VALUES (1001, 'Pizza Margherita', 10.00, 15, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO menus (id, nom, prix_carte, temps_preparation, disponible)
VALUES (1002, 'Poulet Rôti', 12.00, 25, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Création d'un client
INSERT INTO clients (id, nom, prenom, email, telephone, adresse, zone_livraison_id, type_client)
VALUES ('00000000-0000-0000-0000-000000000001', 'Test', 'Client', 'test.client@exemple.com', '0600000000', '1 rue test', 1, 'PARTICULIER')
ON CONFLICT (id) DO NOTHING;

-- Création de 2 commandes individuelles
INSERT INTO commandes_individuelles (id, numero_commande, client_id, statut_id, date_livraison, adresse_livraison, montant_total)
VALUES ('00000000-0000-0000-0000-000000000101', 'CMD-001', '00000000-0000-0000-0000-000000000001', 5, CURRENT_DATE, '1 rue test', 20.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO commandes_individuelles (id, numero_commande, client_id, statut_id, date_livraison, adresse_livraison, montant_total)
VALUES ('00000000-0000-0000-0000-000000000102', 'CMD-002', '00000000-0000-0000-0000-000000000001', 5, CURRENT_DATE, '1 rue test', 24.00)
ON CONFLICT (id) DO NOTHING;

-- Détails de la première commande : 2x Pizza, 1x Poulet
INSERT INTO commandes_individuelles_details (commande_id, menu_id, quantite, prix_unitaire)
VALUES ('00000000-0000-0000-0000-000000000101', 1001, 2, 10.00)
ON CONFLICT DO NOTHING;

INSERT INTO commandes_individuelles_details (commande_id, menu_id, quantite, prix_unitaire)
VALUES ('00000000-0000-0000-0000-000000000101', 1002, 1, 12.00)
ON CONFLICT DO NOTHING;

-- Détails de la deuxième commande : 3x Poulet
INSERT INTO commandes_individuelles_details (commande_id, menu_id, quantite, prix_unitaire)
VALUES ('00000000-0000-0000-0000-000000000102', 1002, 3, 12.00)
ON CONFLICT DO NOTHING;

-- Résultat attendu pour le top menu :
-- Poulet Rôti : 4 ventes (1+3)
-- Pizza Margherita : 2 ventes

-- Pour vérifier, exécute :
-- SELECT * FROM v_top_menus ORDER BY quantite_totale DESC;