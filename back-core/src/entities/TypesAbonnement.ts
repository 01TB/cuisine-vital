import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Abonnements } from "./Abonnements";
import { AccompagnementTypeAbonnement } from "./AccompagnementTypeAbonnement";
import { MenuTypeAbonnement } from "./MenuTypeAbonnement";

@Index("types_abonnement_pkey", ["id"], { unique: true })
@Index("types_abonnement_nom_key", ["nom"], { unique: true })
@Entity("types_abonnement", { schema: "public" })
export class TypesAbonnement {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "nom", unique: true, length: 10 })
  nom: string;

  @Column("numeric", { name: "prix_jour", precision: 8, scale: 2 })
  prixJour: string;

  @Column("integer", { name: "nb_menus_disponibles" })
  nbMenusDisponibles: number;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Abonnements, (abonnements) => abonnements.typeAbonnement)
  abonnements: Abonnements[];

  @OneToMany(
    () => AccompagnementTypeAbonnement,
    (accompagnementTypeAbonnement) =>
      accompagnementTypeAbonnement.typeAbonnement
 )
  accompagnementTypeAbonnements: AccompagnementTypeAbonnement[];

  @OneToMany(
    () => MenuTypeAbonnement,
    (menuTypeAbonnement) => menuTypeAbonnement.typeAbonnement
  )
  menuTypeAbonnements: MenuTypeAbonnement[];

  constructor(init?: Partial<TypesAbonnement>) {
    Object.assign(this, init);
  }
}
