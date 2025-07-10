import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Ingredients } from "./Ingredients";
import { Menus } from "./Menus";

@Index("recettes_pkey", ["id"], { unique: true })
@Index("idx_recettes_menu", ["menuId"], {})
@Entity("recettes", { schema: "public" })
export class Recettes {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "menu_id" })
  menuId: number;

  @Column("numeric", { name: "quantite", precision: 8, scale: 2 })
  quantite: number;

  @Column("integer", { name: "ingredient_id" })
  ingredientId: number;

  @ManyToOne(() => Ingredients, (ingredients) => ingredients.recettes)
  @JoinColumn([{ name: "ingredient_id", referencedColumnName: "id" }])
  ingredient: Promise<Ingredients>;

  @ManyToOne(() => Menus, (menus) => menus.recettes, {
    onDelete: "CASCADE"
  })
  @JoinColumn([{ name: "menu_id", referencedColumnName: "id" }])
  menu: Promise<Menus>;

  constructor(init?: Partial<Recettes>) {
    Object.assign(this, init);
  }
}
