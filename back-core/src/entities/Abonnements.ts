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

  @ManyToOne(() => Clients, (clients) => clients.abonnements)
  @JoinColumn([{ name: "client_id", referencedColumnName: "id" }])
  client: Clients;

  @ManyToOne(
    () => TypesAbonnement,
    (typesAbonnement) => typesAbonnement.abonnements
  )
  @JoinColumn([{ name: "type_abonnement_id", referencedColumnName: "id" }])
  typeAbonnement: TypesAbonnement;

  @OneToMany(() => BonsCommande, (bonsCommande) => bonsCommande.abonnement)
  bonsCommandes: BonsCommande[];

  @OneToMany(
    () => CommandesEntreprises,
    (commandesEntreprises) => commandesEntreprises.abonnement)
  commandesEntreprises: CommandesEntreprises[];

  @OneToMany(
    () => FacturesEntreprises,
    (facturesEntreprises) => facturesEntreprises.abonnement)
  facturesEntreprises: FacturesEntreprises[];

  constructor(init?: Partial<Abonnements>) {
    Object.assign(this, init);
  }
}
