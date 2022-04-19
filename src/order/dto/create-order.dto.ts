import { IsArray, IsNumber } from 'class-validator';
import { SubTotalDto } from './subtotal.dto';

export class CreateOrderDto {
  @IsNumber()
  paymentId: number;

  @IsNumber()
  totalPaid: number;

  @IsArray()
  products: SubTotalDto[];
}
