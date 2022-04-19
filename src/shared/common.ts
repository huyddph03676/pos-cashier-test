import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export function processResponse(status: boolean, data = null) {
  const response = {
    success: status,
    message: status ? 'Success' : 'Fail',
    ...(data && { data }),
  };
  return response;
};

export class FilterCommonDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  skip?: number;
}
