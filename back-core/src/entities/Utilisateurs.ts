import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { CommandesEntreprises } from "./CommandesEntreprises";
import { CommandesIndividuelles } from "./CommandesIndividuelles";
import { LivraisonsEntreprises } from "./LivraisonsEntreprises";
import { LivraisonsIndividuelles } from "./LivraisonsIndividuelles";
import { MouvementsStock } from "./MouvementsStock";
import { PlanningProduction } from "./PlanningProduction";
import { Sessions } from "./Sessions";
import { Roles } from "./Roles";
import { ZonesLivraison } from "./ZonesLivraison";

@Index("utilisateurs_email_key", ["email"], { unique: true })
@Index("idx_utilisateurs_email", ["email"], {})
@Index("utilisateurs_pkey", ["id"], { unique: true })
@Index("idx_utilisateurs_role", ["roleId"], {})
@Entity("utilisateurs", { schema: "public" })
export class Utilisateurs {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", { name: "nom", length: 100 })
  nom: string;

  @Column("character varying", { name: "prenom", length: 100 })
  prenom: string;

  @Column("character varying", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("character varying", {
    name: "telephone",
    nullable: true,
    length: 20,
  })
  telephone: string | null;

  @Column("character varying", { name: "mot_de_passe", length: 255 })
  motDePasse: string;

  @Column("integer", { name: "role_id" })
  roleId: number;

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

  @OneToMany(
    () => CommandesEntreprises,
    (commandesEntreprises) => commandesEntreprises.livreur,
    { lazy: true }
  )
  commandesEntreprises: Promise<CommandesEntreprises[]>;

  @OneToMany(
    () => CommandesIndividuelles,
    (commandesIndividuelles) => commandesIndividuelles.livreur,
    { lazy: true }
  )
  commandesIndividuelles: Promise<CommandesIndividuelles[]>;

  @OneToMany(
    () => LivraisonsEntreprises,
    (livraisonsEntreprises) => livraisonsEntreprises.livreur,
    { lazy: true }
  )
  livraisonsEntreprises: Promise<LivraisonsEntreprises[]>;

  @OneToMany(
    () => LivraisonsIndividuelles,
    (livraisonsIndividuelles) => livraisonsIndividuelles.livreur,
    { lazy: true }
  )
  livraisonsIndividuelles: Promise<LivraisonsIndividuelles[]>;

  @OneToMany(
    () => MouvementsStock,
    (mouvementsStock) => mouvementsStock.utilisateur,
    { lazy: true }
  )
  mouvementsStocks: Promise<MouvementsStock[]>;

  @OneToMany(
    () => PlanningProduction,
    (planningProduction) => planningProduction.cuisinier,
    { lazy: true }
  )
  planningProductions: Promise<PlanningProduction[]>;

  @OneToMany(() => Sessions, (sessions) => sessions.utilisateur, { lazy: true })
  sessions: Promise<Sessions[]>;

  @ManyToOne(() => Roles, (roles) => roles.utilisateurs, { lazy: true })
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: Promise<Roles>;

  @ManyToOne(
    () => ZonesLivraison,
    (zonesLivraison) => zonesLivraison.utilisateurs,
    { lazy: true }
  )
  @JoinColumn([{ name: "zone_livraison_id", referencedColumnName: "id" }])
  zoneLivraison: Promise<ZonesLivraison>;

  constructor(init?: Partial<Utilisateurs>) {
    Object.assign(this, init);
  }
}
