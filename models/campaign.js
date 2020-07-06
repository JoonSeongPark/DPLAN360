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
  pic: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  title: {
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
  agency_fee: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  media_fee: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  dplan_fee: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  inter_fee: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  tax_date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  issue_type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Campaign;
