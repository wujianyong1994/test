import * as Sequelize from 'sequelize';
let db: Sequelize.Sequelize ;

async function dbInit(config: Sequelize.Options): Promise<boolean> {
    db = new Sequelize(config);
    console.log(11111111);
    return await db.authenticate().then((a) => {
        console.log(config.database + ' DB initialized');
        return true;
    }).catch((err) => {
        console.error(config.database + 'error', err);
        return false;
    });
}
export { dbInit, Sequelize, db }
