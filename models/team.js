const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Team = sequelize.define("team", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  teamname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Team;
