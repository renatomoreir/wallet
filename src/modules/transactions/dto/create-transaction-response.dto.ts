import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionResponseDto {
    @ApiProperty({
        description: 'ID da transação',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'ID da transação inválido' })
    transactionId: string;
}