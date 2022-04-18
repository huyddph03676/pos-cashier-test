import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PAYMENT_TYPE } from "../enum/payment.enum";

export class CreatePaymentDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    type: PAYMENT_TYPE;

    @ApiProperty()
    @IsString()
    @IsOptional()
    logo?: string;
}
