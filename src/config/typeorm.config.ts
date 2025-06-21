import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/users/user.entity';
import { Wallet } from '../modules/wallets/wallet.entity';
import { Transaction } from '../modules/transactions/transaction.entity';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASS'),
  database: configService.get<string>('DB_NAME'),
  entities: [User, Wallet, Transaction],
  synchronize: true,
});
