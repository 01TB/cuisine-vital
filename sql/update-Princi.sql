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