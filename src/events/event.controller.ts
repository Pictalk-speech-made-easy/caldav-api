import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticatedUser, Public } from 'nest-keycloak-connect';
import { GetRangeDto } from './get.range.dto';
import { DavClientService } from 'src/dav-client/davclient.service';
import { BaikalUserGuard } from 'src/baikal.guard';
import { DAVCalendar } from 'tsdav';

@Controller('events')
export class EventController {
  constructor(private davclientService: DavClientService) {}

  @Get()
  @UseGuards(BaikalUserGuard)
  async getRange(
    @AuthenticatedUser() user: any,
    @Query(new ValidationPipe({ transform: true }))
    rangeDto: GetRangeDto,
  ): Promise<Event[]> {
    const calendars: DAVCalendar[] = await (
      await this.davclientService.getClient()
    ).fetchCalendars();
    console.log(calendars);
    const calendar = calendars.find(
      (calendar) => calendar.url === rangeDto.calendarUri,
    )[0];
    (await this.davclientService.getClient()).fetchCalendarObjects({
      calendar: calendar,
      timeRange: {
        start: rangeDto.startDate.toISOString(),
        end: rangeDto.endDate.toISOString(),
      },
      expand: true,
    });
    return [];
  }

  @Get('recurrent')
  getRecurrent(@AuthenticatedUser() user: any): Event[] {
    // TODO: Implement logic to fetch all events
    return [];
  }

  @Get('full-day')
  getFullDay(@AuthenticatedUser() user: any): Event[] {
    // TODO: Implement logic to fetch all events
    return [];
  }
}
