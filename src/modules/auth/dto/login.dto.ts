import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@teste.com.br',
    type: String,
  })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
    type: String,
  })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  password: string;
}
