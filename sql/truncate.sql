-- Script de réinitialisation des données de la base cuisine_db
-- Utilise TRUNCATE pour vider les tables et réinitialise les séquences
-- Préserve la structure, les index, fonctions, triggers et vues

-- Connexion à la base de données
\c cuisine_db

-- Désactivation temporaire des contraintes de clés étrangères
SET session_replication_role = replica;

-- Troncature de toutes les tables
TRUNCATE TABLE types_abonnement, statuts_commande, zones_livraison, roles, utilisateurs, 
sessions, clients, abonnements, ingredients, exemplaires_ingredient, menus, recettes, 
boissons, accompagnements, menu_type_abonnement, accompagnement_type_abonnement, 
menus_favoris, critere_fidelite, reduction, clients_individuels_fideles, 
commandes_individuelles, commandes_entreprises, commandes_individuelles_details, 
commandes_entreprises_details, bons_commande, selections_hebdomadaires, salaires, 
planning_production, mouvements_stock, factures_individuelles, factures_entreprises, 
factures_individuelles_details, factures_entreprises_details, paiements_individuels, 
paiements_entreprises, livraisons_individuelles, livraisons_entreprises, alertes 
CASCADE;

-- Réinitialisation des séquences pour les tables avec SERIAL
ALTER SEQUENCE types_abonnement_id_seq RESTART WITH 1;
ALTER SEQUENCE statuts_commande_id_seq RESTART WITH 1;
ALTER SEQUENCE zones_livraison_id_seq RESTART WITH 1;
ALTER SEQUENCE roles_id_seq RESTART WITH 1;
ALTER SEQUENCE ingredients_id_seq RESTART WITH 1;
ALTER SEQUENCE exemplaires_ingredient_id_seq RESTART WITH 1;
ALTER SEQUENCE menus_id_seq RESTART WITH 1;
ALTER SEQUENCE recettes_id_seq RESTART WITH 1;
ALTER SEQUENCE boissons_id_seq RESTART WITH 1;
ALTER SEQUENCE accompagnements_id_seq RESTART WITH 1;
ALTER SEQUENCE menu_type_abonnement_id_seq RESTART WITH 1;
ALTER SEQUENCE accompagnement_type_abonnement_id_seq RESTART WITH 1;
ALTER SEQUENCE menus_favoris_id_seq RESTART WITH 1;
ALTER SEQUENCE critere_fidelite_id_seq RESTART WITH 1;
ALTER SEQUENCE reduction_id_seq RESTART WITH 1;
ALTER SEQUENCE clients_individuels_fideles_id_seq RESTART WITH 1;
ALTER SEQUENCE commandes_individuelles_details_id_seq RESTART WITH 1;
ALTER SEQUENCE commandes_entreprises_details_id_seq RESTART WITH 1;
ALTER SEQUENCE selections_hebdomadaires_id_seq RESTART WITH 1;
ALTER SEQUENCE salaires_id_seq RESTART WITH 1;
ALTER SEQUENCE planning_production_id_seq RESTART WITH 1;
ALTER SEQUENCE mouvements_stock_id_seq RESTART WITH 1;
ALTER SEQUENCE factures_individuelles_details_id_seq RESTART WITH 1;
ALTER SEQUENCE factures_entreprises_details_id_seq RESTART WITH 1;
ALTER SEQUENCE alertes_id_seq RESTART WITH 1;

-- Réactivation des contraintes de clés étrangères
SET session_replication_role = DEFAULT;

-- Réinsertion des données de référence essentielles
INSERT INTO roles (nom, description) VALUES 
('ADMIN', 'Administrateur - Accès complet au système'),
('CHEF_CUISINIER', 'Chef cuisinier - Gestion menus et stocks'),
('CUISINIER', 'Cuisinier - Production et préparation'),
('LIVREUR', 'Livreur - Livraisons et logistique'),
('CLIENT', 'Client - Commandes et suivi');

INSERT INTO types_abonnement (nom, prix_jour, nb_menus_disponibles, description) VALUES 
('SILVER', 12.50, 5, 'Abonnement SILVER - 5 menus au choix par jour'),
('GOLD', 18.00, 15, 'Abonnement GOLD - 15 menus au choix + boissons + desserts');

INSERT INTO statuts_commande (nom, ordre) VALUES 
('RECUE', 1),
('EN_PREPARATION', 2),
('PRETE', 3),
('EN_LIVRAISON', 4),
('LIVREE', 5),
('ANNULEE', 6);

INSERT INTO critere_fidelite (prix_a_atteindre) VALUES (500.00);

INSERT INTO reduction (pourcentage) VALUES (5.00), (10.00), (15.00);

-- Confirmation de la réinitialisation
SELECT 'Base de données cuisine_db réinitialisée avec succès. Toutes les données ont été supprimées et les séquences réinitialisées.' AS message;