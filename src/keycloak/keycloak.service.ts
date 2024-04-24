import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as querystring from 'querystring';
import { lastValueFrom } from 'rxjs';
import { UserDto } from './user.dto';

@Injectable()
export class KeycloakService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async addPictimePasswordToUser(user: UserDto) {
    if (!user || typeof user.sub !== 'string') {
      console.log(user);
      throw new Error('User email is required and must be a string');
    }
    const password = await bcrypt.hash(user.sub, 10);

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
    const atttributesResponse = this.httpService.put(
      `https://auth.picmind.org/admin/realms/master/users/${user.sub}`,
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
