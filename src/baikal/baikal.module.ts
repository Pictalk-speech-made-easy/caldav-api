import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaikalService } from './baikal.service';
import { User } from 'src/entities/users.entity';
import { Principal } from 'src/entities/principals.entity';
import { Calendar } from 'src/entities/calendar.entity';
import { CalendarInstance } from 'src/entities/calendarinstance.entity';
import { ConfigModule } from '@nestjs/config';
import { DavClientService } from './davclient.service';
import { BaikalController } from './baikal.controller';
import { KeycloakModule } from 'src/keycloak/keycloak.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Principal, Calendar, CalendarInstance]),
    ConfigModule,
    KeycloakModule,
  ],
  controllers: [BaikalController],
  providers: [BaikalService, DavClientService],
  exports: [BaikalService, DavClientService],
})
export class BaikalModule {}
