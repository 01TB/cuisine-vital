import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CommandesEntreprisesDetails } from "./CommandesEntreprisesDetails";
import { CommandesIndividuellesDetails } from "./CommandesIndividuellesDetails";

@Index("boissons_pkey", ["id"], { unique: true })
@Entity("boissons", { schema: "public" })
export class Boissons {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "nom", length: 50 })
  nom: string;

  @Column("numeric", { name: "prix", precision: 6, scale: 2 })
  prix: string;

  @Column("boolean", {
    name: "disponible",
    nullable: true,
    default: () => "true",
  })
  disponible: boolean | null;

  @OneToMany(
    () => CommandesEntreprisesDetails,
    (commandesEntreprisesDetails) => commandesEntreprisesDetails.boisson,
    { lazy: true }
  )
  commandesEntreprisesDetails: Promise<CommandesEntreprisesDetails[]>;

  @OneToMany(
    () => CommandesIndividuellesDetails,
    (commandesIndividuellesDetails) => commandesIndividuellesDetails.boisson,
    { lazy: true }
  )
  commandesIndividuellesDetails: Promise<CommandesIndividuellesDetails[]>;

  constructor(init?: Partial<Boissons>) {
    Object.assign(this, init);
  }
}
