import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { AuthenticatedUser, Public } from 'nest-keycloak-connect';
import { GetRangeDto } from './get.range.dto';
import { DavClientService } from 'src/dav-client/davclient.service';

@Controller('events')
@Public(false)
export class EventController {
  constructor() {}

  @Get()
  async getRange(
    @AuthenticatedUser() user: any,
    @Query(new ValidationPipe({ transform: true }))
    rangeDto: GetRangeDto,
  ): Promise<Event[]> {
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
