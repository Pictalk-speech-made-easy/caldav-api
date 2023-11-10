import { Module } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  providers: [KeycloakService],
  exports: [KeycloakService],
})
export class KeycloakModule {}
