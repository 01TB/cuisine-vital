import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Abonnements } from "./Abonnements";
import { SelectionsHebdomadaires } from "./SelectionsHebdomadaires";

@Index("idx_bons_commande_abonnement", ["abonnementId"], {})
@Index("bons_commande_pkey", ["id"], { unique: true })
@Index("idx_bons_commande_semaine", ["semaineDebut", "semaineFin"], {})
@Entity("bons_commande", { schema: "public" })
export class BonsCommande {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("uuid", { name: "abonnement_id" })
  abonnementId: string;

  @Column("date", { name: "semaine_debut" })
  semaineDebut: string;

  @Column("date", { name: "semaine_fin" })
  semaineFin: string;

  @Column("character varying", {
    name: "statut",
    nullable: true,
    length: 15,
    default: () => "'EN_ATTENTE'",
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

  @ManyToOne(() => Abonnements, (abonnements) => abonnements.bonsCommandes, {
    lazy: true,
  })
  @JoinColumn([{ name: "abonnement_id", referencedColumnName: "id" }])
  abonnement: Promise<Abonnements>;

  @OneToMany(
    () => SelectionsHebdomadaires,
    (selectionsHebdomadaires) => selectionsHebdomadaires.bonCommande,
    { lazy: true }
  )
  selectionsHebdomadaires: Promise<SelectionsHebdomadaires[]>;

  constructor(init?: Partial<BonsCommande>) {
    Object.assign(this, init);
  }
}
