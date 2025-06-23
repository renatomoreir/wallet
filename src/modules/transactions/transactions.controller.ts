import { Controller, Post, Body, Param, Get, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UserRole } from '../users/entities/user.entity';
import { Roles } from '../../shared/roles.decorator';
import { JwtAuthGuard } from '../../shared/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/shared/roles.guard';
import { FilterTransactionDto } from './dto/filter-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post('transfer')
  async transfer(@Body() body: CreateTransactionDto) {
    return this.transactionsService.createTransaction(body.senderWalletId, body.receiverWalletId, body.amount);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @ApiBearerAuth('Authorization')
  @Post(':transactionId/reverse')
  async reverse(@Param('transactionId') transactionId: string) {
    return this.transactionsService.reverseTransaction(transactionId);
  }

  @Get()
  async getAll(@Query() filter: FilterTransactionDto) {
    return this.transactionsService.findAll(filter);
  }
}
