const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Agency = sequelize.define(
  "agency",
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
    pay_condition: {
      type: Sequelize.STRING,
    },
    deposit_type: {
      type: Sequelize.STRING,
    },
    bill_type: {
      type: Sequelize.STRING,
    },
    bill_publisher: {
      type: Sequelize.STRING,
    },
    memo: {
      type: Sequelize.STRING(1000),
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Agency;
