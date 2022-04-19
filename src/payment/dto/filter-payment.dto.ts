import { Optional } from "@nestjs/common";
import { PickType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumberString } from "class-validator";
import { FilterCommonDto } from "src/shared/common";

export class FilterPaymentDto extends PickType(FilterCommonDto, ['limit', 'skip'] as const) {
    @Optional()
    @IsNumberString()
    @Type(() => Number)
    subtotal: number;
}