import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticatedUser, Public } from 'nest-keycloak-connect';
import { KeycloakService } from './keycloak/keycloak.service';
import { BaikalService } from './baikal/baikal.service';
import { ShareCalendarDto } from './share.dto';
import { CalendarInstance } from './entities/calendarinstance.entity';
import { CreateCalendarAndInstanceDto } from './create-calendar.dto';
import { BaikalUserGuard } from './baikal.guard';

@Controller('user')
export class AppController {
  constructor(
    private keycloakService: KeycloakService,
    private baikalService: BaikalService,
  ) {}

  @Post('')
  async createUserAndCalendar(@AuthenticatedUser() user: any): Promise<any> {
    if (!user) {
      throw new UnauthorizedException();
    }
    const response = await this.keycloakService.addPictimePasswordToUser(user);
    const calendarInstance = await this.baikalService.createUserAndCalendar(
      user.email,
      response.pictime_password,
    );
    await this.baikalService.shareCalendarWithUser(
      calendarInstance.calendarid,
      'principals/admin_caldav-api@pictalk.org',
      1,
    );
    return response;
  }

  @Post('/calendar')
  @UseGuards(BaikalUserGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createCalendar(
    @AuthenticatedUser() user: any,
    @Body() createCalendarAndInstanceDto: CreateCalendarAndInstanceDto,
  ): Promise<any> {
    if (!user) {
      throw new UnauthorizedException();
    }
    // Use createCalendarAndInstanceDto to populate a temporary the calendar instance
    const calendarInstance: Partial<CalendarInstance> = {
      displayname: createCalendarAndInstanceDto.calendarName,
      calendarcolor: createCalendarAndInstanceDto.calendarColor,
      timezone: createCalendarAndInstanceDto.calendarTimeZone,
    };

    const response = await this.baikalService.createCalendarAndInstance(
      'principals/' + user.email,
      calendarInstance,
    );
    return response;
  }

  @UseGuards(BaikalUserGuard)
  @Delete('/calendar/:calendarUri')
  async deleteCalendar(
    @AuthenticatedUser() user: any,
    @Param('calendarUri', ParseArrayPipe) calendarUri: string,
  ): Promise<void> {
    if (!user) {
      throw new UnauthorizedException();
    }

    //Check if calendar belongs to user
    const calendarInstance =
      await this.baikalService.getCalendarInstanceFromUri(calendarUri);
    if (calendarInstance.principaluri != 'principals/' + user.email) {
      throw new UnauthorizedException();
    }

    //Delete calendar
    await this.baikalService.deleteCalendarAndInstances(
      'principals/' + user.email,
      calendarUri,
    );
    return;
  }

  @Post('/share')
  @UsePipes(new ValidationPipe({ transform: true }))
  async shareCalendar(
    @AuthenticatedUser() user: any,
    @Body() shareCalendarDto: ShareCalendarDto,
  ): Promise<void> {
    const calendarInstance =
      await this.baikalService.getCalendarInstanceFromUri(
        shareCalendarDto.calendarUri,
      );

    // Check if the calendar belongs to the user
    if (calendarInstance.principaluri != 'principals/' + user.email) {
      throw new UnauthorizedException();
    }

    // Check if the users getting shared with exist and filter out the ones that don't
    shareCalendarDto.shareWith = shareCalendarDto.shareWith.filter(
      async (email) => this.baikalService.isUserExisting(email),
    );

    // Share the calendar with the users
    for (const email of shareCalendarDto.shareWith) {
      await this.baikalService.shareCalendarWithUser(
        calendarInstance.calendarid,
        'principals/' + email,
        shareCalendarDto.access,
      );
    }

    return;
  }
}
