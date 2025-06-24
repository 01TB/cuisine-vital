import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Clients } from "./Clients";
import { Utilisateurs } from "./Utilisateurs";

@Index("zones_livraison_pkey", ["id"], { unique: true })
@Index("idx_zones_localisation", ["localisation"], {})
@Entity("zones_livraison", { schema: "public" })
export class ZonesLivraison {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "nom", length: 100 })
  nom: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("geometry", { name: "localisation", nullable: true })
  localisation: string | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Clients, (clients) => clients.zoneLivraison, { lazy: true })
  clients: Promise<Clients[]>;

  @OneToMany(() => Utilisateurs, (utilisateurs) => utilisateurs.zoneLivraison, {
    lazy: true,
  })
  utilisateurs: Promise<Utilisateurs[]>;

  constructor(init?: Partial<ZonesLivraison>) {
    Object.assign(this, init);
  }
}
