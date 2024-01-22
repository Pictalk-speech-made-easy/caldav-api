import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class ShareCalendarDto {
  @IsNotEmpty()
  @IsString()
  calendarUri: string;

  @IsNotEmpty()
  @Transform((value) => {
    if (typeof value.value === 'string') {
      return [value.value];
    } else if (Array.isArray(value.value)) {
      return value.value.map((v) => String(v));
    }
    return value.value;
  })
  @IsString({ each: true })
  shareWith: string[];

  @IsNotEmpty()
  @IsNumberString()
  access: number;
}
