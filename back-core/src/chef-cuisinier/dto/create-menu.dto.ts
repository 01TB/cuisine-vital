export class CreateMenuDto {
  nom: string;
  description?: string;
  prix_carte: number;
  temps_preparation: number;
  recette: { ingredient_id: number; quantite: number }[];
}
