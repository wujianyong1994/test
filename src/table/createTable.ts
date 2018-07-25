import * as Sequelize from 'sequelize';
import * as config from '../../config.json'
let User;
let Group;
let Connect;
console.log(config);
const db = new Sequelize(config.db);

User =  db.import<any, any>('./models/user');
Group =  db.import<any, any>('./models/group');
Connect = db.import<any, any>('./models/connect');
db.sync({force: true}).then(() => {
    console.log('TB created.')
})
