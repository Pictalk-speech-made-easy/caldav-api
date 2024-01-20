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
import { DAVCalendar, DAVClient } from 'tsdav';
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
  ): Promise<Event[]> {
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
    davClient.fetchCalendarObjects({
      calendar: filteredCalendars,
      timeRange: {
        start: rangeDto.startDate.toISOString(),
        end: rangeDto.endDate.toISOString(),
      },
      expand: true,
    });
    return [];
  }

  @Get('recurrent')
  async getRecurrent(
    @AuthenticatedUser() user: any,
    @Query(new ValidationPipe({ transform: true }))
    rangeDto: GetRangeDto,
  ): Promise<Event[]> {
    console.log('Getting recurrent events');
    console.log(rangeDto);
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
      expand: true,
    });
    console.log(events);

    return [];
  }

  @Get('full-day')
  getFullDay(@AuthenticatedUser() user: any): Event[] {
    // TODO: Implement logic to fetch all events
    return [];
  }
}
