import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable } from 'typeorm';
import { User } from './user.entity';

@Entity('sells')
export class Sell {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => User, user => user.purchases, {
    cascade: true
  })
  @JoinTable()
  buyer: User;

  @ManyToOne(type => User, user => user.sales, {
    cascade: true
  })
  @JoinTable()
  seller: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: string;
}
