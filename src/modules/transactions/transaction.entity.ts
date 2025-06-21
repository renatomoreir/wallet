import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Wallet } from '../wallets/wallet.entity';

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REVERSED = 'REVERSED'
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Wallet) sender_wallet: Wallet;

  @ManyToOne(() => Wallet) receiver_wallet: Wallet;

  @Column({ type: 'decimal' }) amount: number;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @CreateDateColumn()
  created_at: Date;
}
