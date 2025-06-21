import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post('transfer')
  transfer(@Body() body: CreateTransactionDto) {
    return this.transactionsService.createTransaction(body.senderWalletId, body.receiverWalletId, body.amount);
  }

  @Post(':id/reverse')
  reverse(@Param('id') id: string) {
    return this.transactionsService.reverseTransaction(id);
  }

  @Get()
  getAll(
    @Query('senderWalletId') senderWalletId?: string,
    @Query('receiverWalletId') receiverWalletId?: string,
    @Query('status') status?: string
  ) {
    return this.transactionsService.findAll({ senderWalletId, receiverWalletId, status });
  }
}
