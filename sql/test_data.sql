

-- =============== ZONES DE LIVRAISON ===============
INSERT INTO zones_livraison (nom, description, localisation)
VALUES
  ('Centre-ville', 'Zone principale du centre-ville', ST_GeomFromText('POLYGON((0 0, 0 10, 10 10, 10 0, 0 0))')),
  ('Banlieue', 'Zones périphériques', ST_GeomFromText('POLYGON((10 0, 10 10, 20 10, 20 0, 10 0))'));


-- =============== UTILISATEURS ===============
INSERT INTO utilisateurs (id, nom, prenom, email, telephone, mot_de_passe, role_id, zone_livraison_id)
VALUES
  (uuid_generate_v4(), 'Dupont', 'Jean', 'jean.dupont@example.com', '0612345678', 'pass123', 2, 1),
  (uuid_generate_v4(), 'Martin', 'Claire', 'claire.martin@example.com', '0698765432', 'pass456', 3, 1),
  (uuid_generate_v4(), 'Durand', 'Paul', 'paul.durand@example.com', '0611122233', 'pass789', 1, NULL);

-- =============== CLIENTS ===============
-- Particulier
INSERT INTO clients (id, nom, prenom, email, telephone, adresse, zone_livraison_id, type_client)
VALUES 
  (uuid_generate_v4(), 'Leclerc', 'Sophie', 'sophie.leclerc@example.com', '0612349876', '12 rue des Lilas', 1, 'PARTICULIER');

-- Entreprise
INSERT INTO clients (id, nom, prenom, email, telephone, adresse, zone_livraison_id, type_client)
VALUES 
  (uuid_generate_v4(), 'TechCorp', NULL, 'contact@techcorp.com', '0699988776', '45 avenue de la République', 2, 'ENTREPRISE');

-- =============== ABONNEMENTS ===============
-- Récupérer les UUID des clients insérés (exemple avec variables à adapter)
-- Ici on supposera que les UUID des clients sont connus (à adapter selon insertion)

-- Exemple : 
-- SELECT id FROM clients WHERE email = 'contact@techcorp.com';

-- Supposons UUID entreprise : '11111111-1111-1111-1111-111111111111' (à remplacer)
INSERT INTO abonnements (id, client_id, type_abonnement_id, nb_employes, date_debut)
VALUES
  (uuid_generate_v4(), (SELECT id FROM clients WHERE email = 'contact@techcorp.com'), 1, 50, '2025-01-01');

-- =============== INGREDIENTS ===============
INSERT INTO ingredients (nom, unite_mesure, prix_unitaire, stock_minimum)
VALUES
  ('Poulet', 'kg', 5.00, 10.0),
  ('Riz', 'kg', 1.00, 20.0),
  ('Tomates', 'kg', 2.00, 15.0),
  ('Huile', 'L', 3.50, 5.0);

-- =============== EXEMPLAIRES_INGREDIENT ===============
INSERT INTO exemplaires_ingredient (quantite, ingredient_id, date_peremption)
VALUES
  (50, 1, '2025-07-01'),
  (100, 2, '2025-08-01'),
  (30, 3, '2025-06-15'),
  (20, 4, '2025-09-01');

-- =============== MENUS ===============
INSERT INTO menus (nom, description, prix_carte, temps_preparation, photo_url)
VALUES
  ('Poulet rôti', 'Poulet mariné et rôti au four', 12.50, 45, 'http://example.com/photos/poulet_roti.jpg'),
  ('Salade de riz', 'Salade fraîche avec riz, tomates et herbes', 8.00, 20, 'http://example.com/photos/salade_riz.jpg');

-- =============== RECETTES ===============
INSERT INTO recettes (menu_id, ingredient_id, quantite)
VALUES
  (1, 1, 0.5), -- 0.5 kg poulet
  (1, 4, 0.1), -- 0.1 L huile
  (2, 2, 0.3), -- 0.3 kg riz
  (2, 3, 0.2); -- 0.2 kg tomates

-- =============== BOISSONS ===============
INSERT INTO boissons (nom, prix)
VALUES
  ('Eau minérale', 1.00),
  ('Jus dorange', 2.50);

-- =============== ACCOMPAGNEMENTS ===============
INSERT INTO accompagnements (nom, type, description, prix_uniatire)
VALUES
  ('Soupe de légumes', 'ENTREE', 'Soupe maison aux légumes de saison', 3.00),
  ('Tarte aux pommes', 'DESSERT', 'Tarte traditionnelle aux pommes', 4.00);

-- =============== MENU_TYPE_ABONNEMENT ===============
INSERT INTO menu_type_abonnement (menu_id, type_abonnement_id)
VALUES
  (1, 1), -- Poulet rôti pour GOLD
  (2, 2); -- Salade de riz pour SILVER

-- =============== ACCOMPAGNEMENT_TYPE_ABONNEMENT ===============
INSERT INTO accompagnement_type_abonnement (accompagnement_id, type_abonnement_id)
VALUES
  (1, 1),
  (2, 1),
  (1, 2);

-- =============== MENUS_FAVORIS ===============
-- Utilise l'UUID du client particulier inséré
INSERT INTO menus_favoris (menu_id, client_id)
VALUES
  (1, (SELECT id FROM clients WHERE email = 'sophie.leclerc@example.com'));

-- =============== COMMANDES_INDIVIDUELLES ===============
INSERT INTO commandes_individuelles (numero_commande, client_id, statut_id, date_commande, date_livraison, adresse_livraison, montant_total, livreur_id)
VALUES
  ('CMD0001', (SELECT id FROM clients WHERE email = 'sophie.leclerc@example.com'), 1, NOW(), '2025-06-30', '12 rue des Lilas', 15.00, (SELECT id FROM utilisateurs WHERE email = 'jean.dupont@example.com'));

-- =============== COMMANDES_INDIVIDUELLES_DETAILS ===============
INSERT INTO commandes_individuelles_details (commande_id, menu_id, accompagnement_id, quantite, prix_unitaire, boisson_id, notes)
VALUES
  (
    (SELECT id FROM commandes_individuelles WHERE numero_commande = 'CMD0001'),
    1, -- Poulet rôti
    1, -- Soupe de légumes
    1,
    12.50,
    1, -- Eau minérale
    'Sans sel'
  );

-- =============== FACTURES_INDIVIDUELLES ===============
INSERT INTO factures_individuelles (numero_facture, client_id, commande_id, date_echeance, montant_ht, montant_tva, montant_ttc)
VALUES
  ('FAC0001', 
   (SELECT id FROM clients WHERE email = 'sophie.leclerc@example.com'),
   (SELECT id FROM commandes_individuelles WHERE numero_commande = 'CMD0001'),
   CURRENT_DATE + INTERVAL '30 days',
   15.00,
   3.00,
   18.00);

-- =============== PAIEMENTS_INDIVIDUELS ===============
INSERT INTO paiements_individuels (facture_id, numero_transaction, montant, mode_paiement, statut)
VALUES
  (
    (SELECT id FROM factures_individuelles WHERE numero_facture = 'FAC0001'),
    'TXN123456',
    18.00,
    'CARTE',
    'CONFIRME'
  );

-- =============== LIVRAISONS_INDIVIDUELLES ===============
INSERT INTO livraisons_individuelles (commande_id, livreur_id, adresse, statut)
VALUES
  (
    (SELECT id FROM commandes_individuelles WHERE numero_commande = 'CMD0001'),
    (SELECT id FROM utilisateurs WHERE email = 'jean.dupont@example.com'),
    '12 rue des Lilas',
    'ASSIGNEE'
  );
