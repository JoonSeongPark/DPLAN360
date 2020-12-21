const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Medium = sequelize.define(
  "medium",
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
    biz_name: {
      type: Sequelize.STRING,
    },
    pay_condition: {
      type: Sequelize.STRING,
    },
    bill_type: {
      type: Sequelize.STRING,
    },
    provide_fee_rate: {
      type: Sequelize.STRING,
    },
    bill_publisher: {
      type: Sequelize.STRING,
    },
    memo: {
      type: Sequelize.STRING(1000),
    },
    inter_type: {
      type: Sequelize.STRING,
    },
    inter_name: {
      type: Sequelize.STRING,
    },
    agency_fee_rate: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    media_fee_rate: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    dplan_fee_rate: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    inter_fee_rate: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Medium;
