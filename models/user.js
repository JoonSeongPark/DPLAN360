const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const User = sequelize.define(
  "user",
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
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    leader: {
      type: Sequelize.TINYINT,
      allowNull: false,
    },
    block_auth: {
      type: Sequelize.TINYINT,
      allowNull: false,
    },
    resetToken: Sequelize.STRING,
    resetTokenExpiration: Sequelize.DATE,
  },
  {
    timestamps: false,
  }
);

module.exports = User;
