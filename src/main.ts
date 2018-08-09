import * as Db from './db';
import * as init from './initService';
import * as model from './table/index';

const config = require('../config.json')

async function bootstrap() {
  console.log('start nestjs');
  await Db.dbInit(config.db);
  init.initHttps();

}
bootstrap();
