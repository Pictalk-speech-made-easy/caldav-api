import { DavClientService } from 'src/baikal/davclient.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService {
  constructor(private davclientService: DavClientService) {}

  async getEventsFromRange(): Promise<Event[]> {
    const client = await this.davclientService.getClient();
    console.log(client);
    // Add any additional methods here
    return [];
  }
}
