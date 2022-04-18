import { Type } from "class-transformer";
import { IsNumberString, IsOptional } from "class-validator";

export class FilterProductDto {
  @IsNumberString()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsNumberString()
  @IsOptional()
  @Type(() => Number)
  skip?: number;

  @IsNumberString()
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @IsOptional()
  q?: string;
}