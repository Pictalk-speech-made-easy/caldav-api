import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ShareCalendarDto {
  @IsNotEmpty()
  @IsString()
  calendarUri: string;

  @IsNotEmpty()
  @IsString({ each: true })
  shareWith: string[];

  @IsNotEmpty()
  @IsBoolean()
  access: number;
}
