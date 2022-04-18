import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FilterCashierDto {
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @Type(() => Number)
  @IsNumber()
  skip?: number;
}
