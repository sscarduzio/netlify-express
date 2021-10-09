const configManager = require('../config-manager')
const {Sequelize} = require('sequelize');
const pgPromise = require("pg-promise")();

module.exports = db = {initialize};

async function createDbIfNotPresent(connString, database) {
    const pg = pgPromise(connString)
    let res = await pg.any(`SELECT
                            FROM pg_database
                            WHERE datname = '${database}'`);
    if (res.length === 0) {
        try {
            await pg.any(`CREATE DATABASE ${database};`)

        } catch (e) {
            console.log("Could not create database " + database, e)
            process.exit(1)
        }
    }
}


async function initialize(req,res,next) {
    if (db._initialized) {
        return next()
    }
    console.log("Initializing DB...")
    const config = configManager.getConfig().database
    console.log("Using db config: ", config.user, config.host.substr(0,10) + "...")
    const {host, port, user, password, database} = config
    const connString = `postgres://${user}:${password}@${host}:${port}`

    //await createDbIfNotPresent(connString, database)

    const sequelize = new Sequelize(connString + "/" + database, {dialect: 'postgres'});
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error
    }

   // await sequelize.createSchema(getConfig().static.db_schema, {})

    // init models and add them to the exported db object
    db.Account = require('../auth/accounts/account.model')(sequelize);
    db.RefreshToken = require('../auth/accounts/refresh-token.model')(sequelize);
   // db.Affiliation = require('../entitlement/affiliation.model')(sequelize)
    // define relationships
    db.Account.hasMany(db.RefreshToken, {onDelete: 'CASCADE'});
    db.RefreshToken.belongsTo(db.Account);
  //  db.Affiliation.belongsTo(db.Account);
    db._initialized = true
    // sync all models with database
    await sequelize.sync();
    next()
}
