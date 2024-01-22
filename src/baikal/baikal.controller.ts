import {
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
  Delete,
  Param,
  ParseArrayPipe,
} from '@nestjs/common';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { CreateCalendarAndInstanceDto } from 'src/dtos/create-calendar.dto';
import { ShareCalendarDto } from 'src/dtos/share.dto';
import { CalendarInstance } from 'src/entities/calendarinstance.entity';
import { BaikalUserGuard } from 'src/guard/baikal.guard';
import { KeycloakService } from 'src/keycloak/keycloak.service';
import { UserDto } from 'src/keycloak/user.dto';
import { BaikalService } from './baikal.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class BaikalController {
  constructor(
    private keycloakService: KeycloakService,
    private baikalService: BaikalService,
  ) {}

  @Post('')
  @ApiOperation({ summary: 'Create a user and its default calendar' })
  async createUserAndCalendar(
    @AuthenticatedUser() user: UserDto,
  ): Promise<any> {
    if (!user) {
      throw new UnauthorizedException();
    }
    const isExist = await this.baikalService.isUserExisting(
      user.preferred_username,
    );
    if (isExist) {
      return;
    }
    const response = await this.keycloakService.addPictimePasswordToUser(user);
    const calendarInstance = await this.baikalService.createUserAndCalendar(
      user.preferred_username,
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
  @ApiOperation({ summary: 'Create a secondary calendar' })
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
  @ApiOperation({ summary: 'Delete a calendar' })
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
  @ApiOperation({ summary: 'Share a calendar' })
  @UseGuards(BaikalUserGuard)
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
