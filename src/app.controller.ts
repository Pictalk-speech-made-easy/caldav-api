import { Controller, Get, Post, UnauthorizedException } from '@nestjs/common';
import { CalDavService } from 'src/caldav.service';
import { AuthenticatedUser, Public } from 'nest-keycloak-connect';
import { HttpService } from '@nestjs/axios';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import * as querystring from 'querystring';
import { lastValueFrom } from 'rxjs';
@Controller()
export class AppController {
  constructor(
    private calDavService: CalDavService,
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  @Public(false)
  @Post()
  async createUserAndCalendar(@AuthenticatedUser() user: any): Promise<any> {
    if (!user) {
      throw new UnauthorizedException();
    }

    const password = await bcrypt.hash(user.email, 10);

    // Get username and password from env variables
    let response = await this.httpService.post(
      'https://auth.picmind.org/realms/master/protocol/openid-connect/token',
      querystring.stringify({
        grant_type: 'password',
        client_id: 'admin-cli',
        username: this.configService.get<string>('KEYCLOAK_ADMIN_USERNAME'),
        password: this.configService.get<string>('KEYCLOAK_ADMIN_PASSWORD'),
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    const tokenResponse = await lastValueFrom(response);
    response = this.httpService.get(
      `https://auth.picmind.org/admin/realms/master/users/?username=${user.email}&exact=true`,
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    const userResponse = await lastValueFrom(response);
    await this.calDavService.createUserAndCalendar(user.email, password);
    const atttributesResponse = this.httpService.put(
      `https://auth.picmind.org/admin/realms/master/users/${userResponse.data[0].id}`,
      {
        "attributes": {
          "pictime_password": [password],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    await lastValueFrom(atttributesResponse);
    return {pictime_password: password};
  }
}
