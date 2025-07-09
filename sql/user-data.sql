INSERT INTO roles (nom, description) VALUES
  ('admin', 'Administrateur du système'),
  ('chef cuisinier', 'Responsable de la préparation des plats'),
  ('livreur', 'Responsable de la livraison des commandes');

INSERT INTO utilisateurs (nom, prenom, email, telephone, mot_de_passe, role_id, zone_livraison_id, actif)
VALUES
  ('Rabe', 'Andry', 'mail1@gmail.com', '0321234567', 'mdp', 1, NULL, TRUE), -- admin
  ('Rakoto', 'Fanja', 'mail2@gmail.com', '0339876543', 'mdp', 2, NULL, TRUE), -- chef
  ('Randria', 'Lova', 'mail3@gmail.com', '0341122334', 'mdp', 3, 1, TRUE), -- livreur
  ('Rasoanaivo', 'Niry', 'mail4@gmail.com', '0345566778', 'mdp', 3, 2, TRUE); -- livreur
