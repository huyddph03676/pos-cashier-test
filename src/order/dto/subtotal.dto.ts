import { IsNumber } from "class-validator";

export class SubTotalDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  qty: number;
}