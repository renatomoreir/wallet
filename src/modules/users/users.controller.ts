import { Controller, Post, Body, Get, Param, Query, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UserRole } from './entities/user.entity';
import { Roles } from '../../shared/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.usersService.create(body.name, body.email, body.password, body.role);
  }

  @Get()
  async getAll(@Query() filter: FilterUserDto) {
    return this.usersService.findAll(filter);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id/role')
  @Roles(UserRole.admin)
  promoteUser(@Param('id') id: string) {
    const role = UserRole.admin;
    return this.usersService.updateRole(id, role);
  }
}
