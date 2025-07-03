-- =============================================
-- VUE POUR L'HISTORIQUE GLOBAL DES COMMANDES
-- =============================================

CREATE OR REPLACE VIEW v_commandes_historique AS
SELECT
    ci.id AS commande_id,
    'INDIVIDUELLE' AS type_commande,
    ci.numero_commande,
    ci.client_id,
    cl.nom || ' ' || cl.prenom AS client_nom,
    ci.statut_id,
    sc.nom AS statut_nom,
    sc.ordre as statut_ordre,
    ci.date_commande,
    ci.date_livraison,
    ci.montant_total,
    ci.livreur_id,
    u.nom || ' ' || u.prenom AS livreur_nom,
    NULL::uuid AS abonnement_id, -- Colonne pour uniformiser avec les commandes entreprises
    ci.created_at,
    ci.deleted_at
FROM
    commandes_individuelles ci
JOIN clients cl ON ci.client_id = cl.id
JOIN statuts_commande sc ON ci.statut_id = sc.id
LEFT JOIN utilisateurs u ON ci.livreur_id = u.id -- LEFT JOIN au cas où le livreur n'est pas encore assigné

UNION ALL

SELECT
    ce.id AS commande_id,
    'ENTREPRISE' AS type_commande,
    ce.numero_commande,
    ce.client_id,
    cl.nom AS client_nom,
    ce.statut_id,
    sc.nom AS statut_nom,
    sc.ordre as statut_ordre,
    ce.date_commande,
    ce.date_livraison,
    ce.montant_total,
    ce.livreur_id,
    u.nom || ' ' || u.prenom AS livreur_nom,
    ce.abonnement_id,
    ce.created_at,
    ce.deleted_at
FROM
    commandes_entreprises ce
JOIN clients cl ON ce.client_id = cl.id
JOIN statuts_commande sc ON ce.statut_id = sc.id
LEFT JOIN utilisateurs u ON ce.livreur_id = u.id;


//Chiffre d'affaire
-- S'assurer qu'on est dans la bonne base de données
\c cuisine_db;

-- =============================================
-- JEU DE DONNÉES DE TEST POUR CHIFFRE D'AFFAIRES
-- =============================================

DO $$
DECLARE
    -- Déclaration des variables pour stocker les UUIDs générés
    client_particulier_id UUID;
    client_entreprise_id UUID;
    commande_particulier_id_1 UUID;
    commande_particulier_id_2 UUID;
    facture_particulier_id_1 UUID;
    facture_particulier_id_2 UUID;
    facture_entreprise_id_1 UUID;
    facture_entreprise_id_2 UUID;
    abonnement_id UUID;
    zone_id INTEGER;
    menu_id_1 INTEGER;
    menu_id_2 INTEGER;
BEGIN

    -- 1. CRÉATION DES ENTITÉS DE BASE (si elles n'existent pas)
    ----------------------------------------------------------------

    -- Zone de livraison
    INSERT INTO zones_livraison (nom, description) VALUES ('Centre-Ville', 'Zone de test centrale');
    SELECT id INTO zone_id FROM zones_livraison WHERE nom = 'Centre-Ville' LIMIT 1;
    
    -- Menus
    INSERT INTO menus (nom, prix_carte, temps_preparation) VALUES ('Poulet Rôti & Frites', 15.50, 25)
    ON CONFLICT (id) DO NOTHING;
    SELECT id INTO menu_id_1 FROM menus WHERE nom = 'Poulet Rôti & Frites' LIMIT 1;

    INSERT INTO menus (nom, prix_carte, temps_preparation) VALUES ('Salade Végétarienne', 12.00, 15)
    ON CONFLICT (id) DO NOTHING;
    SELECT id INTO menu_id_2 FROM menus WHERE nom = 'Salade Végétarienne' LIMIT 1;

    -- 2. CRÉATION DES CLIENTS
    ----------------------------------------------------------------

    -- Client Particulier
    INSERT INTO clients (nom, prenom, email, telephone, adresse, zone_livraison_id, type_client)
    VALUES ('Dupont', 'Jean', 'jean.dupont@test.com', '0612345678', '12 Rue de la Paix', zone_id, 'PARTICULIER')
    ON CONFLICT (email) DO UPDATE SET nom = 'Dupont' RETURNING id INTO client_particulier_id;

    -- Client Entreprise
    INSERT INTO clients (nom, email, telephone, adresse, zone_livraison_id, type_client)
    VALUES ('Tech Solutions', 'contact@techsolutions.test', '0198765432', '5 Avenue de la République', zone_id, 'ENTREPRISE')
    ON CONFLICT (email) DO UPDATE SET nom = 'Tech Solutions' RETURNING id INTO client_entreprise_id;


    -- 3. PROCESSUS POUR LE CLIENT PARTICULIER
    ----------------------------------------------------------------

    -- Commande 1 (pour générer une facture)
    INSERT INTO commandes_individuelles (numero_commande, client_id, statut_id, date_livraison, adresse_livraison, montant_total)
    VALUES (generer_numero_commande('INDIVIDUELLE'), client_particulier_id, 5, CURRENT_DATE - 10, '12 Rue de la Paix', 31.00)
    RETURNING id INTO commande_particulier_id_1;

    -- Facture 1 (liée à la commande 1)
    INSERT INTO factures_individuelles (numero_facture, client_id, commande_id, date_echeance, montant_ht, montant_tva, montant_ttc, statut)
    VALUES ('FACT-IND-001', client_particulier_id, commande_particulier_id_1, CURRENT_DATE, 31.00, 0, 31.00, 'PAYEE')
    ON CONFLICT (numero_facture) DO NOTHING RETURNING id INTO facture_particulier_id_1;

    -- **PAIEMENT 1 (INDIVIDUEL)** - Montant: 31.00€, Payé il y a 5 jours
    INSERT INTO paiements_individuels (facture_id, montant, mode_paiement, statut, date_paiement)
    VALUES (facture_particulier_id_1, 31.00, 'CARTE', 'CONFIRME', NOW() - INTERVAL '5 days')
    ON CONFLICT (id) DO NOTHING;

    -- Commande 2
    INSERT INTO commandes_individuelles (numero_commande, client_id, statut_id, date_livraison, adresse_livraison, montant_total)
    VALUES (generer_numero_commande('INDIVIDUELLE'), client_particulier_id, 5, CURRENT_DATE - 2, '12 Rue de la Paix', 45.50)
    RETURNING id INTO commande_particulier_id_2;

    -- Facture 2
    INSERT INTO factures_individuelles (numero_facture, client_id, commande_id, date_echeance, montant_ht, montant_tva, montant_ttc, statut)
    VALUES ('FACT-IND-002', client_particulier_id, commande_particulier_id_2, CURRENT_DATE + 10, 45.50, 0, 45.50, 'PAYEE')
    ON CONFLICT (numero_facture) DO NOTHING RETURNING id INTO facture_particulier_id_2;
    
    -- **PAIEMENT 2 (INDIVIDUEL)** - Montant: 45.50€, Payé hier
    INSERT INTO paiements_individuels (facture_id, montant, mode_paiement, statut, date_paiement)
    VALUES (facture_particulier_id_2, 45.50, 'PAYPAL', 'CONFIRME', NOW() - INTERVAL '1 day')
    ON CONFLICT (id) DO NOTHING;

    -- 4. PROCESSUS POUR LE CLIENT ENTREPRISE
    ----------------------------------------------------------------
    
    -- Abonnement
    INSERT INTO abonnements(client_id, type_abonnement_id, nb_employes, date_debut)
    VALUES (client_entreprise_id, 1, 20, CURRENT_DATE - 60)
    ON CONFLICT (id) DO NOTHING RETURNING id INTO abonnement_id;

    -- Facture 1 (mensuelle)
    INSERT INTO factures_entreprises (numero_facture, client_id, abonnement_id, mois_facture, date_echeance, montant_ht, montant_tva, montant_ttc, nb_repas_factures, statut)
    VALUES ('FACT-ENT-001', client_entreprise_id, abonnement_id, date_trunc('month', now() - interval '1 month'), CURRENT_DATE, 1250.00, 0, 1250.00, 100, 'PAYEE')
    ON CONFLICT (numero_facture) DO NOTHING RETURNING id INTO facture_entreprise_id_1;

    -- **PAIEMENT 1 (ENTREPRISE)** - Montant: 1250.00€, Payé il y a 15 jours
    INSERT INTO paiements_entreprises (facture_id, montant, mode_paiement, statut, date_paiement)
    VALUES (facture_entreprise_id_1, 1250.00, 'VIREMENT', 'CONFIRME', NOW() - INTERVAL '15 days')
    ON CONFLICT (id) DO NOTHING;

    -- Facture 2 (mensuelle)
    INSERT INTO factures_entreprises (numero_facture, client_id, abonnement_id, mois_facture, date_echeance, montant_ht, montant_tva, montant_ttc, nb_repas_factures, statut)
    VALUES ('FACT-ENT-002', client_entreprise_id, abonnement_id, date_trunc('month', now()), CURRENT_DATE + 30, 1300.00, 0, 1300.00, 105, 'PAYEE')
    ON CONFLICT (numero_facture) DO NOTHING RETURNING id INTO facture_entreprise_id_2;

    -- **PAIEMENT 2 (ENTREPRISE)** - Montant: 1300.00€, Payé il y a 3 jours
    INSERT INTO paiements_entreprises (facture_id, montant, mode_paiement, statut, date_paiement)
    VALUES (facture_entreprise_id_2, 1300.00, 'VIREMENT', 'CONFIRME', NOW() - INTERVAL '3 days')
    ON CONFLICT (id) DO NOTHING;
    
END $$;