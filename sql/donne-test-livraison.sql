


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


-- Script pour assigner les livreurs aux commandes existantes
-- Assignation basée sur les zones de livraison et la disponibilité des livreurs

-- Assigner Vola Rakotomalala (zone 1) aux commandes d'Analakely
UPDATE commandes_individuelles 
SET livreur_id = '02120aeb-b57e-4d2e-bde9-3bf436d83c03'
WHERE id = '5bace2e6-fa5a-4141-9aad-b649668147c6';

-- Assigner Tojo Raharison (zone 2) aux commandes d'Ankazotokana
UPDATE commandes_individuelles 
SET livreur_id = '229b84ad-dd4a-4244-b97b-1b2f0f1ffdb6'
WHERE id = '616f686b-5c30-481f-91ff-3e905436f716';

-- Assigner Mamy Rajaonarivelo (zone 3) aux commandes d'Andoharanofotsy
UPDATE commandes_individuelles 
SET livreur_id = 'b2ce0bc7-6951-4a18-964f-40bec99d8ad5'
WHERE id IN ('2af9e462-3e17-4684-b3dd-9e2399d26a23', '0da7a504-7c15-4d96-9a26-f9c975c9cd50');

-- Données de test pour la table livraisons_individuelles
INSERT INTO livraisons_individuelles (
    id,
    commande_id,
    livreur_id,
    adresse,
    localisation,
    heure_depart,
    heure_livraison,
    statut,
    commentaire,
    created_at,
    deleted_at
) VALUES 
-- Livraison 1: Commande à Analakely - LIVREE
(
    uuid_generate_v4(),
    '5bace2e6-fa5a-4141-9aad-b649668147c6',
    '02120aeb-b57e-4d2e-bde9-3bf436d83c03',
    'Analakely, Antananarivo, Analamanga, Province d''Antananarivo, 101, Madagascar',
    ST_GeomFromText('POINT(47.520832 -18.912578)', 4326),
    '10:30:00',
    '11:15:00',
    'LIVREE',
    'Livraison effectuée avec succès. Client satisfait.',
    '2025-07-07 10:30:00',
    NULL
),

-- Livraison 2: Commande à Ankazotokana - EN_ROUTE
(
    uuid_generate_v4(),
    '616f686b-5c30-481f-91ff-3e905436f716',
    '229b84ad-dd4a-4244-b97b-1b2f0f1ffdb6',
    'Ankazotokana, Antananarivo, Analamanga, Province d''Antananarivo, 101, Madagascar',
    ST_GeomFromText('POINT(47.518045 -18.915234)', 4326),
    '14:00:00',
    NULL,
    'EN_ROUTE',
    'En cours de livraison. Arrivée prévue dans 15 minutes.',
    '2025-07-10 14:00:00',
    NULL
),

-- Livraison 3: Commande à IT University - LIVREE
(
    uuid_generate_v4(),
    '2af9e462-3e17-4684-b3dd-9e2399d26a23',
    'b2ce0bc7-6951-4a18-964f-40bec99d8ad5',
    'IT University, N 7, Andoharanofotsy, District d''Antananarivo Atsimondrano, Analamanga, Province d''Antananarivo, 102, Madagascar',
    ST_GeomFromText('POINT(47.518176 -18.924789)', 4326),
    '12:45:00',
    '13:20:00',
    'LIVREE',
    'Livraison à l''université. Remise au service de sécurité.',
    '2025-07-07 12:45:00',
    NULL
),

-- Livraison 4: Commande récente à IT University - ASSIGNEE
(
    uuid_generate_v4(),
    '0da7a504-7c15-4d96-9a26-f9c975c9cd50',
    'b2ce0bc7-6951-4a18-964f-40bec99d8ad5',
    'IT University, N 7, Andoharanofotsy, District d''Antananarivo Atsimondrano, Analamanga, Province d''Antananarivo, 102, Madagascar',
    ST_GeomFromText('POINT(47.518176 -18.924789)', 4326),
    '16:00:00',
    NULL,
    'ASSIGNEE',
    'Livraison programmée pour cet après-midi.',
    '2025-07-09 15:30:00',
    NULL
),

-- Livraison 5: Données additionnelles - Zone Analakely
(
    uuid_generate_v4(),
    '5bace2e6-fa5a-4141-9aad-b649668147c6',
    '02120aeb-b57e-4d2e-bde9-3bf436d83c03',
    'Tsaralalana, Antananarivo, Analamanga, Province d''Antananarivo, 101, Madagascar',
    ST_GeomFromText('POINT(47.521456 -18.914123)', 4326),
    '09:15:00',
    '09:45:00',
    'LIVREE',
    'Livraison matinale. Pas de problème particulier.',
    '2025-07-08 09:15:00',
    NULL
),

-- Livraison 6: Données additionnelles - Zone Ankazotokana
(
    uuid_generate_v4(),
    '616f686b-5c30-481f-91ff-3e905436f716',
    '229b84ad-dd4a-4244-b97b-1b2f0f1ffdb6',
    'Faravohitra, Antananarivo, Analamanga, Province d''Antananarivo, 101, Madagascar',
    ST_GeomFromText('POINT(47.516789 -18.913456)', 4326),
    '15:30:00',
    '16:10:00',
    'LIVREE',
    'Quartier résidentiel. Livraison sans difficulté.',
    '2025-07-09 15:30:00',
    NULL
),

-- Livraison 7: Données additionnelles - Zone Andoharanofotsy
(
    uuid_generate_v4(),
    '2af9e462-3e17-4684-b3dd-9e2399d26a23',
    'b2ce0bc7-6951-4a18-964f-40bec99d8ad5',
    'Tanjombato, District d''Antananarivo Atsimondrano, Analamanga, Province d''Antananarivo, 102, Madagascar',
    ST_GeomFromText('POINT(47.515234 -18.928901)', 4326),
    '11:00:00',
    '11:35:00',
    'LIVREE',
    'Zone périphérique. Livraison effectuée rapidement.',
    '2025-07-08 11:00:00',
    NULL
),

-- Livraison 8: Livraison annulée/supprimée
(
    uuid_generate_v4(),
    '0da7a504-7c15-4d96-9a26-f9c975c9cd50',
    'b2ce0bc7-6951-4a18-964f-40bec99d8ad5',
    'Ampefiloha, Antananarivo, Analamanga, Province d''Antananarivo, 101, Madagascar',
    ST_GeomFromText('POINT(47.523789 -18.916234)', 4326),
    '13:00:00',
    NULL,
    'ASSIGNEE',
    'Livraison annulée par le client.',
    '2025-07-09 13:00:00',
    '2025-07-09 13:30:00'
);

-- Requête pour vérifier les données insérées
SELECT 
    li.id,
    ci.numero_commande,
    CONCAT(u.prenom, ' ', u.nom) as livreur,
    li.adresse,
    li.heure_depart,
    li.heure_livraison,
    li.statut,
    li.commentaire,
    li.created_at,
    li.deleted_at
FROM livraisons_individuelles li
JOIN commandes_individuelles ci ON li.commande_id = ci.id
JOIN utilisateurs u ON li.livreur_id = u.id
ORDER BY li.created_at DESC;