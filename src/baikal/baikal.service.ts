import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Calendar } from 'src/entities/calendar.entity';
import { CalendarInstance } from 'src/entities/calendarinstance.entity';
import { Principal } from 'src/entities/principals.entity';
import { User } from 'src/entities/users.entity';
import { QueryRunner, Repository } from 'typeorm';
import * as md5 from 'md5';
import { DataSource } from 'typeorm';

@Injectable()
export class BaikalService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Principal)
    private principalRepository: Repository<Principal>,
    @InjectRepository(Calendar)
    private calendarRepository: Repository<Calendar>,
    @InjectRepository(CalendarInstance)
    private calendarInstanceRepository: Repository<CalendarInstance>,
    private dataSource: DataSource,
  ) {}

  async createUser(username: string, password: string, queryRunner?: QueryRunner): Promise<User> {
    const digesta1 = md5(`${username}:BaikalDAV:${password}`);
    const user = this.userRepository.create({
      username,
      digesta1,
    });
    if (queryRunner) {
      return queryRunner.manager.save(user);
  } else {
      return this.userRepository.save(user);
  }
  }

  async createPrincipal(username: string, queryRunner?: QueryRunner): Promise<Principal> {
    const principal = this.principalRepository.create({
      uri: `principals/${username}`,
      email: username,
      displayname: username,
    });
    if (queryRunner) {
      return queryRunner.manager.save(principal);
    } else {
      return this.principalRepository.save(principal);
    }
  }

  async createCalendar(queryRunner?: QueryRunner): Promise<Calendar> {
    const calendar = this.calendarRepository.create({
      synctoken: 1,
      components: 'VEVENT,VTODO,VJOURNAL',
    });
    if (queryRunner) {
      return queryRunner.manager.save(calendar);
    } else {
      return this.calendarRepository.save(calendar);
    }
  }

  async createCalendarInstance(
    principalUri: string,
    calendar: Calendar,
    calendarOptions?: Partial<CalendarInstance>,
    queryRunner?: QueryRunner
  ): Promise<CalendarInstance> {
    const calendarInstance = this.calendarInstanceRepository.create({
      principaluri: principalUri,
      displayname: calendarOptions?.displayname || 'Default',
      uri: this.sanitizeUri(calendarOptions?.displayname) || 'default',
      access: 1,
      description: calendarOptions?.displayname || 'Default Calendar',
      transparent: false,
      calendarcolor: calendarOptions?.calendarcolor || '#FFFFFF',
      timezone: calendarOptions?.timezone || 'Europe/Paris',
      calendarid: calendar.id, // Use the ID from the newly created calendar entity
    });
    if (queryRunner) {
      return queryRunner.manager.save(calendarInstance);
    } else {
      return this.calendarInstanceRepository.save(calendarInstance);
    }
  }

  async createUserAndCalendar(
    username: string,
    password: string,
  ): Promise<CalendarInstance> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.createUser(username, password, queryRunner);
      const principal = await this.createPrincipal(username, queryRunner);
      const calendar = await this.createCalendar(queryRunner);
      const calendarInstance = await this.createCalendarInstance(
        principal.uri,
        calendar,
        undefined,
        queryRunner
      );

      // Here you would add the logic to share the calendar with the admin user
      // This would depend on Baikal's specific implementation of sharing calendars
      // and whether it can be done directly via the database or requires API interaction
      // Since direct database manipulation for sharing is not typically supported,
      // the sharing logic is not included here

      await queryRunner.commitTransaction();
      return calendarInstance;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err.code === 'ER_DUP_ENTRY') {
        console.log('User already exists');
      } else {
        throw err;
      }
    } finally {
      await queryRunner.release();
    }
  }

  async shareCalendarWithUser(
    calendarId: number,
    userPrincipalUri: string,
    access: number,
  ): Promise<CalendarInstance> {
    const sharedCalendar = await this.calendarInstanceRepository.findOneOrFail({
      where: {
        calendarid: calendarId,
      },
    });

    const adminCalendarInstance = this.calendarInstanceRepository.create({
      principaluri: userPrincipalUri,
      displayname: `Shared ${sharedCalendar.displayname} from ${sharedCalendar.principaluri}`,
      uri: `shared-calendar-${calendarId}`, // Ensure this URI is unique per user
      calendarid: calendarId,
      access: access, // Access level would need to be set according to Baikal's specific encoding of ACLs
      description: `${sharedCalendar.principaluri}-${sharedCalendar.uri}`,
      transparent: false,
      calendarcolor: '#FFFFFF',
      timezone: 'Europe/Paris',
    });

    return this.calendarInstanceRepository.save(adminCalendarInstance);
  }

  async getCalendarInstanceFromUri(
    calendarUri: string,
  ): Promise<CalendarInstance> {
    return this.calendarInstanceRepository.findOneOrFail({
      where: {
        uri: calendarUri,
      },
    });
  }

  async createCalendarAndInstance(
    principalUri: string,
    calendarInstanceOptions?: Partial<CalendarInstance>,
  ): Promise<CalendarInstance> {
    const calendar = await this.createCalendar();

    const calendarInstance: CalendarInstance =
      await this.createCalendarInstance(
        principalUri,
        calendar,
        calendarInstanceOptions,
      );
    this.shareCalendarWithUser(
      calendar.id,
      'principals/admin_caldav-api@pictalk.org',
      1,
    );
    return calendarInstance;
  }

  async isUserExisting(username: string): Promise<boolean> {
    console.log('Checking if user exists', username);
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
    console.log(user);
    return user != null;
  }

  async deleteCalendarAndInstances(
    principalUri: string,
    calendarUri: string,
  ): Promise<void> {
    const calendarInstance =
      await this.calendarInstanceRepository.findOneOrFail({
        where: {
          principaluri: principalUri,
          uri: calendarUri,
        },
      });
    await this.calendarInstanceRepository.delete({
      calendarid: calendarInstance.calendarid,
    });
    await this.calendarRepository.delete(calendarInstance.calendarid);
    return;
  }

  sanitizeUri(uri: string): string {
    if (!uri) {
      return undefined;
    }
    return uri.replace(/\W/g, '').toLowerCase().trim();
  }
}
