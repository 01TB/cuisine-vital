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
import { FacturesEntreprisesDetails } from "./FacturesEntreprisesDetails";
import { PaiementsEntreprises } from "./PaiementsEntreprises";

@Index("idx_factures_ent_client", ["clientId"], {})
@Index("factures_entreprises_pkey", ["id"], { unique: true })
@Index("idx_factures_ent_mois", ["moisFacture"], {})
@Index("factures_entreprises_numero_facture_key", ["numeroFacture"], {
  unique: true,
})
@Entity("factures_entreprises", { schema: "public" })
export class FacturesEntreprises {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", {
    name: "numero_facture",
    unique: true,
    length: 20,
  })
  numeroFacture: string;

  @Column("uuid", { name: "client_id" })
  clientId: string;

  @Column("date", { name: "mois_facture" })
  moisFacture: string;

  @Column("date", { name: "date_facture", default: () => "CURRENT_DATE" })
  dateFacture: string;

  @Column("date", { name: "date_echeance" })
  dateEcheance: string;

  @Column("numeric", { name: "montant_ht", precision: 10, scale: 2 })
  montantHt: string;

  @Column("numeric", {
    name: "montant_tva",
    precision: 10,
    scale: 2,
    default: () => "0",
  })
  montantTva: string;

  @Column("numeric", { name: "montant_ttc", precision: 10, scale: 2 })
  montantTtc: string;

  @Column("integer", { name: "nb_repas_factures" })
  nbRepasFactures: number;

  @Column("character varying", {
    name: "statut",
    nullable: true,
    length: 15,
    default: () => "'EMISE'",
  })
  statut: string | null;

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
    (abonnements) => abonnements.facturesEntreprises,
    { lazy: true }
  )
  @JoinColumn([{ name: "abonnement_id", referencedColumnName: "id" }])
  abonnement: Promise<Abonnements>;

  @ManyToOne(() => Clients, (clients) => clients.facturesEntreprises, {
    lazy: true,
  })
  @JoinColumn([{ name: "client_id", referencedColumnName: "id" }])
  client: Promise<Clients>;

  @OneToMany(
    () => FacturesEntreprisesDetails,
    (facturesEntreprisesDetails) => facturesEntreprisesDetails.facture,
    { lazy: true }
  )
  facturesEntreprisesDetails: Promise<FacturesEntreprisesDetails[]>;

  @OneToMany(
    () => PaiementsEntreprises,
    (paiementsEntreprises) => paiementsEntreprises.facture,
    { lazy: true }
  )
  paiementsEntreprises: Promise<PaiementsEntreprises[]>;

  constructor(init?: Partial<FacturesEntreprises>) {
    Object.assign(this, init);
  }
}
