import { Controller, Get, Query, Param } from '@nestjs/common';
import { WalletsService } from './wallets.service';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) { }

  @Get(':id/balance')
  getBalance(@Param('id') walletId: string) {
    return this.walletsService.getBalance(walletId);
  }

  @Get()
  getAll(@Query('balanceGt') balanceGt?: number) {
    return this.walletsService.findAll({ balanceGt });
  }
}
