-- =============================================
-- DONNÉES DE TEST POUR LES ABONNEMENTS
-- Système de Gestion de Livraison de Repas
-- =============================================

-- =============================================
-- 1. ZONES DE LIVRAISON
-- =============================================

INSERT INTO zones_livraison (nom, description, localisation) VALUES 
('Centre-ville', 'Zone centre-ville d''Antananarivo', ST_GeomFromText('POINT(47.5314 -18.9137)', 4326)),
('Analakely', 'Quartier Analakely', ST_GeomFromText('POINT(47.5250 -18.9100)', 4326)),
('Tsimbazaza', 'Zone Tsimbazaza', ST_GeomFromText('POINT(47.5200 -18.9200)', 4326)),
('Ankorondrano', 'Quartier Ankorondrano', ST_GeomFromText('POINT(47.5400 -18.9050)', 4326)),
('Behoririka', 'Zone Behoririka', ST_GeomFromText('POINT(47.5180 -18.9080)', 4326));

-- =============================================
-- 2. UTILISATEURS (ROLES NÉCESSAIRES)
-- =============================================

-- Administrateur
INSERT INTO utilisateurs (nom, prenom, email, telephone, mot_de_passe, role_id, zone_livraison_id) VALUES 
('Rakoto', 'Jean', 'admin@cuisine.mg', '+261 34 12 345 67', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1);

-- Chefs cuisiniers
INSERT INTO utilisateurs (nom, prenom, email, telephone, mot_de_passe, role_id, zone_livraison_id) VALUES 
('Randria', 'Marie', 'chef.marie@cuisine.mg', '+261 34 11 111 11', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 1),
('Razafy', 'Paul', 'chef.paul@cuisine.mg', '+261 34 22 222 22', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 2);

-- Cuisiniers
INSERT INTO utilisateurs (nom, prenom, email, telephone, mot_de_passe, role_id, zone_livraison_id) VALUES 
('Andrianjo', 'Hery', 'cuisinier1@cuisine.mg', '+261 34 33 333 33', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, 1),
('Rasoamalala', 'Niry', 'cuisinier2@cuisine.mg', '+261 34 44 444 44', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, 2),
('Rabary', 'Fidy', 'cuisinier3@cuisine.mg', '+261 34 55 555 55', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, 3);

-- Livreurs
INSERT INTO utilisateurs (nom, prenom, email, telephone, mot_de_passe, role_id, zone_livraison_id) VALUES 
('Rakotomalala', 'Vola', 'livreur1@cuisine.mg', '+261 34 66 666 66', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 4, 1),
('Raharison', 'Tojo', 'livreur2@cuisine.mg', '+261 34 77 777 77', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 4, 2),
('Rajaonarivelo', 'Mamy', 'livreur3@cuisine.mg', '+261 34 88 888 88', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 4, 3);

-- =============================================
-- 3. CLIENTS ENTREPRISES
-- =============================================

INSERT INTO clients (nom, prenom, email, telephone, adresse, type_client) VALUES 
('TELMA SA', NULL, 'commandes@telma.mg', '+261 20 22 222 22', 'Ankorondrano, Antananarivo 101', 'ENTREPRISE'),
('BOA Madagascar', NULL, 'restaurant@boa.mg', '+261 20 22 333 33', 'Analakely, Antananarivo 101', 'ENTREPRISE'),
('Orange Madagascar', NULL, 'cantina@orange.mg', '+261 20 22 444 44', 'Tsimbazaza, Antananarivo 101', 'ENTREPRISE'),
('Société Générale', NULL, 'repas@socgen.mg', '+261 20 22 555 55', 'Centre-ville, Antananarivo 101', 'ENTREPRISE'),
('Air Madagascar', NULL, 'catering@airmadagascar.mg', '+261 20 22 666 66', 'Behoririka, Antananarivo 101', 'ENTREPRISE'),
('Jovenna SA', NULL, 'rh@jovenna.mg', '+261 20 22 777 77', 'Ankorondrano, Antananarivo 101', 'ENTREPRISE'),
('Total Madagascar', NULL, 'administration@total.mg', '+261 20 22 888 88', 'Analakely, Antananarivo 101', 'ENTREPRISE'),
('Axian Group', NULL, 'services@axian.mg', '+261 20 22 999 99', 'Centre-ville, Antananarivo 101', 'ENTREPRISE');

-- =============================================
-- 4. ABONNEMENTS ENTREPRISES
-- =============================================

-- Abonnements SILVER actifs
INSERT INTO abonnements (client_id, type_abonnement_id, nb_employes, date_debut, date_fin, actif) VALUES 
(
    (SELECT id FROM clients WHERE nom = 'TELMA SA'),
    (SELECT id FROM types_abonnement WHERE nom = 'SILVER'),
    25,
    '2024-01-15',
    '2024-12-31',
    TRUE
),
(
    (SELECT id FROM clients WHERE nom = 'Société Générale'),
    (SELECT id FROM types_abonnement WHERE nom = 'SILVER'),
    15,
    '2024-02-01',
    '2024-12-31',
    TRUE
),
(
    (SELECT id FROM clients WHERE nom = 'Jovenna SA'),
    (SELECT id FROM types_abonnement WHERE nom = 'SILVER'),
    20,
    '2024-03-01',
    '2024-12-31',
    TRUE
);

-- Abonnements GOLD actifs
INSERT INTO abonnements (client_id, type_abonnement_id, nb_employes, date_debut, date_fin, actif) VALUES 
(
    (SELECT id FROM clients WHERE nom = 'BOA Madagascar'),
    (SELECT id FROM types_abonnement WHERE nom = 'GOLD'),
    35,
    '2024-01-01',
    '2024-12-31',
    TRUE
),
(
    (SELECT id FROM clients WHERE nom = 'Orange Madagascar'),
    (SELECT id FROM types_abonnement WHERE nom = 'GOLD'),
    40,
    '2024-02-15',
    '2024-12-31',
    TRUE
),
(
    (SELECT id FROM clients WHERE nom = 'Air Madagascar'),
    (SELECT id FROM types_abonnement WHERE nom = 'GOLD'),
    30,
    '2024-01-10',
    '2024-12-31',
    TRUE
),
(
    (SELECT id FROM clients WHERE nom = 'Axian Group'),
    (SELECT id FROM types_abonnement WHERE nom = 'GOLD'),
    50,
    '2024-03-15',
    '2024-12-31',
    TRUE
);

-- Abonnement expiré (pour les tests)
INSERT INTO abonnements (client_id, type_abonnement_id, nb_employes, date_debut, date_fin, actif) VALUES 
(
    (SELECT id FROM clients WHERE nom = 'Total Madagascar'),
    (SELECT id FROM types_abonnement WHERE nom = 'SILVER'),
    18,
    '2023-01-01',
    '2023-12-31',
    FALSE
);

-- =============================================
-- 5. INGRÉDIENTS ET STOCKS
-- =============================================

INSERT INTO ingredients (nom, unite_mesure, prix_unitaire, stock_minimum) VALUES 
('Riz blanc', 'kg', 2.50, 50.00),
('Viande de bœuf', 'kg', 15.00, 20.00),
('Poulet', 'kg', 8.00, 30.00),
('Porc', 'kg', 12.00, 15.00),
('Poisson frais', 'kg', 10.00, 25.00),
('Légumes variés', 'kg', 3.00, 40.00),
('Huile de cuisson', 'L', 4.00, 10.00),
('Épices malgaches', 'kg', 25.00, 5.00),
('Lait de coco', 'L', 6.00, 15.00),
('Tomates', 'kg', 2.00, 20.00);

-- Stock initial
INSERT INTO exemplaires_ingredient (ingredient_id, quantite, date_peremption) VALUES 
(1, 100.00, '2025-12-31'), -- Riz
(2, 50.00, '2025-07-15'),  -- Bœuf
(3, 80.00, '2025-07-20'),  -- Poulet
(4, 30.00, '2025-07-18'),  -- Porc
(5, 40.00, '2025-07-12'),  -- Poisson
(6, 60.00, '2025-07-14'),  -- Légumes
(7, 25.00, '2025-12-31'),  -- Huile
(8, 10.00, '2025-12-31'),  -- Épices
(9, 30.00, '2025-08-01'),  -- Lait de coco
(10, 35.00, '2025-07-16'); -- Tomates

-- =============================================
-- 6. MENUS DISPONIBLES
-- =============================================

INSERT INTO menus (nom, description, prix_carte, temps_preparation, disponible, photo_url) VALUES 
('Romazava traditionnel', 'Plat traditionnel malgache au bœuf et légumes verts', 12.00, 45, TRUE, 'romazava.jpg'),
('Ravitoto au porc', 'Feuilles de manioc pilées avec du porc', 14.00, 60, TRUE, 'ravitoto.jpg'),
('Henakisoa sy voanjobory', 'Porc aux haricots blancs', 13.00, 50, TRUE, 'henakisoa.jpg'),
('Akoho sy voanio', 'Poulet au lait de coco', 15.00, 40, TRUE, 'akoho.jpg'),
('Trondro gasy', 'Poisson à la malgache', 16.00, 35, TRUE, 'trondro.jpg'),
('Vary amin''anana', 'Riz aux légumes verts', 10.00, 30, TRUE, 'vary_anana.jpg'),
('Kitoza sy vary', 'Viande séchée avec du riz', 18.00, 25, TRUE, 'kitoza.jpg'),
('Lasopy', 'Soupe malgache consistante', 8.00, 40, TRUE, 'lasopy.jpg'),
('Akoho misy sakamalao', 'Poulet au gingembre', 14.00, 45, TRUE, 'akoho_sakamalao.jpg'),
('Henan-kisoa ritra', 'Porc grillé traditionnel', 16.00, 55, TRUE, 'henan_kisoa.jpg'),
('Sambos', 'Beignets de viande ou légumes', 6.00, 20, TRUE, 'sambos.jpg'),
('Mofo gasy', 'Pain malgache traditionnel', 4.00, 15, TRUE, 'mofo_gasy.jpg'),
('Koba ravina', 'Gâteau de riz dans feuilles de bananier', 5.00, 90, TRUE, 'koba.jpg'),
('Vary be menaka', 'Riz gras à la malgache', 11.00, 35, TRUE, 'vary_menaka.jpg'),
('Voanjobory sy henakisoa', 'Haricots blancs au porc', 12.00, 50, TRUE, 'voanjobory.jpg');

-- =============================================
-- 7. RECETTES (LIAISON MENUS-INGRÉDIENTS)
-- =============================================

-- Romazava traditionnel
INSERT INTO recettes (menu_id, ingredient_id, quantite) VALUES 
(1, 1, 0.2), -- Riz
(1, 2, 0.15), -- Bœuf
(1, 6, 0.1), -- Légumes
(1, 8, 0.01); -- Épices

-- Ravitoto au porc
INSERT INTO recettes (menu_id, ingredient_id, quantite) VALUES 
(2, 1, 0.2), -- Riz
(2, 4, 0.15), -- Porc
(2, 6, 0.12), -- Légumes
(2, 8, 0.01); -- Épices

-- Henakisoa sy voanjobory
INSERT INTO recettes (menu_id, ingredient_id, quantite) VALUES 
(3, 1, 0.2), -- Riz
(3, 4, 0.15), -- Porc
(3, 6, 0.08), -- Légumes
(3, 8, 0.01); -- Épices

-- Akoho sy voanio
INSERT INTO recettes (menu_id, ingredient_id, quantite) VALUES 
(4, 1, 0.2), -- Riz
(4, 3, 0.15), -- Poulet
(4, 9, 0.05), -- Lait de coco
(4, 8, 0.01); -- Épices

-- Trondro gasy
INSERT INTO recettes (menu_id, ingredient_id, quantite) VALUES 
(5, 1, 0.2), -- Riz
(5, 5, 0.15), -- Poisson
(5, 10, 0.08), -- Tomates
(5, 8, 0.01); -- Épices

-- =============================================
-- 8. BOISSONS (POUR GOLD)
-- =============================================

INSERT INTO boissons (nom, prix, disponible) VALUES 
('Jus de fruits locaux', 3.50, TRUE),
('Thé malgache', 2.00, TRUE),
('Café arabica', 2.50, TRUE),
('Ranonapango', 1.50, TRUE),
('Jus de tamarin', 3.00, TRUE),
('Eau minérale', 1.00, TRUE);

-- =============================================
-- 9. ACCOMPAGNEMENTS (ENTRÉES ET DESSERTS)
-- =============================================

INSERT INTO accompagnements (nom, type, description, prix_unitaire) VALUES 
('Salade malgache', 'ENTREE', 'Salade de légumes locaux', 4.00),
('Sambos aux légumes', 'ENTREE', 'Beignets de légumes croustillants', 3.50),
('Soupe de légumes', 'ENTREE', 'Soupe chaude aux légumes du jour', 3.00),
('Koba ravina', 'DESSERT', 'Gâteau de riz traditionnel', 5.00),
('Fruits de saison', 'DESSERT', 'Sélection de fruits frais locaux', 4.50),
('Bonbon coco', 'DESSERT', 'Confiserie locale à la noix de coco', 3.00);

-- =============================================
-- 10. CONFIGURATION MENUS PAR ABONNEMENT
-- =============================================

-- Menus disponibles pour SILVER (5 menus)
INSERT INTO menu_type_abonnement (menu_id, type_abonnement_id, disponible) VALUES 
(1, 1, TRUE), -- Romazava pour SILVER
(2, 1, TRUE), -- Ravitoto pour SILVER
(3, 1, TRUE), -- Henakisoa pour SILVER
(6, 1, TRUE), -- Vary amin'anana pour SILVER
(8, 1, TRUE); -- Lasopy pour SILVER

-- Menus disponibles pour GOLD (15 menus)
INSERT INTO menu_type_abonnement (menu_id, type_abonnement_id, disponible) VALUES 
(1, 2, TRUE), -- Romazava pour GOLD
(2, 2, TRUE), -- Ravitoto pour GOLD
(3, 2, TRUE), -- Henakisoa pour GOLD
(4, 2, TRUE), -- Akoho sy voanio pour GOLD
(5, 2, TRUE), -- Trondro gasy pour GOLD
(6, 2, TRUE), -- Vary amin'anana pour GOLD
(7, 2, TRUE), -- Kitoza pour GOLD
(8, 2, TRUE), -- Lasopy pour GOLD
(9, 2, TRUE), -- Akoho misy sakamalao pour GOLD
(10, 2, TRUE), -- Henan-kisoa ritra pour GOLD
(11, 2, TRUE), -- Sambos pour GOLD
(12, 2, TRUE), -- Mofo gasy pour GOLD
(13, 2, TRUE), -- Koba ravina pour GOLD
(14, 2, TRUE), -- Vary be menaka pour GOLD
(15, 2, TRUE); -- Voanjobory pour GOLD

-- =============================================
-- 11. ACCOMPAGNEMENTS PAR ABONNEMENT
-- =============================================

-- Accompagnements pour SILVER (limités)
INSERT INTO accompagnement_type_abonnement (accompagnement_id, type_abonnement_id, disponible) VALUES 
(1, 1, TRUE), -- Salade malgache pour SILVER
(3, 1, TRUE); -- Soupe de légumes pour SILVER

-- Accompagnements pour GOLD (tous disponibles)
INSERT INTO accompagnement_type_abonnement (accompagnement_id, type_abonnement_id, disponible) VALUES 
(1, 2, TRUE), -- Salade malgache pour GOLD
(2, 2, TRUE), -- Sambos aux légumes pour GOLD
(3, 2, TRUE), -- Soupe de légumes pour GOLD
(4, 2, TRUE), -- Koba ravina pour GOLD
(5, 2, TRUE), -- Fruits de saison pour GOLD
(6, 2, TRUE); -- Bonbon coco pour GOLD

-- =============================================
-- 12. BONS DE COMMANDE HEBDOMADAIRES
-- =============================================

-- Semaine du 8-12 juillet 2024 (semaine courante)
INSERT INTO bons_commande (abonnement_id, semaine_debut, semaine_fin, statut) VALUES 
(
    (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'BOA Madagascar')),
    '2024-07-08',
    '2024-07-12',
    'VALIDE'
),
(
    (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'TELMA SA')),
    '2024-07-08',
    '2024-07-12',
    'VALIDE'
),
(
    (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'Orange Madagascar')),
    '2024-07-08',
    '2024-07-12',
    'VALIDE'
);

-- Semaine du 15-19 juillet 2024 (semaine prochaine)
INSERT INTO bons_commande (abonnement_id, semaine_debut, semaine_fin, statut) VALUES 
(
    (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'Air Madagascar')),
    '2024-07-15',
    '2024-07-19',
    'EN_ATTENTE'
),
(
    (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'Axian Group')),
    '2024-07-15',
    '2024-07-19',
    'EN_ATTENTE'
);

-- =============================================
-- 13. SÉLECTIONS HEBDOMADAIRES
-- =============================================

-- Sélections pour BOA Madagascar (GOLD - 35 employés)
INSERT INTO selections_hebdomadaires (bon_commande_id, menu_id, jour_semaine, quantite) VALUES 
(
    (SELECT id FROM bons_commande WHERE abonnement_id = (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'BOA Madagascar')) AND semaine_debut = '2024-07-08'),
    1, 1, 15  -- Lundi: Romazava, 15 portions
),
(
    (SELECT id FROM bons_commande WHERE abonnement_id = (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'BOA Madagascar')) AND semaine_debut = '2024-07-08'),
    4, 1, 20  -- Lundi: Akoho sy voanio, 20 portions
),
(
    (SELECT id FROM bons_commande WHERE abonnement_id = (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'BOA Madagascar')) AND semaine_debut = '2024-07-08'),
    2, 2, 18  -- Mardi: Ravitoto, 18 portions
),
(
    (SELECT id FROM bons_commande WHERE abonnement_id = (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'BOA Madagascar')) AND semaine_debut = '2024-07-08'),
    5, 2, 17  -- Mardi: Trondro gasy, 17 portions
),
(
    (SELECT id FROM bons_commande WHERE abonnement_id = (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'BOA Madagascar')) AND semaine_debut = '2024-07-08'),
    7, 3, 20  -- Mercredi: Kitoza, 20 portions
),
(
    (SELECT id FROM bons_commande WHERE abonnement_id = (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'BOA Madagascar')) AND semaine_debut = '2024-07-08'),
    9, 3, 15  -- Mercredi: Akoho misy sakamalao, 15 portions
);

-- Sélections pour TELMA SA (SILVER - 25 employés)
INSERT INTO selections_hebdomadaires (bon_commande_id, menu_id, jour_semaine, quantite) VALUES 
(
    (SELECT id FROM bons_commande WHERE abonnement_id = (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'TELMA SA')) AND semaine_debut = '2024-07-08'),
    1, 1, 25  -- Lundi: Romazava, 25 portions
),
(
    (SELECT id FROM bons_commande WHERE abonnement_id = (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'TELMA SA')) AND semaine_debut = '2024-07-08'),
    2, 2, 25  -- Mardi: Ravitoto, 25 portions
),
(
    (SELECT id FROM bons_commande WHERE abonnement_id = (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'TELMA SA')) AND semaine_debut = '2024-07-08'),
    6, 3, 25  -- Mercredi: Vary amin'anana, 25 portions
),
(
    (SELECT id FROM bons_commande WHERE abonnement_id = (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'TELMA SA')) AND semaine_debut = '2024-07-08'),
    8, 4, 25  -- Jeudi: Lasopy, 25 portions
),
(
    (SELECT id FROM bons_commande WHERE abonnement_id = (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'TELMA SA')) AND semaine_debut = '2024-07-08'),
    3, 5, 25  -- Vendredi: Henakisoa, 25 portions
);

-- =============================================
-- 14. COMMANDES ENTREPRISES (GÉNÉRÉES À PARTIR DES SÉLECTIONS)
-- =============================================

-- Commandes pour BOA Madagascar
INSERT INTO commandes_entreprises (numero_commande, client_id, abonnement_id, statut_id, date_commande, date_livraison, adresse_livraison, montant_total, livreur_id) VALUES 
(
    generer_numero_commande('ENTREPRISE'),
    (SELECT id FROM clients WHERE nom = 'BOA Madagascar'),
    (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'BOA Madagascar')),
    2, -- EN_PREPARATION
    '2024-07-08 08:00:00',
    '2024-07-08',
    'Analakely, Antananarivo 101',
    630.00, -- 35 repas × 18€
    (SELECT id FROM utilisateurs WHERE nom = 'Raharison')
),
(
    generer_numero_commande('ENTREPRISE'),
    (SELECT id FROM clients WHERE nom = 'BOA Madagascar'),
    (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'BOA Madagascar')),
    1, -- RECUE
    '2024-07-09 08:00:00',
    '2024-07-09',
    'Analakely, Antananarivo 101',
    630.00,
    (SELECT id FROM utilisateurs WHERE nom = 'Raharison')
);

-- Commandes pour TELMA SA
INSERT INTO commandes_entreprises (numero_commande, client_id, abonnement_id, statut_id, date_commande, date_livraison, adresse_livraison, montant_total, livreur_id) VALUES 
(
    generer_numero_commande('ENTREPRISE'),
    (SELECT id FROM clients WHERE nom = 'TELMA SA'),
    (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'TELMA SA')),
    3, -- PRETE
    '2024-07-08 08:00:00',
    '2024-07-08',
    'Ankorondrano, Antananarivo 101',
    312.50, -- 25 repas × 12.50€
    (SELECT id FROM utilisateurs WHERE nom = 'Rakotomalala')
),
(
    generer_numero_commande('ENTREPRISE'),
    (SELECT id FROM clients WHERE nom = 'TELMA SA'),
    (SELECT id FROM abonnements WHERE client_id = (SELECT id FROM clients WHERE nom = 'TELMA SA')),
    4, -- EN_LIVRAISON
    '2024-07-09 08:00:00',
    '2024-07-09',
    'Ankorondrano, Antananarivo 101',
    312.50,
    (SELECT id FROM utilisateurs WHERE nom = 'Rakotomalala')
);

-- =============================================
-- 15. DÉTAILS DES COMMANDES ENTREPRISES
-- =============================================

-- Détails pour BOA Madagascar - Commande 1
INSERT INTO commandes_entreprises_details (commande_id, menu_id, quantite, prix_unitaire, boisson_id, notes) VALUES 
(
    (SELECT id FROM commandes_entreprises WHERE client_id = (SELECT id FROM clients WHERE nom = 'BOA Madagascar') AND date_livraison = '2024-07-08'),
    1, 15, 18.00, 1, 'Romazava traditionnel avec jus de fruits'
),
(
    (SELECT id FROM commandes_entreprises WHERE client_id = (SELECT id FROM clients WHERE nom = 'BOA Madagascar') AND date_livraison = '2024-07-08'),
    4, 20, 18.00, 3, 'Akoho sy voanio avec café'
);

-- Détails pour TELMA SA - Commande 1
INSERT INTO commandes_entreprises_details (commande_id, menu_id, quantite, prix_unitaire, notes) VALUES 
(
    (SELECT id FROM commandes_entreprises WHERE client_id = (SELECT id FROM clients WHERE nom = 'TELMA SA') AND date_livraison = '2024-07-08'),
    1, 25, 12.50, 'Romazava traditionnel - abonnement SILVER'
);

-- =============================================
-- 16. PLANNING DE PRODUCTION
-- =============================================

INSERT INTO planning_production (menu_id, date_production, quantite_prevue, quantite_produite, cuisinier_id, temps_prevu, temps_reel, statut) VALUES 
(1, '2024-07-08', 40, 40, (SELECT id FROM utilisateurs