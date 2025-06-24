import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AccompagnementTypeAbonnement } from "./AccompagnementTypeAbonnement";
import { CommandesIndividuellesDetails } from "./CommandesIndividuellesDetails";

@Index("accompagnements_pkey", ["id"], { unique: true })
@Entity("accompagnements", { schema: "public" })
export class Accompagnements {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "nom", length: 50 })
  nom: string;

  @Column("character varying", { name: "type", length: 10 })
  type: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("numeric", { name: "prix_uniatire", precision: 10, scale: 2 })
  prixUniatire: string;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @OneToMany(
    () => AccompagnementTypeAbonnement,
    (accompagnementTypeAbonnement) =>
      accompagnementTypeAbonnement.accompagnement,
    { lazy: true }
  )
  accompagnementTypeAbonnements: Promise<AccompagnementTypeAbonnement[]>;

  @OneToMany(
    () => CommandesIndividuellesDetails,
    (commandesIndividuellesDetails) =>
      commandesIndividuellesDetails.accompagnement,
    { lazy: true }
  )
  commandesIndividuellesDetails: Promise<CommandesIndividuellesDetails[]>;

  constructor(init?: Partial<Accompagnements>) {
    Object.assign(this, init);
  }
}
