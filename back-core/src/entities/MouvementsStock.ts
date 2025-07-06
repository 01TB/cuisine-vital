import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ExemplairesIngredient } from "./ExemplairesIngredient";
import { Utilisateurs } from "./Utilisateurs";

@Index("idx_mouvements_stock_date", ["createdAt"], {})
@Index("mouvements_stock_pkey", ["id"], { unique: true })
@Index("idx_mouvements_stock_type", ["typeMouvement"], {})
@Entity("mouvements_stock", { schema: "public" })
export class MouvementsStock {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "type_mouvement", length: 15 })
  typeMouvement: string;

  @Column("numeric", { name: "quantite", precision: 8, scale: 2 })
  quantite: string;

  @Column("numeric", { name: "stock_avant", precision: 8, scale: 2 })
  stockAvant: string;

  @Column("numeric", { name: "stock_apres", precision: 8, scale: 2 })
  stockApres: string;

  @Column("text", { name: "commentaire", nullable: true })
  commentaire: string | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(
    () => ExemplairesIngredient,
    (exemplairesIngredient) => exemplairesIngredient.mouvementsStocks,
    { lazy: true }
  )
  @JoinColumn([
    { name: "exemplaire_ingredient_id", referencedColumnName: "id" },
  ])
  exemplaireIngredient: Promise<ExemplairesIngredient>;

  @ManyToOne(
    () => Utilisateurs,
    (utilisateurs) => utilisateurs.mouvementsStocks,
    { lazy: true }
  )
  @JoinColumn([{ name: "utilisateur_id", referencedColumnName: "id" }])
  utilisateur: Promise<Utilisateurs>;

  constructor(init?: Partial<MouvementsStock>) {
    Object.assign(this, init);
  }
}
