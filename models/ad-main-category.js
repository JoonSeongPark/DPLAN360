const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const AdMainCategory = sequelize.define(
  "adMainCategory",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = AdMainCategory;
