import { IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWalletDto {
  @ApiPropertyOptional({ example: 1500.00 })
  @IsOptional()
  @IsNumber()
  balance?: number;
}
