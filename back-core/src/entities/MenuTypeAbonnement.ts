import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Menus } from "./Menus";
import { TypesAbonnement } from "./TypesAbonnement";

@Index("idx_menu_type_abonnement", ["disponible", "typeAbonnementId"], {})
@Index("menu_type_abonnement_pkey", ["id"], { unique: true })
@Entity("menu_type_abonnement", { schema: "public" })
export class MenuTypeAbonnement {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "type_abonnement_id" })
  typeAbonnementId: number;

  @Column("boolean", {
    name: "disponible",
    nullable: true,
    default: () => "true",
  })
  disponible: boolean | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Menus, (menus) => menus.menuTypeAbonnements, { lazy: true })
  @JoinColumn([{ name: "menu_id", referencedColumnName: "id" }])
  menu: Promise<Menus>;

  @ManyToOne(
    () => TypesAbonnement,
    (typesAbonnement) => typesAbonnement.menuTypeAbonnements,
    { lazy: true }
  )
  @JoinColumn([{ name: "type_abonnement_id", referencedColumnName: "id" }])
  typeAbonnement: Promise<TypesAbonnement>;

  constructor(init?: Partial<MenuTypeAbonnement>) {
    Object.assign(this, init);
  }
}
