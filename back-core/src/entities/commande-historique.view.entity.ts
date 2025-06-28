
import { ViewEntity, ViewColumn, PrimaryColumn } from 'typeorm';

@ViewEntity({
    name: 'commande_historique_view',
})
export class CommandeHistoriqueView {
    @PrimaryColumn() 
    id: string;

    @ViewColumn()
    numero_commande: string;

    @ViewColumn()
    date_commande: Date;

    @ViewColumn()
    date_livraison: string;

    @ViewColumn()
    montant_total: number;
    
    @ViewColumn()
    adresse_livraison: string;

    @ViewColumn()
    client_id: string;

    @ViewColumn()
    client_nom: string;

    @ViewColumn()
    statut_id: number;

    @ViewColumn()
    statut_nom: string;

    @ViewColumn()
    livreur_id: string;
    
    @ViewColumn()
    livreur_nom: string;

    @ViewColumn()
    type_commande: 'INDIVIDUELLE' | 'ENTREPRISE';

    @ViewColumn()
    abonnement_id: string;
}