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

  @ManyToOne(
    type => User,
    user => user.sales,
    {
      cascade: true,
    },
  )
  @JoinTable()
  seller: User;

  @OneToMany(
    () => Product,
    product => product.sell,
    { cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  )
  products: Product[];

  @Column({ type: 'varchar', length: 50, enum: ['Iniciada', 'Pendente', 'Concluida'], default: 'Iniciada' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: string;
}

export interface ISellDTO {
  products: Product[];
  sellerEmail: string;
}

export interface ISellUpdated {
  buyer?: User;
  seller?: User;
  products?: Product[];
}
