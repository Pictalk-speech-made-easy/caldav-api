import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('CalDav API')
    .setDescription(
      'CalDav API is used to manage calendars and events. It allows calendar operations and also event sharing across Picmind apps. Get an auth bearer from Keycloak',
    )
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  app.use(Sentry.Handlers.tracingHandler());
  await app.listen(3001);
}
bootstrap();
