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
  ) { }

  async createTransaction(senderWalletId: string, receiverWalletId: string, amount: number) {
    if (senderWalletId === receiverWalletId) {
      throw new BadRequestException('Não é possível transferir para si mesmo');
    }

    return await this.dataSource.transaction(async manager => {
      const senderWallet = await manager.findOne(Wallet, {
        where: { walletId: senderWalletId },
      });

      const receiverWallet = await manager.findOne(Wallet, {
        where: { walletId: receiverWalletId },
      });

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
        senderWallet: senderWallet,
        receiverWallet: receiverWallet,
        amount,
        status: TransactionStatus.completed,
      });

      await manager.save(transaction);

      return transaction;
    });
  }

  async reverseTransaction(transactionId: string) {
    return await this.dataSource.transaction(async manager => {
      const transaction = await manager.findOne(Transaction, { where: { transactionId: transactionId }, relations: ['senderWallet', 'receiverWallet'], });

      if (!transaction) {
        throw new NotFoundException('Transação não encontrada');
      }

      if (transaction.status === TransactionStatus.reversed) {
        throw new BadRequestException('Transação já foi revertida');
      }

      if (transaction.status !== TransactionStatus.completed) {
        throw new BadRequestException('Transação não pode ser revertida');
      }

      if (transaction.senderWallet == null || transaction.receiverWallet == null) {
        throw new BadRequestException('Transação inválida: carteiras não associadas');
      }

      if (transaction.amount <= 0) {
        throw new BadRequestException('Valor da transação inválido para reversão');
      }
      const senderWallet = await manager.findOne(Wallet, { where: { walletId: transaction.senderWallet.walletId } });
      const receiverWallet = await manager.findOne(Wallet, { where: { walletId: transaction.receiverWallet.walletId } });

      if (!senderWallet || !receiverWallet) {
        throw new NotFoundException('Carteira não encontrada');
      }

      senderWallet.balance = Number(senderWallet.balance) + Number(transaction.amount);
      receiverWallet.balance = Number(receiverWallet.balance) - Number(transaction.amount);

      await manager.save([senderWallet, receiverWallet]);

      transaction.status = TransactionStatus.reversed;
      await manager.save(transaction);

      return transaction;
    });
  }

  async findAll(filter: { senderWalletId?: string; receiverWalletId?: string; status?: TransactionStatus, amount?: number }) {
    const query = this.transactionRepository.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.senderWallet', 'senderWallet')
      .leftJoinAndSelect('transaction.receiverWallet', 'receiverWallet');

    if (filter.senderWalletId) {
      query.andWhere('transaction.senderWalletId = :senderWalletId', { senderWalletId: filter.senderWalletId });
    }

    if (filter.receiverWalletId) {
      query.andWhere('transaction.receiverWalletId = :receiverWalletId', { receiverWalletId: filter.receiverWalletId });
    }

    if (filter.status) {
      query.andWhere('transaction.status = :status', { status: filter.status });
    }

    if (filter.amount) {
      query.andWhere('transaction.amount = :amount', { amount: filter.amount });
    }

    return query.getMany();
  }

}
