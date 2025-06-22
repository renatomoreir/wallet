import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.wallet, { cascade: true })
  @JoinColumn()
  user: User;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  balance: number;

  @CreateDateColumn()
  created_at: Date;
}
