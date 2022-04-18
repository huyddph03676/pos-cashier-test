import { PickType } from "@nestjs/swagger";
import { CreateProductDto } from "src/product/dto/create-product.dto";

export class CreateCategoryDto extends PickType(CreateProductDto, ['name'] as const) {}