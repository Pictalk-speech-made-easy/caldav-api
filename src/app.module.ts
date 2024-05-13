import { Module } from '@nestjs/common';
import {
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
  AuthGuard,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import keycloakConfig from './config/keycloak.config';
import { EventModule } from './events/event.module';
import { BaikalModule } from './baikal/baikal.module';
import { KeycloakModule } from './keycloak/keycloak.module';
import { SentryModule } from '@ntegral/nestjs-sentry';
import * as Sentry from '@sentry/node';
import { Integration } from '@sentry/types';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ load: [keycloakConfig] }),
    KeycloakConnectModule.register(keycloakConfig()),
    TypeOrmModule.forRoot(typeOrmConfig),
    EventModule,
    BaikalModule,
    KeycloakModule,
    SentryModule.forRoot({
      dsn: 'https://466ab28bebba4e1c9e0f2583cc9855cd@o1135783.ingest.us.sentry.io/4507248877240320',
      environment: process.env.NODE_ENV,
      logLevels: ['debug'],
      integrations: [
        new Sentry.Integrations.Http({ tracing: true })
      ] as unknown as Integration[],

    }),
  ],
  controllers: [],
  providers: [
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
