const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const MediaItem = sequelize.define("mediaItem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  period_begin: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  period_end: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  issue_date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  ad_fee: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = MediaItem;
