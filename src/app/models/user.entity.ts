import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import bc from 'bcryptjs';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lastName?: string;

  @Column({ type: 'char', length: 11, nullable: true })
  cpf?: string;

  @Column({ type: 'char', length: 14, nullable: true })
  cnpj?: string;

  @Column({ type: 'varchar', length: 40 })
  address: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @BeforeInsert()
  hashPassword() {
    this.password = bc.hashSync(this.password, 12);
  }
  @Column()
  password: string;

  @Column({ type: 'varchar', length: 12 })
  phone: string;

  @Column({ type: 'char', length: 8 })
  zip: string;

  @Column({ type: 'varchar', length: 4, enum: ['DPF', 'DPJ', 'ONG', 'BUSR'] })
  role: string;
}

export interface IUserUpdate {
  name?: string;
  lastName?: string;
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
