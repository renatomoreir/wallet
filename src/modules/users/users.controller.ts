import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.usersService.create(body.name, body.email, body.password);
  }

  @Get()
  async getAll(@Query() filter: FilterUserDto) {
    return this.usersService.findAll(filter);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
