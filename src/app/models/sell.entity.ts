import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity('sells')
export class Sell {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    type => User,
    user => user.purchases,
    {
      cascade: true,
    },
  )
  @JoinTable()
  buyer: User;

  @OneToMany(
    () => Product,
    product => product.sell,
    { cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  )
  products: Product[];

  @Column({ type: 'varchar', length: 50, enum: ['Realizada', 'Em Andamento', 'Entregue'], default: 'Realizada' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: string;
}

export interface ISellDTO {
  products: Product[];
}
