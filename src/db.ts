import * as Sequelize from 'sequelize';
let db: Sequelize.Sequelize ;
const gg = 1155;
async function dbInit(config: Sequelize.Options): Promise<boolean> {
    db = new Sequelize(config);
    console.log('DB');
    return await db.authenticate().then((a) => {
        console.log(config.database + ' DB initialized');
        return true;
    }).catch((err) => {
        console.error(config.database + 'error', err);
        return false;
    });
}
export { dbInit, Sequelize, db, gg }
