import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticatedUser, Public } from 'nest-keycloak-connect';
import { GetRangeDto } from './get.range.dto';
import { DavClientService } from 'src/baikal/davclient.service';
import { BaikalUserGuard } from 'src/guard/baikal.guard';
import { DAVCalendar, DAVClient, DAVObject } from 'tsdav';
import { UserDto } from 'src/keycloak/user.dto';

@Controller('events')
export class EventController {
  constructor(private davclientService: DavClientService) {}

  @Get()
  @UseGuards(BaikalUserGuard)
  async getRange(
    @AuthenticatedUser() user: UserDto,
    @Query(new ValidationPipe({ transform: true }))
    rangeDto: GetRangeDto,
  ): Promise<DAVObject[]> {
    const davClient: DAVClient = await this.davclientService.getClient();
    const calendars: DAVCalendar[] = await davClient.fetchCalendars();
    console.log(calendars);
    const filteredCalendars = calendars.find(
      (calendar) =>
        calendar.description ===
        'principals/' + user.preferred_username + '-' + rangeDto.calendarUri,
    );
    if (!filteredCalendars) {
      return [];
    }
    const events = await davClient.fetchCalendarObjects({
      calendar: filteredCalendars,
      timeRange: {
        start: rangeDto.startDate.toISOString(),
        end: rangeDto.endDate.toISOString(),
      },
      expand: false,
    });
    return events;
  }

  @Get('recurrent')
  @UseGuards(BaikalUserGuard)
  async getRecurrent(
    @AuthenticatedUser() user: any,
    @Query(new ValidationPipe({ transform: true }))
    rangeDto: GetRangeDto,
  ): Promise<DAVObject[]> {
    console.log('Getting recurrent events');
    console.log(rangeDto);
    const davClient: DAVClient = await this.davclientService.getClient();
    const calendars: DAVCalendar[] = await davClient.fetchCalendars();
    const filteredCalendars = calendars.find(
      (calendar) =>
        calendar.description ===
        'principals/' + user.preferred_username + '-' + rangeDto.calendarUri,
    );
    if (!filteredCalendars) {
      return [];
    }
    let events = await davClient.fetchCalendarObjects({
      calendar: filteredCalendars,
      timeRange: {
        start: rangeDto.startDate.toISOString(),
        end: rangeDto.endDate.toISOString(),
      },
      expand: false,
    });

    events = events.filter((event) => {
      console.log(event.data);
      console.log(event.data.includes('RRULE'));
      return event.data.includes('RRULE');
    });
    return events;
  }

  @Get('full-day')
  @UseGuards(BaikalUserGuard)
  getFullDay(@AuthenticatedUser() user: any): Event[] {
    // TODO: Implement logic to fetch all events
    return [];
  }
}
