import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Clients } from "./Clients";
import { Menus } from "./Menus";

@Index("menus_favoris_pkey", ["id"], { unique: true })
@Entity("menus_favoris", { schema: "public" })
export class MenusFavoris {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Clients, (clients) => clients.menusFavorises, { lazy: true })
  @JoinColumn([{ name: "client_id", referencedColumnName: "id" }])
  client: Promise<Clients>;

  @ManyToOne(() => Menus, (menus) => menus.menusFavorises, { lazy: true })
  @JoinColumn([{ name: "menu_id", referencedColumnName: "id" }])
  menu: Promise<Menus>;

  constructor(init?: Partial<MenusFavoris>) {
    Object.assign(this, init);
  }
}
