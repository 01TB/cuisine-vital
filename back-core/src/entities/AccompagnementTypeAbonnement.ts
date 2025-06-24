import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Accompagnements } from "./Accompagnements";
import { TypesAbonnement } from "./TypesAbonnement";

@Index("accompagnement_type_abonnement_pkey", ["id"], { unique: true })
@Entity("accompagnement_type_abonnement", { schema: "public" })
export class AccompagnementTypeAbonnement {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("boolean", {
    name: "disponible",
    nullable: true,
    default: () => "true",
  })
  disponible: boolean | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(
    () => Accompagnements,
    (accompagnements) => accompagnements.accompagnementTypeAbonnements,
    { lazy: true }
  )
  @JoinColumn([{ name: "accompagnement_id", referencedColumnName: "id" }])
  accompagnement: Promise<Accompagnements>;

  @ManyToOne(
    () => TypesAbonnement,
    (typesAbonnement) => typesAbonnement.accompagnementTypeAbonnements,
    { lazy: true }
  )
  @JoinColumn([{ name: "type_abonnement_id", referencedColumnName: "id" }])
  typeAbonnement: Promise<TypesAbonnement>;

  constructor(init?: Partial<AccompagnementTypeAbonnement>) {
    Object.assign(this, init);
  }
}
