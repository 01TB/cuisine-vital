import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FacturesIndividuelles } from "./FacturesIndividuelles";

@Index("factures_individuelles_details_pkey", ["id"], { unique: true })
@Entity("factures_individuelles_details", { schema: "public" })
export class FacturesIndividuellesDetails {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "description" })
  description: string;

  @Column("integer", { name: "quantite" })
  quantite: number;

  @Column("numeric", { name: "prix_unitaire", precision: 8, scale: 2 })
  prixUnitaire: string;

  @Column("numeric", { name: "total_ligne", precision: 8, scale: 2 })
  totalLigne: string;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(
    () => FacturesIndividuelles,
    (facturesIndividuelles) =>
      facturesIndividuelles.facturesIndividuellesDetails,
    { onDelete: "CASCADE", lazy: true }
  )
  @JoinColumn([{ name: "facture_id", referencedColumnName: "id" }])
  facture: Promise<FacturesIndividuelles>;

  constructor(init?: Partial<FacturesIndividuellesDetails>) {
    Object.assign(this, init);
  }
}
