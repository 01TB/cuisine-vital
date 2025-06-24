import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FacturesEntreprises } from "./FacturesEntreprises";

@Index("factures_entreprises_details_pkey", ["id"], { unique: true })
@Entity("factures_entreprises_details", { schema: "public" })
export class FacturesEntreprisesDetails {
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
    () => FacturesEntreprises,
    (facturesEntreprises) => facturesEntreprises.facturesEntreprisesDetails,
    { onDelete: "CASCADE", lazy: true }
  )
  @JoinColumn([{ name: "facture_id", referencedColumnName: "id" }])
  facture: Promise<FacturesEntreprises>;

  constructor(init?: Partial<FacturesEntreprisesDetails>) {
    Object.assign(this, init);
  }
}
