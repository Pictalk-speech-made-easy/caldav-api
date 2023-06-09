import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
  AuthGuard,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { CalDavService } from './caldav.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './db_config/typeorm.config';
@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    KeycloakConnectModule.register({
      authServerUrl: 'https://auth.picmind.org',
      realm: 'master',
      clientId: 'caldav-api',
      secret: '6lIPEisLPO6pwVFX1AgN87zLC2mnjodB',
      // Secret key of the client taken from keycloak server
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
  controllers: [AppController],
  providers: [
    CalDavService,
    // This adds a global level authentication guard,
    // you can also have it scoped
    // if you like.
    //
    // Will return a 401 unauthorized when it is unable to
    // verify the JWT token or Bearer header is missing.
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // This adds a global level resource guard, which is permissive.
    // Only controllers annotated with (http://twitter.com/Resource) and
    // methods with @Scopes
    // are handled by this guard.
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    // New in 1.1.0
    // This adds a global level role guard, which is permissive.
    // Used by @Roles decorator with the
    // optional @AllowAnyRole decorator for allowing any
    // specified role passed.
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
