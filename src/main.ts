import * as Db from './db';
import * as init from './initService';

const config = require('../config.json')

async function bootstrap() {
  console.log('start nestjs');
  await Db.dbInit(config.db);
  init.init();

}
bootstrap();
