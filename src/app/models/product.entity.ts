import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable } from 'typeorm';
import { Donation } from './donation.entity';
import { Sell } from './sell.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80, unique: true })
  description: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'varchar', length: 50, enum: ['Novo', 'Seminovo', 'Usado'] })
  state: string;

  @ManyToOne(type => Donation, donation => donation.products, {
    cascade: true
  })
  @JoinTable()
  donation?: Donation;

  @ManyToOne(type => Sell, sell => sell.products, {
    cascade: true
  })
  @JoinTable()
  sell?: Sell;
}
