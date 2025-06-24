import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Abonnements } from "./Abonnements";
import { ZonesLivraison } from "./ZonesLivraison";
import { ClientsIndividuelsFideles } from "./ClientsIndividuelsFideles";
import { CommandesEntreprises } from "./CommandesEntreprises";
import { CommandesIndividuelles } from "./CommandesIndividuelles";
import { FacturesEntreprises } from "./FacturesEntreprises";
import { FacturesIndividuelles } from "./FacturesIndividuelles";
import { MenusFavoris } from "./MenusFavoris";

@Index("clients_email_key", ["email"], { unique: true })
@Index("idx_clients_email", ["email"], {})
@Index("clients_pkey", ["id"], { unique: true })
@Index("idx_clients_type", ["typeClient"], {})
@Index("idx_clients_zone", ["zoneLivraisonId"], {})
@Entity("clients", { schema: "public" })
export class Clients {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", { name: "nom", length: 100 })
  nom: string;

  @Column("character varying", { name: "prenom", nullable: true, length: 100 })
  prenom: string | null;

  @Column("character varying", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("character varying", {
    name: "telephone",
    nullable: true,
    length: 20,
  })
  telephone: string | null;

  @Column("text", { name: "adresse" })
  adresse: string;

  @Column("integer", { name: "zone_livraison_id" })
  zoneLivraisonId: number;

  @Column("character varying", { name: "type_client", length: 15 })
  typeClient: string;

  @Column("boolean", { name: "actif", nullable: true, default: () => "true" })
  actif: boolean | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Abonnements, (abonnements) => abonnements.client, {
    lazy: true,
  })
  abonnements: Promise<Abonnements[]>;

  @ManyToOne(() => ZonesLivraison, (zonesLivraison) => zonesLivraison.clients, {
    lazy: true,
  })
  @JoinColumn([{ name: "zone_livraison_id", referencedColumnName: "id" }])
  zoneLivraison: Promise<ZonesLivraison>;

  @OneToMany(
    () => ClientsIndividuelsFideles,
    (clientsIndividuelsFideles) => clientsIndividuelsFideles.client,
    { lazy: true }
  )
  clientsIndividuelsFideles: Promise<ClientsIndividuelsFideles[]>;

  @OneToMany(
    () => CommandesEntreprises,
    (commandesEntreprises) => commandesEntreprises.client,
    { lazy: true }
  )
  commandesEntreprises: Promise<CommandesEntreprises[]>;

  @OneToMany(
    () => CommandesIndividuelles,
    (commandesIndividuelles) => commandesIndividuelles.client,
    { lazy: true }
  )
  commandesIndividuelles: Promise<CommandesIndividuelles[]>;

  @OneToMany(
    () => FacturesEntreprises,
    (facturesEntreprises) => facturesEntreprises.client,
    { lazy: true }
  )
  facturesEntreprises: Promise<FacturesEntreprises[]>;

  @OneToMany(
    () => FacturesIndividuelles,
    (facturesIndividuelles) => facturesIndividuelles.client,
    { lazy: true }
  )
  facturesIndividuelles: Promise<FacturesIndividuelles[]>;

  @OneToMany(() => MenusFavoris, (menusFavoris) => menusFavoris.client, {
    lazy: true,
  })
  menusFavorises: Promise<MenusFavoris[]>;

  constructor(init?: Partial<Clients>) {
    Object.assign(this, init);
  }
}
