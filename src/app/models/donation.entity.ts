import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('donations')
export class Donation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    type => User,
    user => user.donations,
    {
      cascade: true,
    },
  )
  @JoinTable()
  donor?: User;

  @ManyToOne(
    type => User,
    user => user.receipts,
    {
      cascade: true,
    },
  )
  @JoinTable()
  receipt?: User;

  @OneToMany(
    () => Product,
    product => product.donation,
    { cascade: ['insert', 'update', 'remove'], onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  products: Product[];

  @Column({ type: 'varchar', length: 50, enum: ['Realizada', 'Em Andamento', 'Entregue'], default: 'Realizada' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: string;
}

export interface IDonationDTO {
  products: Product[];
}

export interface IDonationUpdated {
  products?: Product[];
  donor?: User;
  receipt?: User;
  status?: string;
}
