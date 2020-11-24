import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Donation } from './donation.entity';
import { Sell } from './sell.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'char', length: 11, nullable: true, unique: true })
  cpf?: string;

  @Column({ type: 'char', length: 14, nullable: true, unique: true })
  cnpj?: string;

  @Column({ type: 'varchar', length: 40 })
  address: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', length: 12 })
  phone: string;

  @Column({ type: 'char', length: 8 })
  zip: string;

  @Column({ type: 'varchar', length: 4, enum: ['DPF', 'DPJ', 'ONG', 'BUSR'] })
  role: string;

  @OneToMany(
    () => Donation,
    donation => donation.donor,
  )
  donations?: Donation[];

  @OneToMany(
    () => Donation,
    donation => donation.receipt,
  )
  receipts?: Donation[];

  @OneToMany(
    () => Sell,
    sell => sell.buyer,
  )
  purchases?: Sell[];

  @OneToMany(
    () => Sell,
    sell => sell.seller,
  )
  sells?: Sell[];
}

export interface IUserUpdate {
  name?: string;
  cpf?: string;
  cnpj?: string;
  address?: string;
  email?: string;
  password?: string;
  phone?: string;
  zip?: string;
  role?: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

/*
  DPF -> Doador Pessoa Física;
  DPJ -> Doador Pessoa Jurídica;
  ONG -> Auto Explicativo;
  BUSR -> Buying User (pessoas que comprarão os produtos)
*/
