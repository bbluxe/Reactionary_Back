const env = require("./env");
const Sequelize = require("sequelize");

if (process.env.HEROKU_POSTGRESQL_BRONZE_URL) {
  // the application is executed on Heroku ... use the postgres database
  sequelize = new Sequelize(process.env.HEROKU_POSTGRESQL_BRONZE_URL, {
    dialect:  'postgres',
    protocol: 'postgres',
    port:     match[4],
    host:     match[3],
    logging:  true //false
  });
} else { 
  const sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    dialect: env.dialect
  });
}

const test = new Sequelize

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "PostgresSQL en cours avec Sequelize avec la db " + env.database
    );
  })
  .catch(err => {
    console.log(err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Création des champs de la bdd via leur route
db.User = require("../users/users.schema")(sequelize, Sequelize);

module.exports = db;