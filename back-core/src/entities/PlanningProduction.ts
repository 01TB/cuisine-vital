import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Utilisateurs } from "./Utilisateurs";
import { Menus } from "./Menus";

@Index("idx_planning_production_cuisinier", ["cuisinierId"], {})
@Index("idx_planning_production_date", ["dateProduction"], {})
@Index("planning_production_pkey", ["id"], { unique: true })
@Entity("planning_production", { schema: "public" })
export class PlanningProduction {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("date", { name: "date_production" })
  dateProduction: string;

  @Column("integer", { name: "quantite_prevue" })
  quantitePrevue: number;

  @Column("integer", {
    name: "quantite_produite",
    nullable: true,
    default: () => "0",
  })
  quantiteProduite: number | null;

  @Column("uuid", { name: "cuisinier_id", nullable: true })
  cuisinierId: string | null;

  @Column("integer", { name: "temps_prevu", nullable: true })
  tempsPrevu: number | null;

  @Column("integer", { name: "temps_reel", nullable: true })
  tempsReel: number | null;

  @Column("character varying", {
    name: "statut",
    nullable: true,
    length: 15,
    default: () => "'PLANIFIE'",
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
    () => Utilisateurs,
    (utilisateurs) => utilisateurs.planningProductions,
    { lazy: true }
  )
  @JoinColumn([{ name: "cuisinier_id", referencedColumnName: "id" }])
  cuisinier: Promise<Utilisateurs>;

  @ManyToOne(() => Menus, (menus) => menus.planningProductions, { lazy: true })
  @JoinColumn([{ name: "menu_id", referencedColumnName: "id" }])
  menu: Promise<Menus>;

  constructor(init?: Partial<PlanningProduction>) {
    Object.assign(this, init);
  }
}
