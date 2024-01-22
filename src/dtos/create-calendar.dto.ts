import {
  IsHexColor,
  IsNotEmpty,
  IsString,
  IsTimeZone,
  Length,
} from 'class-validator';

export class CreateCalendarAndInstanceDto {
  @IsString()
  @Length(2, 16)
  @IsNotEmpty()
  calendarName: string;

  @IsString()
  @IsHexColor()
  @IsNotEmpty()
  calendarColor: string;

  @IsTimeZone()
  @IsNotEmpty()
  calendarTimeZone: string;
}
