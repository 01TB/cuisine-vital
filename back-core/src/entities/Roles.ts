import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Salaires } from "./Salaires";
import { Utilisateurs } from "./Utilisateurs";

@Index("roles_pkey", ["id"], { unique: true })
@Index("roles_nom_key", ["nom"], { unique: true })
@Entity("roles", { schema: "public" })
export class Roles {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "nom", unique: true, length: 30 })
  nom: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @OneToMany(() => Salaires, (salaires) => salaires.role, { lazy: true })
  salaires: Promise<Salaires[]>;

  @OneToMany(() => Utilisateurs, (utilisateurs) => utilisateurs.role, {
    lazy: true,
  })
  utilisateurs: Promise<Utilisateurs[]>;

  constructor(init?: Partial<Roles>) {
    Object.assign(this, init);
  }
}
