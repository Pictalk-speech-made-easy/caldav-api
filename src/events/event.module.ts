import { Module } from '@nestjs/common';
import { DavClientModule } from 'src/dav-client/davclient.module';
import { EventController } from './event.controller';

@Module({
  imports: [DavClientModule],
  controllers: [EventController],
  providers: [],
  exports: [],
})
export class EventModule {}
