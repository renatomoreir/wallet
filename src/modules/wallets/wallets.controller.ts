import { Controller, Get, Query, Param, Post, Delete, Body, Put } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { FilterWalletDto } from './dto/filter-wallet.dto';
import { UserRole } from '../users/entities/user.entity';
import { Roles } from 'src/shared/roles.decorator';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) { }

  @Get(':walletId/balance')
  getBalance(@Param('walletId') walletId: string) {
    return this.walletsService.getBalance(walletId);
  }

  @Get(':walletId')
  findById(@Param('walletId') walletId: string) {
    return this.walletsService.findById(walletId);
  }
  
  @Get()
  findAll(@Query() filter: FilterWalletDto) {
    return this.walletsService.findAll(filter);
  }

  @Post()
  create(@Body() dto: CreateWalletDto) {
    return this.walletsService.create(dto);
  }

  @Put(':walletId')
  update(@Param('walletId') walletId: string, @Body() dto: UpdateWalletDto) {
    return this.walletsService.update(walletId, dto);
  }

  @Delete(':walletId')
  @Roles(UserRole.admin)
  delete(@Param('walletId') walletId: string) {
    return this.walletsService.delete(walletId);
  }
}
