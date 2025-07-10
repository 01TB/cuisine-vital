import { IsNotEmpty } from "class-validator";

class CommandeDetails {
    menuId?: number;
    accompagnementId?: number;
    boissonId?: number;

    @IsNotEmpty()
    quantite: number;

    @IsNotEmpty()
    prixUnitaire: number;

    notes?: string;
}

export class CreateCommande {
    @IsNotEmpty()
    numeroCommande: string;

    @IsNotEmpty()
    clientId: string;

    abonnementId: string;

    @IsNotEmpty()
    statutId: number;

    @IsNotEmpty()
    dateCommande: string;

    dateLivraison: string;
    
    @IsNotEmpty()
    adresseLivraison: string;

    @IsNotEmpty()
    montantTotal: number;

    livreurId: string;

    zoneDeLivraison?: any; // Added for geographic point (GeoJSON)

    @IsNotEmpty()
    details: CommandeDetails[];

}