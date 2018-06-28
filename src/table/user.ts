import * as Db from '../db';

const db = Db.db;
console.log('user models');
const User =  db.import<any, any>('./models/user');


export { User };