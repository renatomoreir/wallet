import { Controller, Post, Body, Get, Param, Query, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserRole } from './entities/user.entity';
import { Roles } from '../../shared/roles.decorator';
import { JwtAuthGuard } from '../../shared/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/shared/roles.guard';

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

  @Get(':userId')
  async getById(@Param('userId') userId: string) {
    return this.usersService.findById(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @ApiBearerAuth('Authorization')
  @Patch(':userId/role')
  async promoteUser(
    @Param('userId') userId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.usersService.updateRole(userId, updateRoleDto.role);
  }

}
