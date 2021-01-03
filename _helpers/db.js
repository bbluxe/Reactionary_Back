const env = require("./env");
const Sequelize = require("sequelize");


const sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    dialect: env.dialect
  });

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