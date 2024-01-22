import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { BaikalModule } from 'src/baikal/baikal.module';

@Module({
  imports: [BaikalModule],
  controllers: [EventController],
  providers: [],
  exports: [],
})
export class EventModule {}
