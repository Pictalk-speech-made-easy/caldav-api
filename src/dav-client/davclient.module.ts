import { Module } from '@nestjs/common';
import { DavClientService } from './davclient.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [DavClientService],
  exports: [DavClientService],
})
export class DavClientModule {}
