-- =============================================
-- JEU DE DONNÉES DE TEST POUR L'HISTORIQUE DES COMMANDES
-- =============================================

\c cuisine_db;

-- Nettoyage optionnel des tables pour une exécution propre
DELETE FROM commandes_individuelles_details;
DELETE FROM commandes_entreprises_details;
DELETE FROM commandes_individuelles;
DELETE FROM commandes_entreprises;
DELETE FROM menus;
DELETE FROM abonnements;
DELETE FROM clients;
DELETE FROM utilisateurs WHERE role_id = (SELECT id FROM roles WHERE nom = 'LIVREUR');
DELETE FROM zones_livraison;

-- ---------------------------------------------
-- 1. Données de base (Zones, Utilisateurs, Clients)
-- ---------------------------------------------

-- Créer une zone de livraison
INSERT INTO zones_livraison (id, nom) VALUES (1, 'Zone A - Centre-Ville') ON CONFLICT (id) DO NOTHING;

-- Créer un utilisateur avec le rôle LIVREUR
-- Assurez-vous que le rôle 'LIVREUR' a l'ID 4 comme dans les insertions par défaut.
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role_id, zone_livraison_id) VALUES
('Rapide', 'Marco', 'marco.rapide@livraison.com', 'unmotdepassesecurise', (SELECT id FROM roles WHERE nom = 'LIVREUR'), 1);

-- Créer un client PARTICULIER
INSERT INTO clients (id, nom, prenom, email, telephone, adresse, zone_livraison_id, type_client) VALUES
('11111111-1111-1111-1111-111111111111', 'Durand', 'Sophie', 'sophie.d@email.com', '0601020304', '10 Rue des Lilas', 1, 'PARTICULIER');

-- Créer un client ENTREPRISE
INSERT INTO clients (id, nom, prenom, email, telephone, adresse, zone_livraison_id, type_client) VALUES
('22222222-2222-2222-2222-222222222222', 'Innovatech SAS', NULL, 'contact@innovatech.com', '0102030405', '50 Avenue de la Tech', 1, 'ENTREPRISE');

-- ---------------------------------------------
-- 2. Abonnements et Menus
-- ---------------------------------------------

-- Créer un abonnement GOLD pour l'entreprise
INSERT INTO abonnements (id, client_id, type_abonnement_id, nb_employes, date_debut) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', (SELECT id FROM types_abonnement WHERE nom = 'GOLD'), 15, '2025-01-01');

-- Créer quelques menus
INSERT INTO menus (id, nom, prix_carte, temps_preparation) VALUES
(1, 'Salade Gourmande du Chef', 13.50, 10),
(2, 'Filet de Boeuf et Gratin', 18.00, 25),
(3, 'Risotto aux Champignons', 15.00, 20)
ON CONFLICT (id) DO UPDATE SET nom = EXCLUDED.nom, prix_carte = EXCLUDED.prix_carte, temps_preparation = EXCLUDED.temps_preparation;

-- ---------------------------------------------
-- 3. Création des Commandes
-- NOTE: Les montants totaux sont fixés manuellement. Dans un vrai cas, vos triggers les calculeraient.
-- ---------------------------------------------

-- --- Commandes Individuelles pour Sophie Durand ---

-- Commande 1 : Livrée la semaine dernière
INSERT INTO commandes_individuelles (id, client_id, statut_id, date_livraison, adresse_livraison, montant_total, livreur_id, date_commande) VALUES
('c1111111-1111-1111-1111-111111111111', 
 '11111111-1111-1111-1111-111111111111', 
 (SELECT id FROM statuts_commande WHERE nom = 'LIVREE'), 
 CURRENT_DATE - 7, 
 '10 Rue des Lilas', 
 31.50, 
 (SELECT id FROM utilisateurs WHERE email = 'marco.rapide@livraison.com'),
 CURRENT_TIMESTAMP - INTERVAL '7 days'
);
INSERT INTO commandes_individuelles_details (commande_id, menu_id, quantite, prix_unitaire) VALUES
('c1111111-1111-1111-1111-111111111111', 1, 1, 13.50),
('c1111111-1111-1111-1111-111111111111', 2, 1, 18.00);

-- Commande 2 : En préparation pour aujourd'hui (pas encore de livreur)
INSERT INTO commandes_individuelles (id, client_id, statut_id, date_livraison, adresse_livraison, montant_total, date_commande) VALUES
('c2222222-2222-2222-2222-222222222222', 
 '11111111-1111-1111-1111-111111111111', 
 (SELECT id FROM statuts_commande WHERE nom = 'EN_PREPARATION'), 
 CURRENT_DATE, 
 '10 Rue des Lilas', 
 15.00,
 CURRENT_TIMESTAMP - INTERVAL '2 hours'
);
INSERT INTO commandes_individuelles_details (commande_id, menu_id, quantite, prix_unitaire) VALUES
('c2222222-2222-2222-2222-222222222222', 3, 1, 15.00);


-- --- Commandes Entreprises pour Innovatech SAS ---

-- Commande 3 : En cours de livraison
INSERT INTO commandes_entreprises (id, client_id, abonnement_id, statut_id, date_livraison, adresse_livraison, montant_total, livreur_id, date_commande) VALUES
('c3333333-3333-3333-3333-333333333333',
 '22222222-2222-2222-2222-222222222222',
 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
 (SELECT id FROM statuts_commande WHERE nom = 'EN_LIVRAISON'),
 CURRENT_DATE,
 '50 Avenue de la Tech',
 75.00,
 (SELECT id FROM utilisateurs WHERE email = 'marco.rapide@livraison.com'),
 CURRENT_TIMESTAMP - INTERVAL '1 hour'
);
INSERT INTO commandes_entreprises_details (commande_id, menu_id, quantite, prix_unitaire) VALUES
('c3333333-3333-3333-3333-333333333333', 3, 5, 15.00);

-- Commande 4 : Annulée (elle doit apparaître dans l'historique avec le bon statut)
INSERT INTO commandes_entreprises (id, client_id, abonnement_id, statut_id, date_livraison, adresse_livraison, montant_total, date_commande) VALUES
('c4444444-4444-4444-4444-444444444444',
 '22222222-2222-2222-2222-222222222222',
 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
 (SELECT id FROM statuts_commande WHERE nom = 'ANNULEE'),
 CURRENT_DATE - 2,
 '50 Avenue de la Tech',
 40.50,
 CURRENT_TIMESTAMP - INTERVAL '2 days'
);
INSERT INTO commandes_entreprises_details (commande_id, menu_id, quantite, prix_unitaire) VALUES
('c4444444-4444-4444-4444-444444444444', 1, 3, 13.50);

-- Commande 5 : Soft-deleted (ne doit PAS apparaître dans les résultats par défaut de votre service)
INSERT INTO commandes_individuelles (id, client_id, statut_id, date_livraison, adresse_livraison, montant_total, deleted_at, date_commande) VALUES
('c5555555-5555-5555-5555-555555555555', 
 '11111111-1111-1111-1111-111111111111', 
 (SELECT id FROM statuts_commande WHERE nom = 'LIVREE'), 
 CURRENT_DATE - 30, 
 '10 Rue des Lilas', 
 18.00,
 CURRENT_TIMESTAMP, -- <-- Marquée comme supprimée
 CURRENT_TIMESTAMP - INTERVAL '30 days'
);
INSERT INTO commandes_individuelles_details (commande_id, menu_id, quantite, prix_unitaire) VALUES
('c5555555-5555-5555-5555-555555555555', 2, 1, 18.00);


-- =============================================
-- TEST DE LA VUE
-- =============================================

-- Cette commande vous montrera immédiatement le résultat attendu.
-- Vous devriez voir 4 commandes (les 4 premières), triées par date de commande la plus récente.
-- La commande 5 (soft-deleted) ne doit pas apparaître.

SELECT * 
FROM v_commandes_historique 
WHERE deleted_at IS NULL
ORDER BY date_commande DESC;