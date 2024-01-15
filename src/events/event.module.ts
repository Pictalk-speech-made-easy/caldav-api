import { Module } from '@nestjs/common';
import { DavClientModule } from 'src/dav-client/davclient.module';
import { EventController } from './event.controller';
import { BaikalModule } from 'src/baikal/baikal.module';

@Module({
  imports: [DavClientModule, BaikalModule],
  controllers: [EventController],
  providers: [],
  exports: [],
})
export class EventModule {}
