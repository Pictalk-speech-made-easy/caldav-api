import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DAVClient } from 'tsdav';

@Injectable()
export class DavClientService {
  private client: DAVClient;

  constructor(private configService: ConfigService) {
    console.log('Creating DAVClient: ', {
      serverUrl: this.configService.get('DAV_SERVER_URL'),
      credentials: {
        username: this.configService.get('DAV_USERNAME'),
        password: this.configService.get('DAV_PASSWORD'),
      },
      authMethod: this.configService.get('DAV_AUTH_METHOD'),
      defaultAccountType: this.configService.get('DAV_ACCOUNT_TYPE'),
    }); 
    this.client = new DAVClient({
      serverUrl: this.configService.get('DAV_SERVER_URL'),
      credentials: {
        username: this.configService.get('DAV_USERNAME'),
        password: this.configService.get('DAV_PASSWORD'),
      },
      authMethod: this.configService.get('DAV_AUTH_METHOD'),
      defaultAccountType: this.configService.get('DAV_ACCOUNT_TYPE'),
    });
  }

  async getClient(): Promise<DAVClient> {
    console.log('Getting DAVClient');
    console.log(this.client);
    if (!this.client.authHeaders) {
      console.log('Logging in to DAV server');
      await this.client.login();
    }
    return this.client;
  }
}
