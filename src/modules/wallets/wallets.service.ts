import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { User } from '../users/entities/user.entity';
import { FilterWalletDto } from './dto/filter-wallet.dto';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async getBalance(walletId: string) {
    const wallet = await this.walletRepository.findOne({ where: { id: walletId } });
    return { balance: wallet?.balance || 0 };
  }

  async findAll(filter: FilterWalletDto) {
    const query = this.walletRepository.createQueryBuilder('wallet')
      .leftJoinAndSelect('wallet.user', 'user');

    if (filter.userId) {
      query.andWhere('user.id = :userId', { userId: filter.userId });
    }

    if (filter.balanceMin !== undefined) {
      query.andWhere('wallet.balance >= :balanceMin', { balanceMin: filter.balanceMin });
    }

    if (filter.balanceMax !== undefined) {
      query.andWhere('wallet.balance <= :balanceMax', { balanceMax: filter.balanceMax });
    }

    return await query.getMany();
  }

  async findById(id: string) {
    const wallet = await this.walletRepository.findOne({ where: { id }, relations: ['user'] });
    if (!wallet) throw new NotFoundException('Carteira não encontrada');
    return wallet;
  }

  async create(dto: CreateWalletDto) {
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const wallet = this.walletRepository.create({
      user,
      balance: dto.balance || 0,
    });

    return await this.walletRepository.save(wallet);
  }

  async update(id: string, dto: UpdateWalletDto) {
    const wallet = await this.findById(id);

    if (dto.balance !== undefined) {
      wallet.balance = dto.balance;
    }

    return await this.walletRepository.save(wallet);
  }

  async delete(id: string) {
    const wallet = await this.findById(id);
    return await this.walletRepository.remove(wallet);
  }

}
