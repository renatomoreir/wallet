import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Wallet } from '../../wallets/entities/wallet.entity';

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REVERSED = 'REVERSED'
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid') transactionId: string;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'senderWalletId' })
  senderWalletId: Wallet;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'receiverWalletId' })
  receiverWalletId: Wallet;

  @Column({ type: 'decimal' }) amount: number;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @CreateDateColumn()
  createdAt: Date;
}
