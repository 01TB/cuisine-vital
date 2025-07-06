import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Roles } from "./Roles";

@Index("salaires_pkey", ["id"], { unique: true })
@Entity("salaires", { schema: "public" })
export class Salaires {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("numeric", { name: "salaire_mensuel", precision: 10, scale: 2 })
  salaireMensuel: string;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Roles, (roles) => roles.salaires, { lazy: true })
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: Promise<Roles>;

  constructor(init?: Partial<Salaires>) {
    Object.assign(this, init);
  }
}
