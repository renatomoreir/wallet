import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { Wallet } from '../wallets/entities/wallet.entity';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) { }

  async createTransaction(senderWalletId: string, receiverWalletId: string, amount: number) {
    if (senderWalletId === receiverWalletId) {
      throw new BadRequestException('Não é possível transferir para si mesmo');
    }

    return await this.dataSource.transaction(async manager => {
      const senderWallet = await manager.findOne(Wallet, { where: { id: senderWalletId } });
      const receiverWallet = await manager.findOne(Wallet, { where: { id: receiverWalletId } });

      if (!senderWallet || !receiverWallet) {
        throw new NotFoundException('Carteira não encontrada');
      }

      if (Number(senderWallet.balance) < amount) {
        throw new BadRequestException('Saldo insuficiente');
      }

      senderWallet.balance = Number(senderWallet.balance) - amount;
      receiverWallet.balance = Number(receiverWallet.balance) + amount;

      await manager.save([senderWallet, receiverWallet]);

      const transaction = manager.create(Transaction, {
        sender_wallet: senderWallet,
        receiver_wallet: receiverWallet,
        amount,
        status: TransactionStatus.COMPLETED,
      });

      await manager.save(transaction);

      return transaction;
    });
  }

  async reverseTransaction(transactionId: string) {
    return await this.dataSource.transaction(async manager => {
      const transaction = await manager.findOne(Transaction, {
        where: { id: transactionId },
        relations: ['sender_wallet', 'receiver_wallet'],
      });

      if (!transaction) {
        throw new NotFoundException('Transação não encontrada');
      }

      if (transaction.status === TransactionStatus.REVERSED) {
        throw new BadRequestException('Transação já foi revertida');
      }

      const senderWallet = await manager.findOne(Wallet, { where: { id: transaction.sender_wallet.id } });
      const receiverWallet = await manager.findOne(Wallet, { where: { id: transaction.receiver_wallet.id } });

      if (!senderWallet || !receiverWallet) {
        throw new NotFoundException('Carteira não encontrada');
      }

      // Realiza a reversão
      senderWallet.balance = Number(senderWallet.balance) + Number(transaction.amount);
      receiverWallet.balance = Number(receiverWallet.balance) - Number(transaction.amount);

      await manager.save([senderWallet, receiverWallet]);

      transaction.status = TransactionStatus.REVERSED;
      await manager.save(transaction);

      return transaction;
    });
  }

  async findAll(filters: { senderWalletId?: string; receiverWalletId?: string; status?: string }) {
    const query = this.transactionRepository.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.sender_wallet', 'sender_wallet')
      .leftJoinAndSelect('transaction.receiver_wallet', 'receiver_wallet');

    if (filters.senderWalletId) {
      query.andWhere('transaction.senderWalletId = :senderWalletId', { senderWalletId: filters.senderWalletId });
    }

    if (filters.receiverWalletId) {
      query.andWhere('transaction.receiverWalletId = :receiverWalletId', { receiverWalletId: filters.receiverWalletId });
    }

    if (filters.status) {
      query.andWhere('transaction.status = :status', { status: filters.status });
    }

    return query.getMany();
  }

}
