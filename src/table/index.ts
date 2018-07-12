
import * as Sequelize from 'sequelize';
import * as Db from '../db';
let User: Sequelize.Model<any, any>;
let Group: Sequelize.Model<any, any>;
let Connect: Sequelize.Model<any, any>;
export  function init(){
    const db = Db.db;
    User =  db.import<any, any>('./models/user');
    Group =  db.import<any, any>('./models/group');
    Connect = db.import<any, any>('./models/connect');
}

export {User, Group, Connect}
