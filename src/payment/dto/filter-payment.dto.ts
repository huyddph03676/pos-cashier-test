import { Optional } from "@nestjs/common";
import { PickType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumberString } from "class-validator";
import { FilterProductDto } from "src/product/dto/filter-product.dto";

export class FilterPaymentDto extends PickType(FilterProductDto, ['limit', 'skip'] as const) {
    @Optional()
    @IsNumberString()
    @Type(() => Number)
    subtotal: number;
}