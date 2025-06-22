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

  @Get(':id/balance')
  getBalance(@Param('id') walletId: string) {
    return this.walletsService.getBalance(walletId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.walletsService.findById(id);
  }
  
  @Get()
  findAll(@Query() filter: FilterWalletDto) {
    return this.walletsService.findAll(filter);
  }

  @Post()
  create(@Body() dto: CreateWalletDto) {
    return this.walletsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWalletDto) {
    return this.walletsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  delete(@Param('id') id: string) {
    return this.walletsService.delete(id);
  }
}
