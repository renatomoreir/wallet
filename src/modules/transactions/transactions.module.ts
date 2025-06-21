import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './transaction.entity';
import { Wallet } from '../wallets/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Wallet])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
