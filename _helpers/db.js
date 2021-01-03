/* eslint-disable no-console */

const Sequelize = require('sequelize');
const env = require('./env');
const envDev = require('./env-dev');

let sequelize = null;
if (process.argv[2] === 'dev') {
  sequelize = new Sequelize({
    database: envDev.database,
    username: envDev.username,
    password: envDev.password,
    host: envDev.host,
    dialect: envDev.dialect,
  });
} else {
  sequelize = new Sequelize({
    database: env.database,
    username: env.username,
    password: env.password,
    host: env.host,
    dialect: env.dialect,
    dialectOptions: env.dialectOptions,
  });
}

sequelize
  .authenticate()
  .then(() => {
    if (process.argv[2] === 'dev') {
      console.log(
        `PostgresSQL en cours avec Sequelize avec la db ${envDev.database}`,
      );
    } else {
      console.log(
        `PostgresSQL en cours avec Sequelize avec la db ${env.database}`,
      );
    }
  })
  .catch((err) => {
    console.log(err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('../users/users.schema')(sequelize, Sequelize);

module.exports = db;
