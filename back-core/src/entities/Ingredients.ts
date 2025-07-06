import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ExemplairesIngredient } from "./ExemplairesIngredient";
import { Recettes } from "./Recettes";

@Index("ingredients_pkey", ["id"], { unique: true })
@Index("idx_ingredients_stock_min", ["stockMinimum"], {})
@Entity("ingredients", { schema: "public" })
export class Ingredients {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "nom", length: 100 })
  nom: string;

  @Column("character varying", { name: "unite_mesure", length: 10 })
  uniteMesure: string;

  @Column("numeric", { name: "prix_unitaire", precision: 8, scale: 2 })
  prixUnitaire: string;

  @Column("numeric", { name: "stock_minimum", precision: 8, scale: 2 })
  stockMinimum: string;

  @Column("boolean", { name: "actif", nullable: true, default: () => "true" })
  actif: boolean | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @OneToMany(
    () => ExemplairesIngredient,
    (exemplairesIngredient) => exemplairesIngredient.ingredient,
    { lazy: true }
  )
  exemplairesIngredients: Promise<ExemplairesIngredient[]>;

  @OneToMany(() => Recettes, (recettes) => recettes.ingredient, { lazy: true })
  recettes: Promise<Recettes[]>;

  constructor(init?: Partial<Ingredients>) {
    Object.assign(this, init);
  }
}
