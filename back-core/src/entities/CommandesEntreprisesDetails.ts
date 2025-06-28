import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Boissons } from "./Boissons";
import { CommandesEntreprises } from "./CommandesEntreprises";
import { Menus } from "./Menus";

@Index("commandes_entreprises_details_pkey", ["id"], { unique: true })
@Entity("commandes_entreprises_details", { schema: "public" })
export class CommandesEntreprisesDetails {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "quantite" })
  quantite: number;

  @Column("numeric", { name: "prix_unitaire", precision: 8, scale: 2 })
  prixUnitaire: number;

  @Column("text", { name: "notes", nullable: true })
  notes: string | null;

  @ManyToOne(
    () => Boissons,
    (boissons) => boissons.commandesEntreprisesDetails,
    { lazy: true }
  )
  @JoinColumn([{ name: "boisson_id", referencedColumnName: "id" }])
  boisson: Promise<Boissons>;

  @ManyToOne(
    () => CommandesEntreprises,
    (commandesEntreprises) => commandesEntreprises.commandesEntreprisesDetails,
    { onDelete: "CASCADE", lazy: true }
  )
  @JoinColumn([{ name: "commande_id", referencedColumnName: "id" }])
  commande: Promise<CommandesEntreprises>;

  @ManyToOne(() => Menus, (menus) => menus.commandesEntreprisesDetails, {
    lazy: true,
  })
  @JoinColumn([{ name: "menu_id", referencedColumnName: "id" }])
  menu: Promise<Menus>;

  constructor(init?: Partial<CommandesEntreprisesDetails>) {
    Object.assign(this, init);
  }
}
