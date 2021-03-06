module.exports = (sequelize, Sequelize) => sequelize.define(
  'User',
  {
    pseudo: {
      type: Sequelize.STRING,
      default: undefined,
    },
    password: {
      type: Sequelize.STRING,
      default: undefined,
    },
  },
  { freezeTableName: true },
);
