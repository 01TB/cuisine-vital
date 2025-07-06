import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Accompagnements } from "./Accompagnements";
import { Boissons } from "./Boissons";
import { CommandesIndividuelles } from "./CommandesIndividuelles";
import { Menus } from "./Menus";

@Index("commandes_individuelles_details_pkey", ["id"], { unique: true })
@Entity("commandes_individuelles_details", { schema: "public" })
export class CommandesIndividuellesDetails {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "quantite" })
  quantite: number;

  @Column("numeric", { name: "prix_unitaire", precision: 8, scale: 2 })
  prixUnitaire: number;

  @Column("text", { name: "notes", nullable: true })
  notes: string | null;

  @ManyToOne(
    () => Accompagnements,
    (accompagnements) => accompagnements.commandesIndividuellesDetails,
    { lazy: true }
  )
  @JoinColumn([{ name: "accompagnement_id", referencedColumnName: "id" }])
  accompagnement: Promise<Accompagnements>;

  @ManyToOne(
    () => Boissons,
    (boissons) => boissons.commandesIndividuellesDetails,
    { lazy: true }
  )
  @JoinColumn([{ name: "boisson_id", referencedColumnName: "id" }])
  boisson: Promise<Boissons>;

  @ManyToOne(
    () => CommandesIndividuelles,
    (commandesIndividuelles) =>
      commandesIndividuelles.commandesIndividuellesDetails,
    { onDelete: "CASCADE", lazy: true }
  )
  @JoinColumn([{ name: "commande_id", referencedColumnName: "id" }])
  commande: Promise<CommandesIndividuelles>;

  @ManyToOne(() => Menus, (menus) => menus.commandesIndividuellesDetails, {
    lazy: true,
  })
  @JoinColumn([{ name: "menu_id", referencedColumnName: "id" }])
  menu: Promise<Menus>;

  constructor(init?: Partial<CommandesIndividuellesDetails>) {
    Object.assign(this, init);
  }
}
