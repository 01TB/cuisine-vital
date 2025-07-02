import { IsNotEmpty } from "class-validator";

class CommandeDetails {
    @IsNotEmpty()
    menuId: number;

    @IsNotEmpty()
    accompagnementId: number;

    @IsNotEmpty()
    quantite: number;

    @IsNotEmpty()
    prixUnitaire: number;

    boissonId: number;

    notes: string
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
    dateCommande;

    dateLivraison;
    
    @IsNotEmpty()
    adresseLivraison: string;

    @IsNotEmpty()
    montantTotal: number;

    livreurId: string;

    @IsNotEmpty()
    details: CommandeDetails[];
}