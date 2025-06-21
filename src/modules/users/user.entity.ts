import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from 'typeorm';
import { Wallet } from '../wallets/wallet.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => Wallet, wallet => wallet.user)
  wallet: Wallet;
}
