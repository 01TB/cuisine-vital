import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { CommandesIndividuelles } from "./CommandesIndividuelles";
import { Utilisateurs } from "./Utilisateurs";

@Index("livraisons_individuelles_pkey", ["id"], { unique: true })
@Index("idx_livraisons_ind_localisation", ["localisation"], {})
@Entity("livraisons_individuelles", { schema: "public" })
export class LivraisonsIndividuelles {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("text", { name: "adresse" })
  adresse: string;

  @Column("geometry", { name: "localisation", nullable: true })
  localisation: string | null;

  @Column("time without time zone", { name: "heure_depart", nullable: true })
  heureDepart: string | null;

  @Column("time without time zone", { name: "heure_livraison", nullable: true })
  heureLivraison: string | null;

  @Column("character varying", {
    name: "statut",
    nullable: true,
    length: 15,
    default: () => "'ASSIGNEE'",
  })
  statut: string | null;

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
    () => CommandesIndividuelles,
    (commandesIndividuelles) => commandesIndividuelles.livraisonsIndividuelles,
    { lazy: true }
  )
  @JoinColumn([{ name: "commande_id", referencedColumnName: "id" }])
  commande: Promise<CommandesIndividuelles>;

  @ManyToOne(
    () => Utilisateurs,
    (utilisateurs) => utilisateurs.livraisonsIndividuelles,
    { lazy: true }
  )
  @JoinColumn([{ name: "livreur_id", referencedColumnName: "id" }])
  livreur: Promise<Utilisateurs>;

  constructor(init?: Partial<LivraisonsIndividuelles>) {
    Object.assign(this, init);
  }
}
