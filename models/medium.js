const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Medium = sequelize.define("medium", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  pay_condition: {
    type: Sequelize.STRING,
  },
  bill_type: {
    type: Sequelize.STRING,
  },
  media_provide_fee: {
    type: Sequelize.STRING,
  },
  bill_pubilsher: {
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
});

module.exports = Medium;
