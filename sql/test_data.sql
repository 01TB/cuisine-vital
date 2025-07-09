-- =============================================
-- DONNÉES POUR LA CUISINE MALGACHE
-- =============================================

-- Types d'abonnement
INSERT INTO types_abonnement (nom, prix_jour, nb_menus_disponibles, description) VALUES
('SILVER', 8.50, 3, 'Abonnement basique avec 3 menus au choix par jour'),
('GOLD', 12.00, 5, 'Abonnement premium avec 5 menus au choix, entrées, desserts et boissons inclus');

-- Statuts des commandes
INSERT INTO statuts_commande (nom, ordre) VALUES
('EN_ATTENTE', 1),
('CONFIRMEE', 2),
('EN_PREPARATION', 3),
('PRETE', 4),
('EN_LIVRAISON', 5),
('LIVREE', 6),
('ANNULEE', 7);

-- Zones de livraison (principales zones d'Antananarivo)
INSERT INTO zones_livraison (nom, description) VALUES
('Antaninarenina', 'Centre-ville, quartier des affaires'),
('Analakely', 'Marché central et environs'),
('Isotry', 'Quartier résidentiel sud'),
('Behoririka', 'Zone commerciale'),
('Ambatonakanga', 'Quartier historique'),
('Tsaralalàna', 'Zone administrative'),
('Ankadifotsy', 'Quartier résidentiel'),
('Ampefiloha', 'Zone diplomatique');

-- Rôles utilisateur
INSERT INTO roles (nom, description) VALUES
('ADMIN', 'Administrateur système'),
('CUISINIER', 'Chef cuisinier'),
('LIVREUR', 'Livreur'),
('GESTIONNAIRE_STOCK', 'Gestionnaire des stocks'),
('COMMERCIAL', 'Responsable commercial');

-- =============================================
-- INGRÉDIENTS MALGACHES
-- =============================================

INSERT INTO ingredients (nom, unite_mesure, prix_unitaire, stock_minimum) VALUES
-- Riz et céréales
('Riz blanc', 'kg', 1.20, 50.00),
('Riz rouge', 'kg', 1.80, 20.00),
('Vary sosoa (riz gluant)', 'kg', 2.50, 10.00),

-- Viandes
('Zébu (bœuf malgache)', 'kg', 12.00, 25.00),
('Porc noir malgache', 'kg', 10.00, 15.00),
('Poulet gasy', 'kg', 8.00, 20.00),
('Canard', 'kg', 15.00, 10.00),
('Poisson d''eau douce', 'kg', 18.00, 8.00),

-- Légumes locaux
('Brèdes mafana', 'kg', 2.00, 5.00),
('Brèdes morelle', 'kg', 1.80, 5.00),
('Brèdes chouchou', 'kg', 1.50, 8.00),
('Anana (brèdes diverses)', 'kg', 2.20, 10.00),
('Voanjobory (haricots bambara)', 'kg', 3.50, 15.00),
('Tsaramaso (haricots rouges)', 'kg', 2.80, 20.00),
('Voanjo (arachides)', 'kg', 4.00, 12.00),
('Patate douce', 'kg', 1.20, 30.00),
('Manioc', 'kg', 0.80, 40.00),
('Taro', 'kg', 2.00, 15.00),
('Songe', 'kg', 1.50, 20.00),
('Voatabia (courge)', 'kg', 1.00, 25.00),
('Voandalana (aubergine africaine)', 'kg', 2.50, 10.00),
('Kitoza (viande séchée)', 'kg', 25.00, 5.00),

-- Légumes communs
('Oignon', 'kg', 2.00, 15.00),
('Ail', 'kg', 8.00, 3.00),
('Gingembre', 'kg', 6.00, 5.00),
('Tomate', 'kg', 2.50, 20.00),
('Carotte', 'kg', 1.80, 15.00),
('Chou', 'kg', 1.20, 10.00),
('Salade', 'kg', 2.00, 8.00),

-- Épices et condiments malgaches
('Sakay (piment malgache)', 'kg', 15.00, 2.00),
('Feuilles de curry', 'kg', 8.00, 1.00),
('Curcuma frais', 'kg', 5.00, 3.00),
('Huile d''arachide', 'L', 4.00, 10.00),
('Lait de coco', 'L', 3.50, 15.00),
('Sel', 'kg', 0.50, 20.00),
('Poivre noir', 'kg', 12.00, 2.00),

-- Fruits tropicaux
('Mangue', 'kg', 3.00, 20.00),
('Litchi', 'kg', 4.00, 15.00),
('Ananas', 'pièce', 2.00, 25.00),
('Banane', 'kg', 1.50, 30.00),
('Papaye', 'kg', 2.50, 15.00),
('Goyave', 'kg', 3.50, 10.00),
('Tamarind', 'kg', 5.00, 8.00),
('Corossol', 'kg', 6.00, 5.00),

-- Produits laitiers et œufs
('Lait', 'L', 1.80, 20.00),
('Œufs', 'pièce', 0.30, 100.00),
('Fromage local', 'kg', 8.00, 5.00),

-- Autres
('Noix de coco', 'pièce', 1.00, 50.00),
('Farine de blé', 'kg', 1.50, 25.00),
('Farine de manioc', 'kg', 2.00, 15.00),
('Huile de coco', 'L', 6.00, 8.00),
('Vanille', 'kg', 150.00, 0.50);

-- =============================================
-- MENUS MALGACHES
-- =============================================

INSERT INTO menus (nom, description, prix_carte, temps_preparation, disponible, valide, photo_url) VALUES
-- Plats principaux traditionnels
('Romazava', 'Plat national malgache avec zébu, brèdes mafana et anana, accompagné de riz blanc', 15.00, 90, true, true, '/images/romazava.jpg'),
('Ravitoto sy henakisoa', 'Feuilles de manioc pilées avec porc, plat emblématique du sud', 14.00, 120, true, true, '/images/ravitoto.jpg'),
('Akoho sy voanio', 'Poulet au lait de coco, spécialité de la côte', 16.00, 75, true, true, '/images/akoho_voanio.jpg'),
('Hen''omby ritra', 'Viande de zébu aux brèdes, saveur authentique', 17.00, 85, true, true, '/images/henomby_ritra.jpg'),
('Vary amin''anana', 'Riz sauté aux légumes verts et viande', 12.00, 45, true, true, '/images/vary_anana.jpg'),
('Trondro gasy', 'Poisson d''eau douce aux légumes locaux', 18.00, 60, true, true, '/images/trondro_gasy.jpg'),
('Voanjobory sy henakisoa', 'Haricots bambara au porc, consistant et savoureux', 13.00, 70, true, true, '/images/voanjobory.jpg'),
('Sosoa sy rononkisoa', 'Riz gluant au lait de coco sucré', 10.00, 40, true, true, '/images/sosoa.jpg'),
('Hena-kisoa sy tsaramaso', 'Porc aux haricots rouges, plat familial', 14.50, 80, true, true, '/images/hena_tsaramaso.jpg'),
('Kitoza sy vary', 'Viande séchée grillée avec riz rouge', 19.00, 35, true, true, '/images/kitoza.jpg'),
('Akoho misy sakamalao', 'Poulet au gingembre et curcuma', 15.50, 65, true, true, '/images/akoho_sakamalao.jpg'),
('Hen''omby sy voatabia', 'Bœuf à la courge, mijotage traditionnel', 16.50, 95, true, true, '/images/henomby_voatabia.jpg');

-- =============================================
-- RECETTES (INGRÉDIENTS PAR MENU)
-- =============================================

-- Romazava (Menu ID: 1)
INSERT INTO recettes (menu_id, ingredient_id, quantite) VALUES
(1, 1, 0.25),  -- Riz blanc
(1, 4, 0.20),  -- Zébu
(1, 10, 0.15), -- Brèdes mafana
(1, 13, 0.10), -- Anana
(1, 21, 0.05), -- Oignon
(1, 22, 0.01), -- Ail
(1, 23, 0.01), -- Gingembre
(1, 24, 0.05), -- Tomate
(1, 29, 0.01), -- Sakay
(1, 33, 0.01); -- Sel

-- Ravitoto sy henakisoa (Menu ID: 2)
INSERT INTO recettes (menu_id, ingredient_id, quantite) VALUES
(2, 1, 0.25),  -- Riz blanc
(2, 5, 0.20),  -- Porc noir malgache
(2, 18, 0.30), -- Manioc (feuilles)
(2, 21, 0.05), -- Oignon
(2, 22, 0.01), -- Ail
(2, 31, 0.02), -- Huile d''arachide
(2, 33, 0.01); -- Sel

-- Akoho sy voanio (Menu ID: 3)
INSERT INTO recettes (menu_id, ingredient_id, quantite) VALUES
(3, 1, 0.25),  -- Riz blanc
(3, 6, 0.30),  -- Poulet gasy
(3, 32, 0.15), -- Lait de coco
(3, 21, 0.05), -- Oignon
(3, 22, 0.01), -- Ail
(3, 23, 0.01), -- Gingembre
(3, 31, 0.02), -- Huile d''arachide
(3, 33, 0.01); -- Sel

-- Hen''omby ritra (Menu ID: 4)
INSERT INTO recettes (menu_id, ingredient_id, quantite) VALUES
(4, 1, 0.25),  -- Riz blanc
(4, 4, 0.25),  -- Zébu
(4, 11, 0.15), -- Brèdes morelle
(4, 21, 0.05), -- Oignon
(4, 22, 0.01), -- Ail
(4, 24, 0.10), -- Tomate
(4, 31, 0.02), -- Huile d''arachide
(4, 33, 0.01); -- Sel

-- Vary amin''anana (Menu ID: 5)
INSERT INTO recettes (menu_id, ingredient_id, quantite) VALUES
(5, 1, 0.30),  -- Riz blanc
(5, 6, 0.15),  -- Poulet gasy
(5, 13, 0.20), -- Anana
(5, 21, 0.05), -- Oignon
(5, 22, 0.01), -- Ail
(5, 31, 0.02), -- Huile d''arachide
(5, 33, 0.01); -- Sel

-- Trondro gasy (Menu ID: 6)
INSERT INTO recettes (menu_id, ingredient_id, quantite) VALUES
(6, 1, 0.25),  -- Riz blanc
(6, 8, 0.25),  -- Poisson d''eau douce
(6, 12, 0.15), -- Brèdes chouchou
(6, 21, 0.05), -- Oignon
(6, 22, 0.01), -- Ail
(6, 23, 0.01), -- Gingembre
(6, 24, 0.10), -- Tomate
(6, 31, 0.02), -- Huile d''arachide
(6, 33, 0.01); -- Sel

-- Voanjobory sy henakisoa (Menu ID: 7)
INSERT INTO recettes (menu_id, ingredient_id, quantite) VALUES
(7, 1, 0.25),  -- Riz blanc
(7, 5, 0.20),  -- Porc noir malgache
(7, 14, 0.20), -- Voanjobory
(7, 21, 0.05), -- Oignon
(7, 22, 0.01), -- Ail
(7, 31, 0.02), -- Huile d''arachide
(7, 33, 0.01); -- Sel

-- Sosoa sy rononkisoa (Menu ID: 8)
INSERT INTO recettes (menu_id, ingredient_id, quantite) VALUES
(8, 3, 0.25),  -- Vary sosoa
(8, 32, 0.20), -- Lait de coco
(8, 44, 0.05), -- Noix de coco
(8, 33, 0.01); -- Sel

-- Hena-kisoa sy tsaramaso (Menu ID: 9)
INSERT INTO recettes (menu_id, ingredient_id, quantite) VALUES
(9, 1, 0.25),  -- Riz blanc
(9, 5, 0.20),  -- Porc noir malgache
(9, 15, 0.15), -- Tsaramaso
(9, 21, 0.05), -- Oignon
(9, 22, 0.01), -- Ail
(9, 31, 0.02), -- Huile d''arachide
(9, 33, 0.01); -- Sel

-- Kitoza sy vary (Menu ID: 10)
INSERT INTO recettes (menu_id, ingredient_id, quantite) VALUES
(10, 2, 0.25),  -- Riz rouge
(10, 20, 0.15), -- Kitoza
(10, 21, 0.02), -- Oignon
(10, 29, 0.01), -- Sakay
(10, 31, 0.01); -- Huile d''arachide

-- Akoho misy sakamalao (Menu ID: 11)
INSERT INTO recettes (menu_id, ingredient_id, quantite) VALUES
(11, 1, 0.25),  -- Riz blanc
(11, 6, 0.30),  -- Poulet gasy
(11, 23, 0.02), -- Gingembre
(11, 31, 0.05), -- Curcuma frais
(11, 21, 0.05), -- Oignon
(11, 22, 0.01), -- Ail
(11, 31, 0.02), -- Huile d''arachide
(11, 33, 0.01); -- Sel

-- Hen''omby sy voatabia (Menu ID: 12)
INSERT INTO recettes (menu_id, ingredient_id, quantite) VALUES
(12, 1, 0.25),  -- Riz blanc
(12, 4, 0.25),  -- Zébu
(12, 19, 0.20), -- Voatabia
(12, 21, 0.05), -- Oignon
(12, 22, 0.01), -- Ail
(12, 24, 0.10), -- Tomate
(12, 31, 0.02), -- Huile d''arachide
(12, 33, 0.01); -- Sel

-- =============================================
-- ACCOMPAGNEMENTS (ENTRÉES ET DESSERTS)
-- =============================================

INSERT INTO accompagnements (nom, type, description, prix_unitaire) VALUES
-- Entrées
('Samosa gasy', 'ENTREE', 'Petits chaussons frits aux légumes et viande', 3.50),
('Mofo gasy', 'ENTREE', 'Beignets de riz malgaches traditionnels', 2.50),
('Salade de brèdes', 'ENTREE', 'Salade fraîche de jeunes pousses locales', 4.00),
('Koba akondro', 'ENTREE', 'Gâteau de banane et arachides en feuille', 3.00),
('Lasary voatabia', 'ENTREE', 'Salade de courge aux cacahuètes', 3.50),

-- Desserts
('Bonbon coco', 'DESSERT', 'Confiserie traditionnelle à la noix de coco', 2.00),
('Ramanonaka', 'DESSERT', 'Gâteau au lait de coco et œufs', 4.50),
('Mofo akondro', 'DESSERT', 'Gâteau de banane parfumé à la vanille', 4.00),
('Tsirefy', 'DESSERT', 'Confiture de fruits tropicaux', 3.00),
('Koba ravina', 'DESSERT', 'Gâteau de riz gluant aux arachides', 3.50),
('Fruits de saison', 'DESSERT', 'Assortiment de fruits tropicaux frais', 5.00);

-- =============================================
-- BOISSONS
-- =============================================

INSERT INTO boissons (nom, prix, disponible) VALUES
('Ranon''apango', 3.50, true),  -- Eau de riz grillé
('Jus de tamarin', 4.00, true),
('Jus de mangue', 4.50, true),
('Jus de litchi', 5.00, true),
('Ranon''akondro', 3.00, true), -- Jus de banane
('Eau minérale', 2.00, true),
('Thé malgache', 2.50, true),
('Jus de goyave', 4.50, true),
('Jus de papaye', 4.00, true),
('Cocktail de fruits', 6.00, true);

-- =============================================
-- ASSOCIATIONS MENUS-ABONNEMENTS
-- =============================================

-- Tous les menus disponibles pour SILVER
INSERT INTO menu_type_abonnement (menu_id, type_abonnement_id, disponible) VALUES
(1, 1, true),  -- Romazava pour SILVER
(2, 1, true),  -- Ravitoto pour SILVER
(3, 1, true),  -- Akoho sy voanio pour SILVER
(5, 1, true),  -- Vary amin''anana pour SILVER
(7, 1, true),  -- Voanjobory pour SILVER
(8, 1, true),  -- Sosoa pour SILVER
(9, 1, true);  -- Hena-kisoa sy tsaramaso pour SILVER

-- Tous les menus disponibles pour GOLD
INSERT INTO menu_type_abonnement (menu_id, type_abonnement_id, disponible) VALUES
(1, 2, true),  -- Romazava pour GOLD
(2, 2, true),  -- Ravitoto pour GOLD
(3, 2, true),  -- Akoho sy voanio pour GOLD
(4, 2, true),  -- Hen''omby ritra pour GOLD
(5, 2, true),  -- Vary amin''anana pour GOLD
(6, 2, true),  -- Trondro gasy pour GOLD
(7, 2, true),  -- Voanjobory pour GOLD
(8, 2, true),  -- Sosoa pour GOLD
(9, 2, true),  -- Hena-kisoa sy tsaramaso pour GOLD
(10, 2, true), -- Kitoza pour GOLD
(11, 2, true), -- Akoho misy sakamalao pour GOLD
(12, 2, true); -- Hen''omby sy voatabia pour GOLD

-- Accompagnements pour SILVER (limités)
INSERT INTO accompagnement_type_abonnement (accompagnement_id, type_abonnement_id, disponible) VALUES
(2, 1, true),  -- Mofo gasy pour SILVER
(4, 1, true),  -- Koba akondro pour SILVER
(8, 1, true),  -- Mofo akondro pour SILVER
(11, 1, true); -- Fruits de saison pour SILVER

-- Accompagnements pour GOLD (tous disponibles)
INSERT INTO accompagnement_type_abonnement (accompagnement_id, type_abonnement_id, disponible) VALUES
(1, 2, true),  -- Samosa gasy pour GOLD
(2, 2, true),  -- Mofo gasy pour GOLD
(3, 2, true),  -- Salade de brèdes pour GOLD
(4, 2, true),  -- Koba akondro pour GOLD
(5, 2, true),  -- Lasary voatabia pour GOLD
(6, 2, true),  -- Bonbon coco pour GOLD
(7, 2, true),  -- Ramanonaka pour GOLD
(8, 2, true),  -- Mofo akondro pour GOLD
(9, 2, true),  -- Tsirefy pour GOLD
(10, 2, true), -- Koba ravina pour GOLD
(11, 2, true); -- Fruits de saison pour GOLD

-- =============================================
-- CRITÈRES ET RÉDUCTIONS DE FIDÉLITÉ
-- =============================================

INSERT INTO critere_fidelite (prix_a_atteindre) VALUES
(200.00);

INSERT INTO reduction (pourcentage) VALUES
(10.00);

-- =============================================
-- SALAIRES PAR RÔLE
-- =============================================

INSERT INTO salaires (role_id, salaire_mensuel) VALUES
(1, 2500.00), -- ADMIN
(2, 1800.00), -- CUISINIER
(3, 1200.00), -- LIVREUR
(4, 1500.00), -- GESTIONNAIRE_STOCK
(5, 2000.00); -- COMMERCIAL

-- =============================================
-- EXEMPLAIRES D'INGRÉDIENTS (STOCK INITIAL)
-- =============================================

-- Stock initial pour les ingrédients principaux
INSERT INTO exemplaires_ingredient (ingredient_id, quantite, date_peremption) VALUES
-- Riz et céréales
(1, 100.00, '2025-12-31'), -- Riz blanc
(2, 50.00, '2025-12-31'),  -- Riz rouge
(3, 25.00, '2025-12-31'),  -- Vary sosoa

-- Viandes (dates plus courtes)
(4, 30.00, '2025-07-20'),  -- Zébu
(5, 25.00, '2025-07-18'),  -- Porc noir
(6, 35.00, '2025-07-15'),  -- Poulet gasy
(7, 15.00, '2025-07-16'),  -- Canard
(8, 20.00, '2025-07-14'),  -- Poisson

-- Légumes frais
(10, 15.00, '2025-07-12'), -- Brèdes mafana
(11, 12.00, '2025-07-11'), -- Brèdes morelle
(12, 20.00, '2025-07-13'), -- Brèdes chouchou
(13, 18.00, '2025-07-12'), -- Anana

-- Légumineuses
(14, 40.00, '2025-11-30'), -- Voanjobory
(15, 50.00, '2025-11-30'), -- Tsaramaso
(16, 30.00, '2025-10-31'), -- Voanjo

-- Tubercules
(17, 80.00, '2025-08-15'), -- Patate douce
(18, 100.00, '2025-08-20'), -- Manioc
(19, 35.00, '2025-07-25'), -- Taro
(20, 45.00, '2025-07-30'), -- Songe

-- Autres légumes
(21, 25.00, '2025-07-20'), -- Oignon
(22, 8.00, '2025-08-31'),  -- Ail
(23, 12.00, '2025-07-25'), -- Gingembre
(24, 40.00, '2025-07-18'), -- Tomate

-- Condiments et épices
(29, 5.00, '2025-12-31'),  -- Sakay
(31, 20.00, '2025-12-31'), -- Huile d''arachide
(32, 30.00, '2025-08-31'), -- Lait de coco
(33, 50.00, '2026-12-31'), -- Sel

-- Fruits
(35, 40.00, '2025-07-20'), -- Mangue
(36, 30.00, '2025-07-15'), -- Litchi
(37, 50.00, '2025-07-25'), -- Ananas
(38, 60.00, '2025-07-22'), -- Banane

-- Produits laitiers
(43, 40.00, '2025-07-14'), -- Lait
(44, 200.00, '2025-07-21'), -- Œufs
(45, 15.00, '2025-07-18'); -- Fromage local

INSERT INTO statuts_commande (nom, ordre) VALUES
('EN_ATTENTE', 1),
('CONFIRMEE', 2),
('EN_PREPARATION', 3),
('PRETE', 4),
('EN_LIVRAISON', 5),
('LIVREE', 6),
('ANNULEE', 7);