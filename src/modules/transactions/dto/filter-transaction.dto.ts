import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionStatus } from '../entities/transaction.entity';

export class FilterTransactionDto {
    @ApiPropertyOptional({ description: 'Filtrar por ID da carteira remetente' })
    senderWalletId?: string;

    @ApiPropertyOptional({ description: 'Filtrar por ID da carteira destinatária' })
    receiverWalletId?: string;

    @ApiPropertyOptional({ 
        description: 'Filtrar por status', 
        enum: TransactionStatus, 
        example: [TransactionStatus.pending, TransactionStatus.completed, TransactionStatus.reversed] 
    })
    status?: TransactionStatus;

    @ApiPropertyOptional({ description: 'Filtrar por valor da transação' })
    amount?: number;


}