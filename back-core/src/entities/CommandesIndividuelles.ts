import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Clients } from "./Clients";
import { Utilisateurs } from "./Utilisateurs";
import { StatutsCommande } from "./StatutsCommande";
import { CommandesIndividuellesDetails } from "./CommandesIndividuellesDetails";
import { FacturesIndividuelles } from "./FacturesIndividuelles";
import { LivraisonsIndividuelles } from "./LivraisonsIndividuelles";

@Index("idx_commandes_ind_client", ["clientId"], {})
@Index("idx_commandes_ind_date_livraison", ["dateLivraison"], {})
@Index("commandes_individuelles_pkey", ["id"], { unique: true })
@Index("idx_commandes_ind_livreur", ["livreurId"], {})
@Index("commandes_individuelles_numero_commande_key", ["numeroCommande"], {
  unique: true,
})
@Index("idx_commandes_ind_statut", ["statutId"], {})
@Entity("commandes_individuelles", { schema: "public" })
export class CommandesIndividuelles {
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

  @Column("uuid", { name: "livreur_id", nullable: true })
  livreurId: string | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Clients, (clients) => clients.commandesIndividuelles, {
    lazy: true,
  })
  @JoinColumn([{ name: "client_id", referencedColumnName: "id" }])
  client: Promise<Clients>;

  @ManyToOne(
    () => Utilisateurs,
    (utilisateurs) => utilisateurs.commandesIndividuelles,
    { lazy: true }
  )
  @JoinColumn([{ name: "livreur_id", referencedColumnName: "id" }])
  livreur: Promise<Utilisateurs>;

  @ManyToOne(
    () => StatutsCommande,
    (statutsCommande) => statutsCommande.commandesIndividuelles,
    { lazy: true }
  )
  @JoinColumn([{ name: "statut_id", referencedColumnName: "id" }])
  statut: Promise<StatutsCommande>;

  @OneToMany(
    () => CommandesIndividuellesDetails,
    (commandesIndividuellesDetails) => commandesIndividuellesDetails.commande,
    { lazy: true }
  )
  commandesIndividuellesDetails: Promise<CommandesIndividuellesDetails[]>;

  @OneToMany(
    () => FacturesIndividuelles,
    (facturesIndividuelles) => facturesIndividuelles.commande,
    { lazy: true }
  )
  facturesIndividuelles: Promise<FacturesIndividuelles[]>;

  @OneToMany(
    () => LivraisonsIndividuelles,
    (livraisonsIndividuelles) => livraisonsIndividuelles.commande,
    { lazy: true }
  )
  livraisonsIndividuelles: Promise<LivraisonsIndividuelles[]>;

  constructor(init?: Partial<CommandesIndividuelles>) {
    Object.assign(this, init);
  }
}
