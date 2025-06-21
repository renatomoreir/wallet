import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterUserDto {
  @ApiPropertyOptional({ description: 'Filtrar por nome' })
  name?: string;

  @ApiPropertyOptional({ description: 'Filtrar por email' })
  email?: string;
}
