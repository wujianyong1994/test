import * as Db from './db';
import * as init from './initService';
import * as model from './table/index';
import * as fs from 'fs'

const config = require('../config.json')

async function bootstrap() {
  console.log('start nestjs');
  await Db.dbInit(config.db);
  if (process.env.NODE_ENV === 'production'){
    init.initHttps();
  } else {
    await init.init();
  }
  // const bf = fs.readFileSync('./doc.txt');
  // console.log(bf);
  // init.socket()
}
bootstrap();
