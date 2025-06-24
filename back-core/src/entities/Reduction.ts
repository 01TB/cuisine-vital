import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("reduction_pkey", ["id"], { unique: true })
@Entity("reduction", { schema: "public" })
export class Reduction {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("numeric", { name: "pourcentage", precision: 4, scale: 2 })
  pourcentage: string;

  constructor(init?: Partial<Reduction>) {
    Object.assign(this, init);
  }
}
