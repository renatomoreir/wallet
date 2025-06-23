import { IsUUID, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletDto {
  @ApiProperty({ description: 'ID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
   })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 1000, required: false })
  @IsOptional()
  @IsNumber()
  balance?: number = 0;
}
