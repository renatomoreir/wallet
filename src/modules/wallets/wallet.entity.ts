import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.wallet)
  @JoinColumn()
  user: User;

  @Column({ type: 'decimal', default: 0 })
  balance: number;

  @CreateDateColumn()
  created_at: Date;
}
