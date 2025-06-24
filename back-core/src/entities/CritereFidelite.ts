import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("critere_fidelite_pkey", ["id"], { unique: true })
@Entity("critere_fidelite", { schema: "public" })
export class CritereFidelite {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("numeric", { name: "prix_a_atteindre", precision: 10, scale: 2 })
  prixAAtteindre: string;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  constructor(init?: Partial<CritereFidelite>) {
    Object.assign(this, init);
  }
}
