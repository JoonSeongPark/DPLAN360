const Sequelize = require("sequelize");

const sequelize = new Sequelize("dplan360", "root", "Pjs895623!", {
  dialect: "mysql",
  host: "localhost",
  logging: false,
});

module.exports = sequelize;
