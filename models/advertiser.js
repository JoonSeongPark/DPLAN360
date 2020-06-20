const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Advertiser = sequelize.define(
  "advertiser",
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
    main_category: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    sub_category: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Advertiser;
