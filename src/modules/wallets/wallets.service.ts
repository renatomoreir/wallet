import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) { }

  async getBalance(walletId: string) {
    const wallet = await this.walletRepository.findOne({ where: { id: walletId } });
    return { balance: wallet?.balance || 0 };
  }

  async findAll(filters: { balanceGt?: number }) {
    const query = this.walletRepository.createQueryBuilder('wallet')
      .leftJoinAndSelect('wallet.user', 'user');

    if (filters.balanceGt !== undefined) {
      query.andWhere('wallet.balance > :balanceGt', { balanceGt: filters.balanceGt });
    }

    return query.getMany();
  }

}
