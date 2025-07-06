import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BonsCommande } from "./BonsCommande";
import { Menus } from "./Menus";

@Index("idx_selections_bon_commande", ["bonCommandeId"], {})
@Index("selections_hebdomadaires_pkey", ["id"], { unique: true })
@Entity("selections_hebdomadaires", { schema: "public" })
export class SelectionsHebdomadaires {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("uuid", { name: "bon_commande_id" })
  bonCommandeId: string;

  @Column("integer", { name: "jour_semaine" })
  jourSemaine: number;

  @Column("integer", { name: "quantite" })
  quantite: number;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(
    () => BonsCommande,
    (bonsCommande) => bonsCommande.selectionsHebdomadaires,
    { onDelete: "CASCADE", lazy: true }
  )
  @JoinColumn([{ name: "bon_commande_id", referencedColumnName: "id" }])
  bonCommande: Promise<BonsCommande>;

  @ManyToOne(() => Menus, (menus) => menus.selectionsHebdomadaires, {
    lazy: true,
  })
  @JoinColumn([{ name: "menu_id", referencedColumnName: "id" }])
  menu: Promise<Menus>;

  constructor(init?: Partial<SelectionsHebdomadaires>) {
    Object.assign(this, init);
  }
}
