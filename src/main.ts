import { NestFactory } from '@nestjs/core';
import { CONFIG } from './app.constant';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(bodyParser.json({limit: CONFIG().limit.postData}));
  app.use(bodyParser.urlencoded({limit: CONFIG().limit.urlEncoded, extended: true}));
  await app.listen(CONFIG().port);
}
bootstrap();
