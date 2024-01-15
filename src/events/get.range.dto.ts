import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class GetRangeDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  calendarUri: string;
}
