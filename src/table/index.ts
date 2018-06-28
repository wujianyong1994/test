
import * as Db from '../db';
let User;
export  function init(){
    const db = Db.db;
    User =  db.import<any, any>('./models/user');
}

export {User}
