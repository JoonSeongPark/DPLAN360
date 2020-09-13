const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const MediaItem = sequelize.define("mediaItem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  media_start: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  media_end: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  inter_type: {
    type: Sequelize.STRING,
  },
  inter_name: {
    type: Sequelize.STRING,
  },
  issue_date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  issue_type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  media_deposit_date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  attribution_time: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  agency_deposit_date: {
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
  google_cid: {
    type: Sequelize.INTEGER,
  },
  memo: {
    type: Sequelize.STRING,
  },
});

module.exports = MediaItem;
