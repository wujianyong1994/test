import * as Sequelize from 'sequelize';
import {init} from 'table/index'

let db: Sequelize.Sequelize ;
async function dbInit(config: Sequelize.Options): Promise<boolean> {
    db = new Sequelize(config);
    console.log('DB');
    return await db.authenticate().then((a) => {
        console.log(config.database + ' DB initialized');
        init()
        return true;
    }).catch((err) => {
        console.error(config.database + 'error', err);
        return false;
    });
}
export { dbInit, Sequelize, db  }
