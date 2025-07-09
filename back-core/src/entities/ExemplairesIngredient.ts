import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ingredients } from './Ingredients';
import { MouvementsStock } from './MouvementsStock';

@Index('idx_exemplaires_peremption', ['datePeremption'], {})
@Index('exemplaires_ingredient_pkey', ['id'], { unique: true })
@Entity('exemplaires_ingredient', { schema: 'public' })
export class ExemplairesIngredient {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('numeric', { name: 'quantite', precision: 100, scale: 2 })
  quantite: number;

  @Column('date', { name: 'date_peremption', nullable: true })
  datePeremption: Date | null;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('timestamp without time zone', { name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(
    () => Ingredients,
    (ingredients) => ingredients.exemplairesIngredients,
  )
  @JoinColumn([{ name: 'ingredient_id', referencedColumnName: 'id' }])
  ingredient: Ingredients;

  @OneToMany(
    () => MouvementsStock,
    (mouvementsStock) => mouvementsStock.exemplaireIngredient,
  )
  mouvementsStocks: MouvementsStock[];

  constructor(init?: Partial<ExemplairesIngredient>) {
    Object.assign(this, init);
  }
}
