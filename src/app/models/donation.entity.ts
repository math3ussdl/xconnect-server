import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('donations')
export class Donation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => User, user => user.donations, {
    cascade: true
  })
  @JoinTable()
  donor: User;

  @ManyToOne(type => User, user => user.receipts, {
    cascade: true
  })
  @JoinTable()
  receiver: User;

  @OneToMany(() => Product, product => product.donation)
  products: Product[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: string;
}
