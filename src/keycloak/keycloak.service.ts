import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as querystring from 'querystring';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class KeycloakService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async addPictimePasswordToUser(user: any) {
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
    console.debug('Successfully got token');
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
    console.debug('Successfully got user');
    const atttributesResponse = this.httpService.put(
      `https://auth.picmind.org/admin/realms/master/users/${userResponse.data[0].id}`,
      {
        attributes: {
          pictime_password: password,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    try {
      await lastValueFrom(atttributesResponse);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException("Couldn't update user");
    }
    console.debug('Successfully updated user');
    return { pictime_password: password };
  }
}
