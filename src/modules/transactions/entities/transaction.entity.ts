import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Wallet } from '../../wallets/entities/wallet.entity';

export enum TransactionStatus {
  pending = 'pending',
  completed = 'completed',
  reversed = 'reversed'
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid') transactionId: string;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'senderWalletId' })
  senderWallet: Wallet;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'receiverWalletId' })
  receiverWallet: Wallet;

  @Column({ type: 'decimal' }) amount: number;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.pending })
  status: TransactionStatus;

  @CreateDateColumn()
  createdAt: Date;
}
