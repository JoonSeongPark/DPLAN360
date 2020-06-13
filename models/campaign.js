const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Campaign = sequelize.define("campaign", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  writer: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  agency: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  period_begin: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  period_end: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  ad_fee: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  agency_fee_rate: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  agency_fee: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  tax_date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  tax_type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Campaign;
