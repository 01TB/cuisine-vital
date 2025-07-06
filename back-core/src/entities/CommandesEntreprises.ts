import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Abonnements } from "./Abonnements";
import { Clients } from "./Clients";
import { Utilisateurs } from "./Utilisateurs";
import { StatutsCommande } from "./StatutsCommande";
import { CommandesEntreprisesDetails } from "./CommandesEntreprisesDetails";
import { LivraisonsEntreprises } from "./LivraisonsEntreprises";

@Index("idx_commandes_ent_abonnement", ["abonnementId"], {})
@Index("idx_commandes_ent_client", ["clientId"], {})
@Index("idx_commandes_ent_date_livraison", ["dateLivraison"], {})
@Index("commandes_entreprises_pkey", ["id"], { unique: true })
@Index("commandes_entreprises_numero_commande_key", ["numeroCommande"], {
  unique: true,
})
@Index("idx_commandes_ent_statut", ["statutId"], {})
@Entity("commandes_entreprises", { schema: "public" })
export class CommandesEntreprises {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", {
    name: "numero_commande",
    unique: true,
    length: 20,
  })
  numeroCommande: string;

  @Column("uuid", { name: "client_id" })
  clientId: string;

  @Column("uuid", { name: "abonnement_id" })
  abonnementId: string;

  @Column("integer", { name: "statut_id" })
  statutId: number;

  @Column("timestamp without time zone", {
    name: "date_commande",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  dateCommande: Date | null;

  @Column("date", { name: "date_livraison" })
  dateLivraison: string;

  @Column("text", { name: "adresse_livraison" })
  adresseLivraison: string;

  @Column("numeric", { name: "montant_total", precision: 10, scale: 2 })
  montantTotal: string;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(
    () => Abonnements,
    (abonnements) => abonnements.commandesEntreprises,
    { lazy: true }
  )
  @JoinColumn([{ name: "abonnement_id", referencedColumnName: "id" }])
  abonnement: Promise<Abonnements>;

  @ManyToOne(() => Clients, (clients) => clients.commandesEntreprises, {
    lazy: true,
  })
  @JoinColumn([{ name: "client_id", referencedColumnName: "id" }])
  client: Promise<Clients>;

  @ManyToOne(
    () => Utilisateurs,
    (utilisateurs) => utilisateurs.commandesEntreprises,
    { lazy: true }
  )
  @JoinColumn([{ name: "livreur_id", referencedColumnName: "id" }])
  livreur: Promise<Utilisateurs>;

  @ManyToOne(
    () => StatutsCommande,
    (statutsCommande) => statutsCommande.commandesEntreprises,
    { lazy: true }
  )
  @JoinColumn([{ name: "statut_id", referencedColumnName: "id" }])
  statut: Promise<StatutsCommande>;

  @OneToMany(
    () => CommandesEntreprisesDetails,
    (commandesEntreprisesDetails) => commandesEntreprisesDetails.commande,
    { lazy: true }
  )
  commandesEntreprisesDetails: Promise<CommandesEntreprisesDetails[]>;

  @OneToMany(
    () => LivraisonsEntreprises,
    (livraisonsEntreprises) => livraisonsEntreprises.commande,
    { lazy: true }
  )
  livraisonsEntreprises: Promise<LivraisonsEntreprises[]>;

  constructor(init?: Partial<CommandesEntreprises>) {
    Object.assign(this, init);
  }
}
