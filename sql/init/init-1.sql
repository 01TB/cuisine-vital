-- ====================================================================
-- SCRIPT D'INITIALISATION - DONNÉES DE DÉMONSTRATION
-- Système de Gestion de Livraison de Repas
--
-- NOTE : Ce script est conçu pour être exécuté APRÈS la création
--        de toutes les tables, fonctions, triggers et vues
--        (contenus dans le fichier base-v8.txt).
--
-- Il est idempotent : il vide les tables avant de les remplir,
-- vous pouvez donc le lancer plusieurs fois.
-- ====================================================================

-- Démarre une transaction pour assurer l'intégrité des données.
-- Si une erreur survient, tout sera annulé.
BEGIN;

-- =============================================
-- VIDAGE DES TABLES (pour la ré-exécution)
-- =============================================
-- L'ordre est important pour respecter les contraintes de clé étrangère,
-- ou on peut utiliser TRUNCATE ... CASCADE.

TRUNCATE TABLE
    alertes,
    paiements_entreprises, paiements_individuels,
    factures_entreprises_details, factures_individuelles_details,
    factures_entreprises, factures_individuelles,
    livraisons_entreprises, livraisons_individuelles,
    selections_hebdomadaires,
    bons_commande,
    commandes_entreprises_details, commandes_individuelles_details,
    commandes_entreprises, commandes_individuelles,
    mouvements_stock,
    planning_production,
    recettes,
    menu_type_abonnement, accompagnement_type_abonnement,
    menus_favoris,
    clients_individuels_fideles,
    exemplaires_ingredient,
    abonnements,
    sessions,
    utilisateurs,
    clients,
    salaires,
    boissons,
    accompagnements,
    menus,
    ingredients,
    zones_livraison
    RESTART IDENTITY CASCADE;

-- Note : Les tables de référence (roles, statuts_commande, types_abonnement, etc.)
-- ne sont pas vidées car elles sont considérées comme des données de base.
-- Si elles ont été insérées dans le script de base, elles resteront.
-- S'il faut les réinitialiser aussi, décommentez la ligne ci-dessous.
/*
TRUNCATE TABLE roles, types_abonnement, statuts_commande, critere_fidelite, reduction RESTART IDENTITY CASCADE;
INSERT INTO roles (nom, description) VALUES ('ADMIN', '...'), ('CHEF_CUISINIER', '...'), ...;
-- (réinsérer les données de référence ici si nécessaire)
*/

-- =============================================
-- 1. INSERTION DES DONNÉES DE CONFIGURATION
-- =============================================

-- Zones de livraison
INSERT INTO zones_livraison (nom, description, localisation) VALUES
('Paris Centre', 'Arrondissements 1 à 4', ST_SetSRID(ST_MakePoint(2.3522, 48.8566), 4326)),
('La Défense', 'Quartier d''affaires de La Défense', ST_SetSRID(ST_MakePoint(2.2382, 48.8918), 4326)),
('Lyon Part-Dieu', 'Quartier de la Part-Dieu à Lyon', ST_SetSRID(ST_MakePoint(4.8528, 45.7607), 4326));

-- Ingrédients
INSERT INTO ingredients (nom, unite_mesure, prix_unitaire, stock_minimum) VALUES
('Filet de Poulet', 'kg', 12.50, 10.0),
('Saumon Frais', 'kg', 25.00, 5.0),
('Tomate', 'kg', 3.50, 8.0),
('Riz Basmati', 'kg', 4.00, 20.0),
('Pâtes Fraîches', 'kg', 6.00, 15.0),
('Crème fraîche', 'L', 3.20, 5.0),
('Champignons de Paris', 'kg', 7.00, 4.0),
('Salade Verte', 'pièce', 1.10, 30.0),
('Chocolat Noir 70%', 'kg', 18.00, 2.0);

-- Accompagnements (Entrées / Desserts)
INSERT INTO accompagnements (nom, type, description, prix_uniatire) VALUES
('Salade de saison', 'ENTREE', 'Mélange de jeunes pousses et légumes de saison', 3.50),
('Velouté de légumes', 'ENTREE', 'Soupe onctueuse de légumes du marché', 4.00),
('Mousse au chocolat', 'DESSERT', 'Mousse légère au chocolat noir intense', 4.50),
('Tartelette aux fruits', 'DESSERT', 'Tartelette sablée avec crème pâtissière et fruits frais', 5.00);

-- Boissons (pour abonnement GOLD)
INSERT INTO boissons (nom, prix) VALUES
('Eau minérale plate 50cl', 1.50),
('Jus d''orange pressé 25cl', 3.00),
('Café expresso', 2.00);

-- Salaires par rôle
INSERT INTO salaires (role_id, salaire_mensuel) VALUES
((SELECT id FROM roles WHERE nom = 'ADMIN'), 4500.00),
((SELECT id FROM roles WHERE nom = 'CHEF_CUISINIER'), 3800.00),
((SELECT id FROM roles WHERE nom = 'CUISINIER'), 2500.00),
((SELECT id FROM roles WHERE nom = 'LIVREUR'), 2100.00);


-- =============================================
-- 2. CRÉATION DES UTILISATEURS ET CLIENTS
-- =============================================

DO $$
DECLARE
    -- IDs des zones
    zone_paris_id INTEGER := (SELECT id FROM zones_livraison WHERE nom = 'Paris Centre');
    zone_defense_id INTEGER := (SELECT id FROM zones_livraison WHERE nom = 'La Défense');
    zone_lyon_id INTEGER := (SELECT id FROM zones_livraison WHERE nom = 'Lyon Part-Dieu');

    -- IDs des rôles
    role_admin_id INTEGER := (SELECT id FROM roles WHERE nom = 'ADMIN');
    role_chef_id INTEGER := (SELECT id FROM roles WHERE nom = 'CHEF_CUISINIER');
    role_cuisinier_id INTEGER := (SELECT id FROM roles WHERE nom = 'CUISINIER');
    role_livreur_id INTEGER := (SELECT id FROM roles WHERE nom = 'LIVREUR');

BEGIN
    -- Utilisateurs (Employés)
    INSERT INTO utilisateurs (nom, prenom, email, telephone, mot_de_passe, role_id) VALUES
    ('Dubois', 'Admin', 'admin@repas-express.fr', '0102030405', 'hash_mot_de_passe_securise', role_admin_id),
    ('Bernard', 'Chef', 'chef.bernard@repas-express.fr', '0102030406', 'hash_mot_de_passe_securise', role_chef_id),
    ('Petit', 'Lucas', 'lucas.petit@repas-express.fr', '0102030407', 'hash_mot_de_passe_securise', role_cuisinier_id),
    ('Durand', 'Sophie', 'sophie.durand@repas-express.fr', '0102030408', 'hash_mot_de_passe_securise', role_livreur_id),
    ('Leroy', 'Marc', 'marc.leroy@repas-express.fr', '0102030409', 'hash_mot_de_passe_securise', role_livreur_id);

    -- Clients Particuliers
    INSERT INTO clients (nom, prenom, email, telephone, adresse, zone_livraison_id, type_client) VALUES
    ('Martin', 'Alice', 'alice.martin@email.com', '0611223344', '10 Rue de Rivoli, 75001 Paris', zone_paris_id, 'PARTICULIER'),
    ('Garcia', 'Hugo', 'hugo.garcia@email.com', '0655667788', '25 Avenue des Champs-Élysées, 75008 Paris', zone_paris_id, 'PARTICULIER'),
    ('Moreau', 'Chloé', 'chloe.moreau@lyon.com', '0712345678', '5 Place de la Bourse, 69002 Lyon', zone_lyon_id, 'PARTICULIER');

    -- Clients Entreprises
    INSERT INTO clients (nom, email, telephone, adresse, zone_livraison_id, type_client) VALUES
    ('Innov-Tech SAS', 'contact@innov-tech.fr', '0198765432', '1 Parvis de la Défense, 92800 Puteaux', zone_defense_id, 'ENTREPRISE'),
    ('Solutions Digitales', 'achats@solutions-digitales.com', '0187654321', '50 Rue de la République, 69002 Lyon', zone_lyon_id, 'ENTREPRISE');
END $$;


-- =============================================
-- 3. CRÉATION DES MENUS ET RECETTES
-- =============================================

DO $$
DECLARE
    -- IDs des Menus
    menu_poulet_id INTEGER;
    menu_saumon_id INTEGER;
    menu_vege_id INTEGER;
    menu_pates_id INTEGER;

    -- IDs des Ingrédients
    ing_poulet_id INTEGER := (SELECT id FROM ingredients WHERE nom = 'Filet de Poulet');
    ing_saumon_id INTEGER := (SELECT id FROM ingredients WHERE nom = 'Saumon Frais');
    ing_tomate_id INTEGER := (SELECT id FROM ingredients WHERE nom = 'Tomate');
    ing_riz_id INTEGER := (SELECT id FROM ingredients WHERE nom = 'Riz Basmati');
    ing_pates_id INTEGER := (SELECT id FROM ingredients WHERE nom = 'Pâtes Fraîches');
    ing_creme_id INTEGER := (SELECT id FROM ingredients WHERE nom = 'Crème fraîche');
    ing_champ_id INTEGER := (SELECT id FROM ingredients WHERE nom = 'Champignons de Paris');
    ing_salade_id INTEGER := (SELECT id FROM ingredients WHERE nom = 'Salade Verte');
    ing_choco_id INTEGER := (SELECT id FROM ingredients WHERE nom = 'Chocolat Noir 70%');

    -- IDs des types d'abonnement
    type_silver_id INTEGER := (SELECT id FROM types_abonnement WHERE nom = 'SILVER');
    type_gold_id INTEGER := (SELECT id FROM types_abonnement WHERE nom = 'GOLD');

    -- IDs des accompagnements
    acc_salade_id INTEGER := (SELECT id FROM accompagnements WHERE type = 'ENTREE');
    acc_mousse_id INTEGER := (SELECT id FROM accompagnements WHERE type = 'DESSERT');
BEGIN
    -- Menus
    INSERT INTO menus (nom, description, prix_carte, temps_preparation) VALUES
    ('Poulet rôti, purée maison', 'Filet de poulet fermier rôti, accompagné de sa purée de pommes de terre onctueuse.', 14.50, 25) RETURNING id INTO menu_poulet_id;
    INSERT INTO menus (nom, description, prix_carte, temps_preparation) VALUES
    ('Pavé de saumon teriyaki, riz basmati', 'Saumon frais laqué à la sauce teriyaki, servi avec du riz basmati parfumé.', 16.00, 20) RETURNING id INTO menu_saumon_id;
    INSERT INTO menus (nom, description, prix_carte, temps_preparation) VALUES
    ('Risotto aux champignons de saison', 'Risotto crémeux aux champignons frais et copeaux de parmesan.', 13.00, 30) RETURNING id INTO menu_vege_id;
    INSERT INTO menus (nom, description, prix_carte, temps_preparation) VALUES
    ('Pâtes fraîches Carbonara', 'Pâtes fraîches avec une sauce carbonara authentique (guanciale, pecorino, œuf).', 13.50, 15) RETURNING id INTO menu_pates_id;

    -- Recettes
    INSERT INTO recettes (menu_id, ingredient_id, quantite) VALUES
    (menu_poulet_id, ing_poulet_id, 0.180), -- 180g de poulet
    (menu_saumon_id, ing_saumon_id, 0.150), -- 150g de saumon
    (menu_saumon_id, ing_riz_id, 0.100),    -- 100g de riz
    (menu_vege_id, ing_champ_id, 0.120),    -- 120g de champignons
    (menu_vege_id, ing_riz_id, 0.080),      -- 80g de riz (arborio)
    (menu_pates_id, ing_pates_id, 0.150);   -- 150g de pâtes

    -- Disponibilité des menus par abonnement
    INSERT INTO menu_type_abonnement (menu_id, type_abonnement_id) VALUES
    (menu_poulet_id, type_silver_id), (menu_poulet_id, type_gold_id),
    (menu_saumon_id, type_gold_id),
    (menu_vege_id, type_silver_id), (menu_vege_id, type_gold_id),
    (menu_pates_id, type_silver_id), (menu_pates_id, type_gold_id);
    
    -- Disponibilité des accompagnements par abonnement (GOLD a accès à tout)
    INSERT INTO accompagnement_type_abonnement (accompagnement_id, type_abonnement_id) VALUES
    (acc_salade_id, type_gold_id),
    (acc_mousse_id, type_gold_id);

END $$;


-- =============================================
-- 4. GESTION DU STOCK INITIAL
-- =============================================

INSERT INTO exemplaires_ingredient (ingredient_id, quantite, date_peremption) VALUES
((SELECT id FROM ingredients WHERE nom = 'Filet de Poulet'), 25.0, CURRENT_DATE + INTERVAL '5 days'),
((SELECT id FROM ingredients WHERE nom = 'Saumon Frais'), 12.0, CURRENT_DATE + INTERVAL '3 days'),
((SELECT id FROM ingredients WHERE nom = 'Tomate'), 30.0, CURRENT_DATE + INTERVAL '7 days'),
((SELECT id FROM ingredients WHERE nom = 'Riz Basmati'), 100.0, NULL),
((SELECT id FROM ingredients WHERE nom = 'Pâtes Fraîches'), 40.0, CURRENT_DATE + INTERVAL '10 days'),
-- Ingrédient en stock faible pour tester les alertes
((SELECT id FROM ingredients WHERE nom = 'Crème fraîche'), 4.5, CURRENT_DATE + INTERVAL '8 days'); -- Stock actuel (4.5L) < Stock min (5L)

-- =============================================
-- 5. ABONNEMENTS ET COMMANDES
-- =============================================
DO $$
DECLARE
    -- Clients
    client_alice_id UUID := (SELECT id FROM clients WHERE email = 'alice.martin@email.com');
    client_hugo_id UUID := (SELECT id FROM clients WHERE email = 'hugo.garcia@email.com');
    client_innovtech_id UUID := (SELECT id FROM clients WHERE email = 'contact@innov-tech.fr');
    client_soludigi_id UUID := (SELECT id FROM clients WHERE email = 'achats@solutions-digitales.com');

    -- Abonnements
    abo_innov_gold_id UUID;
    abo_solu_silver_id UUID;

    -- Menus
    menu_poulet_id INTEGER := (SELECT id FROM menus WHERE nom LIKE 'Poulet rôti%');
    menu_saumon_id INTEGER := (SELECT id FROM menus WHERE nom LIKE 'Pavé de saumon%');
    menu_vege_id INTEGER := (SELECT id FROM menus WHERE nom LIKE 'Risotto%');

    -- Statuts
    statut_livree_id INTEGER := (SELECT id FROM statuts_commande WHERE nom = 'LIVREE');
    statut_en_prep_id INTEGER := (SELECT id FROM statuts_commande WHERE nom = 'EN_PREPARATION');
    statut_annulee_id INTEGER := (SELECT id FROM statuts_commande WHERE nom = 'ANNULEE');

    -- Livreurs
    livreur_sophie_id UUID := (SELECT id FROM utilisateurs WHERE email = 'sophie.durand@repas-express.fr');
    livreur_marc_id UUID := (SELECT id FROM utilisateurs WHERE email = 'marc.leroy@repas-express.fr');
    
    -- Commandes
    cmd_alice_1_id UUID;
    cmd_hugo_1_id UUID;
    cmd_innov_1_id UUID;

BEGIN
    -- Abonnements Entreprise
    INSERT INTO abonnements (client_id, type_abonnement_id, nb_employes, date_debut, date_fin, actif) VALUES
    (client_innovtech_id, (SELECT id FROM types_abonnement WHERE nom = 'GOLD'), 50, CURRENT_DATE - INTERVAL '3 months', NULL, TRUE) RETURNING id INTO abo_innov_gold_id;
    INSERT INTO abonnements (client_id, type_abonnement_id, nb_employes, date_debut, date_fin, actif) VALUES
    (client_soludigi_id, (SELECT id FROM types_abonnement WHERE nom = 'SILVER'), 20, CURRENT_DATE - INTERVAL '1 year', CURRENT_DATE - INTERVAL '1 month', FALSE) RETURNING id INTO abo_solu_silver_id;

    -- Commandes Individuelles
    -- Commande 1 (Alice, livrée) - servira pour la fidélité
    INSERT INTO commandes_individuelles (client_id, statut_id, date_livraison, adresse_livraison, montant_total, livreur_id) VALUES
    (client_alice_id, statut_livree_id, CURRENT_DATE - INTERVAL '2 days', '10 Rue de Rivoli, 75001 Paris', 0, livreur_sophie_id) RETURNING id INTO cmd_alice_1_id;
    INSERT INTO commandes_individuelles_details (commande_id, menu_id, quantite, prix_unitaire) VALUES
    (cmd_alice_1_id, menu_poulet_id, 2, 14.50);
    -- Le trigger mettra à jour le montant_total à 29.00

    -- Commandes successives pour qu'Alice devienne fidèle (dépasse 500€)
    -- Le trigger 'verifier_ajout_fidelite' s'activera
    INSERT INTO commandes_individuelles (client_id, statut_id, date_livraison, adresse_livraison, montant_total) VALUES
    (client_alice_id, statut_livree_id, CURRENT_DATE - INTERVAL '10 days', '10 Rue de Rivoli, 75001 Paris', 480.00);
    
    -- Commande 2 (Hugo, en préparation)
    INSERT INTO commandes_individuelles (client_id, statut_id, date_livraison, adresse_livraison, montant_total, livreur_id) VALUES
    (client_hugo_id, statut_en_prep_id, CURRENT_DATE + INTERVAL '1 day', '25 Avenue des Champs-Élysées, 75008 Paris', 0, livreur_marc_id) RETURNING id INTO cmd_hugo_1_id;
    INSERT INTO commandes_individuelles_details (commande_id, menu_id, accompagnement_id, quantite, prix_unitaire, notes) VALUES
    (cmd_hugo_1_id, menu_vege_id, (SELECT id FROM accompagnements WHERE nom='Mousse au chocolat'), 1, 13.00, 'Sans parmesan SVP'),
    (cmd_hugo_1_id, menu_vege_id, (SELECT id FROM accompagnements WHERE nom='Mousse au chocolat'), 0, 4.50, NULL); -- Le montant est calculé par menu + accompagnement

    -- Commande 3 (Alice, annulée)
    INSERT INTO commandes_individuelles (client_id, statut_id, date_livraison, adresse_livraison, montant_total) VALUES
    (client_alice_id, statut_annulee_id, CURRENT_DATE - INTERVAL '5 days', '10 Rue de Rivoli, 75001 Paris', 16.00);

    -- Commandes Entreprise
    INSERT INTO commandes_entreprises (client_id, abonnement_id, statut_id, date_livraison, adresse_livraison, montant_total, livreur_id) VALUES
    (client_innovtech_id, abo_innov_gold_id, statut_livree_id, CURRENT_DATE - INTERVAL '1 day', '1 Parvis de la Défense, 92800 Puteaux', 0, livreur_sophie_id) RETURNING id INTO cmd_innov_1_id;
    INSERT INTO commandes_entreprises_details (commande_id, menu_id, quantite, prix_unitaire, boisson_id) VALUES
    (cmd_innov_1_id, menu_poulet_id, 10, 18.00, (SELECT id FROM boissons WHERE nom LIKE 'Eau%')), -- Prix de l'abonnement GOLD
    (cmd_innov_1_id, menu_saumon_id, 8, 18.00, (SELECT id FROM boissons WHERE nom LIKE 'Jus%'));
    UPDATE commandes_entreprises SET montant_total = (10+8) * 18.00 WHERE id = cmd_innov_1_id;
END $$;


-- =============================================
-- 6. SIMULATION DE LA PRODUCTION ET DU STOCK
-- =============================================
DO $$
DECLARE
    -- IDs
    cuisinier_lucas_id UUID := (SELECT id FROM utilisateurs WHERE email = 'lucas.petit@repas-express.fr');
    menu_vege_id INTEGER := (SELECT id FROM menus WHERE nom LIKE 'Risotto%');
    exemplaire_creme_id INTEGER := (SELECT id FROM exemplaires_ingredient WHERE ingredient_id = (SELECT id FROM ingredients WHERE nom = 'Crème fraîche') LIMIT 1);
BEGIN
    -- Planification de la production pour la commande de Hugo
    INSERT INTO planning_production (menu_id, date_production, quantite_prevue, cuisinier_id, statut) VALUES
    (menu_vege_id, CURRENT_DATE, 1, cuisinier_lucas_id, 'EN_COURS');

    -- Mouvement de stock pour la production
    -- Cela devrait déclencher une alerte de stock faible pour la crème fraîche
    INSERT INTO mouvements_stock (exemplaire_ingredient_id, type_mouvement, quantite, stock_avant, stock_apres, commentaire, utilisateur_id) VALUES
    (exemplaire_creme_id, 'SORTIE', 0.1, 4.5, 4.4, 'Production commande Hugo', cuisinier_lucas_id);
END $$;


-- =============================================
-- 7. GÉNÉRATION DES FACTURES ET PAIEMENTS
-- =============================================
DO $$
DECLARE
    -- IDs
    client_alice_id UUID := (SELECT id FROM clients WHERE email = 'alice.martin@email.com');
    client_innovtech_id UUID := (SELECT id FROM clients WHERE email = 'contact@innov-tech.fr');
    cmd_alice_1_id UUID := (SELECT id FROM commandes_individuelles WHERE client_id = client_alice_id AND statut_id = (SELECT id FROM statuts_commande WHERE nom = 'LIVREE') ORDER BY date_commande DESC LIMIT 1);
    abo_innov_gold_id UUID := (SELECT id FROM abonnements WHERE client_id = client_innovtech_id AND actif = TRUE);
    facture_alice_id UUID;
    facture_innov_id UUID;
BEGIN
    -- Le trigger sur 'commandes_individuelles' a déjà dû créer une facture pour Alice.
    -- Nous en créons une manuellement pour l'exemple.
    -- On s'assure qu'elle n'existe pas déjà pour éviter une erreur.
    IF NOT EXISTS (SELECT 1 FROM factures_individuelles WHERE commande_id = cmd_alice_1_id) THEN
        INSERT INTO factures_individuelles (numero_facture, client_id, commande_id, date_echeance, montant_ht, montant_tva, montant_ttc, statut) VALUES
        ('FACT-IND-2023-0001', client_alice_id, cmd_alice_1_id, CURRENT_DATE + INTERVAL '15 days', 29.00, 2.90, 31.90, 'EMISE') RETURNING id INTO facture_alice_id;
    ELSE
        facture_alice_id := (SELECT id FROM factures_individuelles WHERE commande_id = cmd_alice_1_id);
    END IF;

    -- Facture entreprise mensuelle
    INSERT INTO factures_entreprises (numero_facture, client_id, abonnement_id, mois_facture, date_echeance, montant_ht, montant_tva, montant_ttc, nb_repas_factures, statut) VALUES
    ('FACT-ENT-2023-11-001', client_innovtech_id, abo_innov_gold_id, DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month'), CURRENT_DATE, 8500.00, 850.00, 9350.00, 480, 'PAYEE') RETURNING id INTO facture_innov_id;

    -- Paiements
    -- Paiement pour la facture entreprise
    INSERT INTO paiements_entreprises (facture_id, montant, mode_paiement, statut) VALUES
    (facture_innov_id, 9350.00, 'VIREMENT', 'CONFIRME');

    -- Pas de paiement pour Alice, sa facture reste 'EMISE'.
END $$;


-- =============================================
-- 8. GESTION DES LIVRAISONS
-- =============================================
DO $$
DECLARE
    cmd_alice_1_id UUID := (SELECT ci.id FROM commandes_individuelles ci JOIN clients c ON ci.client_id = c.id WHERE c.email = 'alice.martin@email.com' AND ci.statut_id = (SELECT id FROM statuts_commande WHERE nom = 'LIVREE') LIMIT 1);
    cmd_innov_1_id UUID := (SELECT ce.id FROM commandes_entreprises ce JOIN clients c ON ce.client_id = c.id WHERE c.email = 'contact@innov-tech.fr' AND ce.statut_id = (SELECT id FROM statuts_commande WHERE nom = 'LIVREE') LIMIT 1);
    livreur_sophie_id UUID := (SELECT id FROM utilisateurs WHERE email = 'sophie.durand@repas-express.fr');
BEGIN
    -- Livraison pour Alice (terminée)
    INSERT INTO livraisons_individuelles (commande_id, livreur_id, adresse, localisation, heure_depart, heure_livraison, statut) VALUES
    (cmd_alice_1_id, livreur_sophie_id, '10 Rue de Rivoli, 75001 Paris', (SELECT localisation FROM zones_livraison WHERE nom = 'Paris Centre'), '12:15:00', '12:40:00', 'LIVREE');

    -- Livraison pour Innov-Tech (terminée)
    INSERT INTO livraisons_entreprises (commande_id, livreur_id, adresse, localisation, heure_depart, heure_livraison, statut) VALUES
    (cmd_innov_1_id, livreur_sophie_id, '1 Parvis de la Défense, 92800 Puteaux', (SELECT localisation FROM zones_livraison WHERE nom = 'La Défense'), '11:30:00', '11:55:00', 'LIVREE');
END $$;


-- Valide la transaction.
COMMIT;

-- =============================================
-- FIN DU SCRIPT D'INITIALISATION
--
-- Vous pouvez maintenant exécuter des requêtes pour vérifier les données :
--
-- SELECT * FROM v_dashboard_admin;
-- SELECT * FROM v_stocks_critiques;
-- SELECT * FROM v_clients_fideles;
-- SELECT * FROM alertes;
-- =============================================