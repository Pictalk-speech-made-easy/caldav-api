import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaikalService } from './baikal.service';
import { User } from 'src/entities/users.entity';
import { Principal } from 'src/entities/principals.entity';
import { Calendar } from 'src/entities/calendar.entity';
import { CalendarInstance } from 'src/entities/calendarinstance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Principal, Calendar, CalendarInstance]),
  ],
  providers: [BaikalService],
  exports: [BaikalService],
})
export class BaikalModule {}
