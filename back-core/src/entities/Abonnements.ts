import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Clients } from "./Clients";
import { TypesAbonnement } from "./TypesAbonnement";
import { BonsCommande } from "./BonsCommande";
import { CommandesEntreprises } from "./CommandesEntreprises";
import { FacturesEntreprises } from "./FacturesEntreprises";

@Index("idx_abonnements_actifs", ["actif", "dateDebut", "dateFin"], {})
@Index("idx_abonnements_client", ["clientId"], {})
@Index("abonnements_pkey", ["id"], { unique: true })
@Entity("abonnements", { schema: "public" })
export class Abonnements {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("uuid", { name: "client_id" })
  clientId: string;

  @Column("integer", { name: "nb_employes" })
  nbEmployes: number;

  @Column("date", { name: "date_debut" })
  dateDebut: string;

  @Column("date", { name: "date_fin", nullable: true })
  dateFin: string | null;

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

  @ManyToOne(() => Clients, (clients) => clients.abonnements, { lazy: true })
  @JoinColumn([{ name: "client_id", referencedColumnName: "id" }])
  client: Promise<Clients>;

  @ManyToOne(
    () => TypesAbonnement,
    (typesAbonnement) => typesAbonnement.abonnements,
    { lazy: true }
  )
  @JoinColumn([{ name: "type_abonnement_id", referencedColumnName: "id" }])
  typeAbonnement: Promise<TypesAbonnement>;

  @OneToMany(() => BonsCommande, (bonsCommande) => bonsCommande.abonnement, {
    lazy: true,
  })
  bonsCommandes: Promise<BonsCommande[]>;

  @OneToMany(
    () => CommandesEntreprises,
    (commandesEntreprises) => commandesEntreprises.abonnement,
    { lazy: true }
  )
  commandesEntreprises: Promise<CommandesEntreprises[]>;

  @OneToMany(
    () => FacturesEntreprises,
    (facturesEntreprises) => facturesEntreprises.abonnement,
    { lazy: true }
  )
  facturesEntreprises: Promise<FacturesEntreprises[]>;

  constructor(init?: Partial<Abonnements>) {
    Object.assign(this, init);
  }
}
