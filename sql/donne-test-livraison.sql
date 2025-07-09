


INSERT INTO menus (id, nom, prix_carte, temps_preparation, disponible)
VALUES (1001, 'Pizza Margherita', 10.00, 15, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO menus (id, nom, prix_carte, temps_preparation, disponible)
VALUES (1002, 'Poulet Rôti', 12.00, 25, TRUE)
ON CONFLICT (id) DO NOTHING;
-- =================================================================
-- ÉTAPE 2: CRÉATION DE DONNÉES POUR LES COMMANDES ENTREPRISES
-- =================================================================

-- Création d'un client de type 'ENTREPRISE'
INSERT INTO clients (id, nom, email, telephone, adresse, zone_livraison_id, type_client) VALUES
('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Grande Entreprise Inc.', 'contact@grande-entreprise.com', '0102030405', '123 Avenue des Affaires', 1, 'ENTREPRISE')
ON CONFLICT (id) DO NOTHING;

-- Création d'une commande pour cette entreprise (statut 5 = "Prête à livrer")
INSERT INTO commandes_entreprises (id, numero_commande, client_id, statut_id, date_livraison, adresse_livraison, montant_total) VALUES
('c0e0c0e0-c0e0-c0e0-c0e0-c0e0c0e0c0e0', 'CMD-ENT-001', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 5, CURRENT_DATE + interval '1 day', '123 Avenue des Affaires', 50.00)
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



-- =================================================================
-- ÉTAPE 3: CRÉATION DES LIVRAISONS
-- Scénario : Le Livreur A (Jean Dupont) a deux livraisons actives aujourd'hui.
-- =================================================================

-- On suppose que votre ENUM pour le statut est ('ASSIGNEE', 'EN_ROUTE', 'LIVREE', 'ANNULEE', etc.)
-- PostGIS format: ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)

-- ---- LIVRAISONS INDIVIDUELLES ----

-- Livraison 1 : Pour la commande CMD-001, assignée au Livreur A, EN COURS DE LIVRAISON.
-- C'est un point clé pour le test d'itinéraire.
INSERT INTO livraisons_individuelles (id, commande_id, livreur_id, adresse, statut, localisation) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000101', -- ID de la commande CMD-001
    '1605a4b2-4779-4254-95a0-61301425ecdb', -- ID du Livreur A
    '1 rue test',
    'ASSIGNEE', -- Statut actif que votre service recherche
    ST_SetSRID(ST_MakePoint(47.5250, -18.9100), 4326) -- Point 1 (ex: près d'Ankorondrano)
) ON CONFLICT (id) DO NOTHING;

-- Livraison 2 : Pour la commande CMD-002, assignée au Livreur B, statut "assignée" mais pas encore commencée.
-- Cette livraison ne devrait PAS apparaître dans l'itinéraire du Livreur A.
INSERT INTO livraisons_individuelles (id, commande_id, livreur_id, adresse, statut, localisation) VALUES
(
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000102', -- ID de la commande CMD-002
    'ea83bd04-74b2-4e0e-8f1d-374b90c5a51f', -- ID du Livreur B
    '2 avenue de l''Indépendance',
    'ASSIGNEE', -- Statut inactif pour le calcul d'itinéraire
    ST_SetSRID(ST_MakePoint(47.5215, -18.9070), 4326)
) ON CONFLICT (id) DO NOTHING;


INSERT INTO commandes_individuelles (id, numero_commande, client_id, statut_id, date_livraison, adresse_livraison, montant_total) VALUES
('00000000-0000-0000-0000-000000000099', 'CMD-A-001', '00000000-0000-0000-0000-000000000001', 5, CURRENT_DATE, '101 Rue de la Liberté', 15.50),
('00000000-0000-0000-0000-000000000098', 'CMD-A-002', '00000000-0000-0000-0000-000000000001', 5, CURRENT_DATE, '202 Boulevard de la République', 22.00),
('00000000-0000-0000-0000-000000000097', 'CMD-A-003', '00000000-0000-0000-0000-000000000001', 5, CURRENT_DATE, '303 Place du Marché', 31.75)
ON CONFLICT (id) DO NOTHING;

INSERT INTO livraisons_individuelles (id, commande_id, livreur_id, adresse, statut, localisation) VALUES
(
    '00000000-0000-0000-0000-000000000056',                             -- ID de la livraison
    '00000000-0000-0000-0000-000000000099',                             -- ID de la commande correspondante
    '1605a4b2-4779-4254-95a0-61301425ecdb',        -- ID du Livreur A
    '101 Rue de la Liberté',
    'EN_ROUTE',                                -- Statut ACTIF
    ST_SetSRID(ST_MakePoint(47.5186, -18.9060), 4326) -- Point A (ex: Analakely)
) ON CONFLICT (id) DO NOTHING;

-- Livraison 2 : STATUT "EN_ROUTE" (sera aussi incluse dans l'itinéraire)
INSERT INTO livraisons_individuelles (id, commande_id, livreur_id, adresse, statut, localisation) VALUES
(
    '00000000-0000-0000-0000-000000000095',                             -- ID de la livraison
    '00000000-0000-0000-0000-000000000098',                             -- ID de la commande correspondante
    '1605a4b2-4779-4254-95a0-61301425ecdb',        -- ID du Livreur A
    '202 Boulevard de la République',
    'EN_ROUTE',                                -- Statut ACTIF
    ST_SetSRID(ST_MakePoint(47.5360, -18.8780), 4326) -- Point B (ex: Ivandry)
) ON CONFLICT (id) DO NOTHING;

-- Livraison 3 : STATUT "ASSIGNEE" (ne sera PAS incluse dans l'itinéraire)
INSERT INTO livraisons_individuelles (id, commande_id, livreur_id, adresse, statut, localisation) VALUES
(
    '00000000-0000-0000-0000-000000000094',                             -- ID de la livraison
    '00000000-0000-0000-0000-000000000097',                             -- ID de la commande correspondante
    '1605a4b2-4779-4254-95a0-61301425ecdb',        -- ID du Livreur A
    '303 Place du Marché',
    'ASSIGNEE',                                    -- Statut INACTIF pour le calcul
    ST_SetSRID(ST_MakePoint(47.5074, -18.9160), 4326) -- Point C (ex: Ampefiloha)
) ON CONFLICT (id) DO NOTHING;