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
      await queryRunner.query(
        `INSERT INTO users (username, digesta1) VALUES (?, ?)`,
        [username, digesta1],
      );
      await queryRunner.query(
        `INSERT INTO calendars (synctoken, components) VALUES ( 1, 'VEVENT')`,
        [],
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
