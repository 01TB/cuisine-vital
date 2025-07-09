INSERT INTO zones_livraison (nom, description) VALUES
('Antaninarenina', 'Centre-ville, quartier des affaires'),
('Analakely', 'Marché central et environs'),
('Isotry', 'Quartier résidentiel sud'),
('Behoririka', 'Zone commerciale'),
('Ambatonakanga', 'Quartier historique'),
('Tsaralalàna', 'Zone administrative'),
('Ankadifotsy', 'Quartier résidentiel'),
('Ampefiloha', 'Zone diplomatique');

INSERT INTO utilisateurs (nom, prenom, email, telephone, mot_de_passe, role_id, zone_livraison_id, actif)
VALUES
  ('Rabe', 'Andry', 'mail1@gmail.com', '0321234567', 'mdp', 1, NULL, TRUE), -- admin
  ('Rakoto', 'Fanja', 'mail2@gmail.com', '0339876543', 'mdp', 2, NULL, TRUE), -- chef
  ('Randria', 'Lova', 'mail3@gmail.com', '0341122334', 'mdp', 3, 1, TRUE), -- livreur
  ('Rasoanaivo', 'Niry', 'mail4@gmail.com', '0345566778', 'mdp', 3, 2, TRUE); -- livreur
