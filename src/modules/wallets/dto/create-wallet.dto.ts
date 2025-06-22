import { IsUUID, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletDto {
  @ApiProperty({ example: 'uuid-do-usuario' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 1000, required: false })
  @IsOptional()
  @IsNumber()
  balance?: number = 0;
}
