import * as Db from './db';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const config = require('../config.json')

async function bootstrap() {
  await Db.dbInit(config.db);
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);

}
bootstrap();
