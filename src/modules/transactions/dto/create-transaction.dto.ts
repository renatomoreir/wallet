import { IsUUID, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'ID da carteira remetente',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID('4', { message: 'ID da carteira remetente inválido' })
  senderWalletId: string;

  @ApiProperty({
    description: 'ID da carteira destinatária',
    example: '123e4567-e89b-12d3-a456-426614174001',
    type: String,
  })
  @IsUUID('4', { message: 'ID da carteira destinatária inválido' })
  receiverWalletId: string;

  @ApiProperty({
    description: 'Valor da transação',
    example: 100.50,
    type: Number,
  })
  @IsPositive({ message: 'O valor deve ser maior que zero' })
  amount: number;
}
