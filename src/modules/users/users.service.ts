import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Wallet } from '../wallets/entities/wallet.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
  ) { }

  async create(name: string, email: string, password: string, role: UserRole = UserRole.user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email já está em uso');
    }
    const user = this.userRepository.create({ name, email, password: hashedPassword, role, created_at: new Date() });
    await this.userRepository.save(user);

    const wallet = this.walletRepository.create({ user, balance: 0 });
    await this.walletRepository.save(wallet);

    return { ...user, wallet };
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email }, relations: ['wallet'] });
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['wallet'] });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(filter: { name?: string; email?: string }) {
    const query = this.userRepository.createQueryBuilder('user');

    if (filter.name) {
      query.andWhere('user.name ILIKE :name', { name: `%${filter.name}%` });
    }

    if (filter.email) {
      query.andWhere('user.email ILIKE :email', { email: `%${filter.email}%` });
    }

    return query.getMany();
  }

   async updateRole(id: string, role: UserRole) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    user.role = role;
    return await this.userRepository.save(user);
  }

}
