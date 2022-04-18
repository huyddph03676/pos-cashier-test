import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, Length } from 'class-validator';

export class LoginCashierDto {
  @ApiProperty()
  @IsNumberString()
  @Length(6, 6)
  passcode: string;
}
