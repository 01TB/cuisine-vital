
import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { Clients } from './Clients';
import { StatutsCommande } from './StatutsCommande';
import { Utilisateurs } from './Utilisateurs';
import { Abonnements } from './Abonnements';

@ViewEntity({
  name: 'v_commandes_historique',
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      // La logique de la vue est dans la BDD, ici on ne fait que la mapper.
      // Cette expression n'est pas exécutée si la vue existe déjà.
      .select('ci.id', 'commande_id')
      .from('commandes_individuelles', 'ci'),
})
export class HistoriqueCommandesView {
  @ViewColumn()
  commande_id: string;

  @ViewColumn()
  type_commande: 'INDIVIDUELLE' | 'ENTREPRISE';

  @ViewColumn()
  numero_commande: string;

  @ViewColumn()
  client_id: string;

  @ViewColumn()
  client_nom: string;

  @ViewColumn()
  statut_id: number;

  @ViewColumn()
  statut_nom: string;

  @ViewColumn()
  statut_ordre: number;

  @ViewColumn()
  date_commande: Date;

  @ViewColumn()
  date_livraison: Date;

  @ViewColumn()
  montant_total: number;

  @ViewColumn()
  livreur_id: string;

  @ViewColumn()
  livreur_nom: string;

  @ViewColumn()
  abonnement_id: string;

  @ViewColumn()
  created_at: Date;

  @ViewColumn()
  deleted_at: Date;
}