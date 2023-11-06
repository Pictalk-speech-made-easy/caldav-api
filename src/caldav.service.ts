import { Injectable } from '@nestjs/common';
import * as md5 from 'md5';
import { DataSource } from 'typeorm';

@Injectable()
export class CalDavService {
  constructor(private dataSource: DataSource) {}
  async createUserAndCalendar(
    username: string,
    password: string,
  ): Promise<void> {
    const digesta1 = md5(`${username}:BaikalDAV:${password}`);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create the DAV user
      await queryRunner.query(
        `INSERT INTO users (username, digesta1) VALUES (?, ?)`,
        [username, digesta1],
      );
      // Create the DAV principal
      await queryRunner.query(
        `INSERT INTO principals (uri, email, displayname) VALUES (?, ?, ?)`,
        [`principals/${username}`, username, username],
      );

      // Create the calendar
      await queryRunner.query(
        `INSERT INTO calendars (synctoken, components) VALUES ( 1, 'VEVENT,VTODO,VJOURNAL')`,
        [],
      );

      // Create the calendar instance
      await queryRunner.query(
        `INSERT INTO calendarinstances (principaluri, displayname, uri, calendarid, access, description, transparent, ` +
          `calendarcolor, timezone) VALUE ('principals/${username}','Default','Default',(SELECT LAST_INSERT_ID()),1,'Default',0,'#FFFFFF','Europe/Paris')`,
        [],
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      console.log(err);
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
