import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Clients } from "./Clients";
import { CommandesIndividuelles } from "./CommandesIndividuelles";
import { FacturesIndividuellesDetails } from "./FacturesIndividuellesDetails";
import { PaiementsIndividuels } from "./PaiementsIndividuels";

@Index("idx_factures_ind_client", ["clientId"], {})
@Index("idx_factures_ind_date", ["dateFacture"], {})
@Index("factures_individuelles_pkey", ["id"], { unique: true })
@Index("factures_individuelles_numero_facture_key", ["numeroFacture"], {
  unique: true,
})
@Entity("factures_individuelles", { schema: "public" })
export class FacturesIndividuelles {
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

  @ManyToOne(() => Clients, (clients) => clients.facturesIndividuelles, {
    lazy: true,
  })
  @JoinColumn([{ name: "client_id", referencedColumnName: "id" }])
  client: Promise<Clients>;

  @ManyToOne(
    () => CommandesIndividuelles,
    (commandesIndividuelles) => commandesIndividuelles.facturesIndividuelles,
    { lazy: true }
  )
  @JoinColumn([{ name: "commande_id", referencedColumnName: "id" }])
  commande: Promise<CommandesIndividuelles>;

  @OneToMany(
    () => FacturesIndividuellesDetails,
    (facturesIndividuellesDetails) => facturesIndividuellesDetails.facture,
    { lazy: true }
  )
  facturesIndividuellesDetails: Promise<FacturesIndividuellesDetails[]>;

  @OneToMany(
    () => PaiementsIndividuels,
    (paiementsIndividuels) => paiementsIndividuels.facture,
    { lazy: true }
  )
  paiementsIndividuels: Promise<PaiementsIndividuels[]>;

  constructor(init?: Partial<FacturesIndividuelles>) {
    Object.assign(this, init);
  }
}
