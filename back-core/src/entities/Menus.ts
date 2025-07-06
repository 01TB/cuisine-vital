import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CommandesEntreprisesDetails } from "./CommandesEntreprisesDetails";
import { CommandesIndividuellesDetails } from "./CommandesIndividuellesDetails";
import { MenuTypeAbonnement } from "./MenuTypeAbonnement";
import { MenusFavoris } from "./MenusFavoris";
import { PlanningProduction } from "./PlanningProduction";
import { Recettes } from "./Recettes";
import { SelectionsHebdomadaires } from "./SelectionsHebdomadaires";

@Index("idx_menus_disponible", ["disponible"], {})
@Index("menus_pkey", ["id"], { unique: true })
@Entity("menus", { schema: "public" })
export class Menus {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "nom", length: 100 })
  nom: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("numeric", { name: "prix_carte", precision: 8, scale: 2 })
  prixCarte: string;

  @Column("integer", { name: "temps_preparation" })
  tempsPreparation: number;

  @Column("boolean", {
    name: "disponible",
    nullable: true,
    default: () => "true",
  })
  disponible: boolean | null;

  @Column("character varying", {
    name: "photo_url",
    nullable: true,
    length: 255,
  })
  photoUrl: string | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @OneToMany(
    () => CommandesEntreprisesDetails,
    (commandesEntreprisesDetails) => commandesEntreprisesDetails.menu,
    { lazy: true }
  )
  commandesEntreprisesDetails: Promise<CommandesEntreprisesDetails[]>;

  @OneToMany(
    () => CommandesIndividuellesDetails,
    (commandesIndividuellesDetails) => commandesIndividuellesDetails.menu,
    { lazy: true }
  )
  commandesIndividuellesDetails: Promise<CommandesIndividuellesDetails[]>;

  @OneToMany(
    () => MenuTypeAbonnement,
    (menuTypeAbonnement) => menuTypeAbonnement.menu,
    { lazy: true }
  )
  menuTypeAbonnements: Promise<MenuTypeAbonnement[]>;

  @OneToMany(() => MenusFavoris, (menusFavoris) => menusFavoris.menu, {
    lazy: true,
  })
  menusFavorises: Promise<MenusFavoris[]>;

  @OneToMany(
    () => PlanningProduction,
    (planningProduction) => planningProduction.menu,
    { lazy: true }
  )
  planningProductions: Promise<PlanningProduction[]>;

  @OneToMany(() => Recettes, (recettes) => recettes.menu, { lazy: true })
  recettes: Promise<Recettes[]>;

  @OneToMany(
    () => SelectionsHebdomadaires,
    (selectionsHebdomadaires) => selectionsHebdomadaires.menu,
    { lazy: true }
  )
  selectionsHebdomadaires: Promise<SelectionsHebdomadaires[]>;

  constructor(init?: Partial<Menus>) {
    Object.assign(this, init);
  }
}
