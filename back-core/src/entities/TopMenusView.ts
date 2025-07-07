import { ViewEntity, ViewColumn, PrimaryColumn } from 'typeorm';

@ViewEntity({
  name: 'v_top_menus',
})
export class TopMenusView {
  @PrimaryColumn()
  @ViewColumn()
  id: number;

  @ViewColumn()
  nom: string;

  @ViewColumn({ name: 'quantite_totale' })
  quantiteTotale: number;

  @ViewColumn({ name: 'chiffre_affaire_total' })
  chiffreAffaireTotal: number;

  @ViewColumn({ name: 'quantite_particuliers' })
  quantiteParticuliers: number;

  @ViewColumn({ name: 'quantite_entreprises' })
  quantiteEntreprises: number;
} 