import { Type } from "class-transformer";
import { IsNumberString, IsOptional } from "class-validator";

export function processResponse(status: boolean, data = null) {
  const response = {
    success: status,
    message: status ? 'Success' : 'Fail',
    ...(data && { data }),
  };
  return response;
};

export class FilterCommonDto {
  @IsNumberString()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsNumberString()
  @IsOptional()
  @Type(() => Number)
  skip?: number;
}
