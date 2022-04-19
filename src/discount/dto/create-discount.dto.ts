import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { DISCOUNT_TYPE } from 'src/shared/constants';

export class CreateDiscountDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  'qty': number;

  @ApiProperty()
  'type': DISCOUNT_TYPE;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  'result': number;

  @ApiProperty()
  @Type(() => Number)
  'expiredAt': number;
}
