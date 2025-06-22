import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from 'typeorm';
import { Wallet } from '../../wallets/entities/wallet.entity';

export enum UserRole {
  user = 'user',
  admin = 'admin',
}

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

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.user,
  })
  role: UserRole;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => Wallet, wallet => wallet.user)
  wallet: Wallet;
}
