import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'nome do usuário',
    example: 'João da Silva',
  })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'email do usuário',
    example: 'joao@teste.com.br',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha precisa ter no mínimo 6 caracteres' })
  @ApiProperty({
    description: 'senha do usuário',
    example: 'senha123',
  })
  password: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.user })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.user;
}
