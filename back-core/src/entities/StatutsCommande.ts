import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CommandesEntreprises } from "./CommandesEntreprises";
import { CommandesIndividuelles } from "./CommandesIndividuelles";

@Index("statuts_commande_pkey", ["id"], { unique: true })
@Index("statuts_commande_nom_key", ["nom"], { unique: true })
@Entity("statuts_commande", { schema: "public" })
export class StatutsCommande {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "nom", unique: true, length: 30 })
  nom: string;

  @Column("integer", { name: "ordre" })
  ordre: number;

  @OneToMany(
    () => CommandesEntreprises,
    (commandesEntreprises) => commandesEntreprises.statut,
    { lazy: true }
  )
  commandesEntreprises: Promise<CommandesEntreprises[]>;

  @OneToMany(
    () => CommandesIndividuelles,
    (commandesIndividuelles) => commandesIndividuelles.statut,
    { lazy: true }
  )
  commandesIndividuelles: Promise<CommandesIndividuelles[]>;

  constructor(init?: Partial<StatutsCommande>) {
    Object.assign(this, init);
  }
}
