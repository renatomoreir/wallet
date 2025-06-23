import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterWalletDto {
  @ApiPropertyOptional({ description: 'Filtrar pelo ID do usuário' })
  userId?: string;

  @ApiPropertyOptional({ description: 'Filtrar carteiras com saldo maior que', example: 0 })
  balanceMin?: number;

  @ApiPropertyOptional({ description: 'Filtrar carteiras com saldo menor que', example: 1000 })
  balanceMax?: number;
}
