import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Clients } from "./Clients";

@Index("clients_individuels_fideles_pkey", ["id"], { unique: true })
@Entity("clients_individuels_fideles", { schema: "public" })
export class ClientsIndividuelsFideles {
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

  @ManyToOne(() => Clients, (clients) => clients.clientsIndividuelsFideles, {
    lazy: true,
  })
  @JoinColumn([{ name: "client_id", referencedColumnName: "id" }])
  client: Promise<Clients>;

  constructor(init?: Partial<ClientsIndividuelsFideles>) {
    Object.assign(this, init);
  }
}
