import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString, Length } from "class-validator";

export class CreateCashierDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNumberString()
    @Length(6,6)
    passcode: string;
}
