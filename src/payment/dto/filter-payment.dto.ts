import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { FilterCommonDto } from 'src/shared/common';

export class FilterPaymentDto extends PickType(FilterCommonDto, ['limit', 'skip'] as const) {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  subtotal?: number;
}
