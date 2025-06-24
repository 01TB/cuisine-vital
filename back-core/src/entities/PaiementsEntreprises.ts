import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { FacturesEntreprises } from "./FacturesEntreprises";

@Index("paiements_entreprises_pkey", ["id"], { unique: true })
@Index("idx_paiements_ent_statut", ["statut"], {})
@Entity("paiements_entreprises", { schema: "public" })
export class PaiementsEntreprises {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", {
    name: "numero_transaction",
    nullable: true,
    length: 50,
  })
  numeroTransaction: string | null;

  @Column("timestamp without time zone", {
    name: "date_paiement",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  datePaiement: Date | null;

  @Column("numeric", { name: "montant", precision: 10, scale: 2 })
  montant: string;

  @Column("character varying", { name: "mode_paiement", length: 20 })
  modePaiement: string;

  @Column("character varying", {
    name: "statut",
    nullable: true,
    length: 15,
    default: () => "'EN_ATTENTE'",
  })
  statut: string | null;

  @Column("character varying", {
    name: "reference_externe",
    nullable: true,
    length: 100,
  })
  referenceExterne: string | null;

  @Column("text", { name: "commentaire", nullable: true })
  commentaire: string | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(
    () => FacturesEntreprises,
    (facturesEntreprises) => facturesEntreprises.paiementsEntreprises,
    { lazy: true }
  )
  @JoinColumn([{ name: "facture_id", referencedColumnName: "id" }])
  facture: Promise<FacturesEntreprises>;

  constructor(init?: Partial<PaiementsEntreprises>) {
    Object.assign(this, init);
  }
}
