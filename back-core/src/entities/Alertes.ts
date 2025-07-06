import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("alertes_pkey", ["id"], { unique: true })
@Entity("alertes", { schema: "public" })
export class Alertes {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "type_alerte", length: 30 })
  typeAlerte: string;

  @Column("text", { name: "message" })
  message: string;

  @Column("character varying", {
    name: "niveau",
    nullable: true,
    length: 10,
    default: () => "'INFO'",
  })
  niveau: string | null;

  @Column("boolean", { name: "lue", nullable: true, default: () => "false" })
  lue: boolean | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  constructor(init?: Partial<Alertes>) {
    Object.assign(this, init);
  }
}
