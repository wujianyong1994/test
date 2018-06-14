import * as Db from '../db';

const db = Db.db;
console.log(33333);
const User = db.import<any, any>('./models/user');
// const User = 11;

export { User };