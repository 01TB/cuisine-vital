import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Utilisateurs } from "./Utilisateurs";

@Index("idx_sessions_expire", ["expireAt"], {})
@Index("sessions_pkey", ["id"], { unique: true })
@Index("sessions_token_key", ["token"], { unique: true })
@Index("idx_sessions_token", ["token"], {})
@Entity("sessions", { schema: "public" })
export class Sessions {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", { name: "token", unique: true, length: 255 })
  token: string;

  @Column("timestamp without time zone", { name: "expire_at" })
  expireAt: Date;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Utilisateurs, (utilisateurs) => utilisateurs.sessions, {
    onDelete: "CASCADE",
    lazy: true,
  })
  @JoinColumn([{ name: "utilisateur_id", referencedColumnName: "id" }])
  utilisateur: Promise<Utilisateurs>;

  constructor(init?: Partial<Sessions>) {
    Object.assign(this, init);
  }
}
