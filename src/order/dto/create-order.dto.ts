import { IsArray, IsNumber } from "class-validator";
import { SubOrder } from "../entities/sub-order.entity";

export class CreateOrderDto {
    @IsNumber()
    paymentId: number;

    @IsNumber()
    totalPaid: number;

    @IsArray()
    products: SubOrder[];
}
