import { PickType } from "@nestjs/swagger";
import { FilterProductDto } from "src/product/dto/filter-product.dto";

export class FilterOrderDto extends PickType(FilterProductDto, ['limit', 'skip'] as const) {}