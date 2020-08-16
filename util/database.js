const Sequelize = require("sequelize");

// const sequelize = new Sequelize("dplan360", "root", "Pjs895623!", {
//   dialect: "mysql",
//   host: "localhost",
//   logging: false,
// });
const sequelize = new Sequelize("dplan360", "admin", "MBovd5g1Y7GlK2g1z0Zv", {
  dialect: "mysql",
  host: "dplan360.c4j9lg274esc.us-east-2.rds.amazonaws.com",
  logging: false,
});

module.exports = sequelize;
