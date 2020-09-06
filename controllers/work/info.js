const Advertiser = require("../../models/advertiser");
const AdMainCategory = require("../../models/ad-main-category");
const AdSubCategory = require("../../models/ad-sub-category");
const Agency = require("../../models/agency");
const Medium = require("../../models/medium");
const Team = require("../../models/team");
const User = require("../../models/user");

exports.getAdvertisers = async (req, res, next) => {
  try {
    const advertisers = await Advertiser.findAll({
      include: {
        model: AdSubCategory,
        order: [["id", "ASC"]],
        include: { model: AdMainCategory, order: [["id", "ASC"]] },
      },
    });

    res.render("info/advertisers", {
      pageTitle: "Advertisers",
      menuTitle: "광고주 조회",
      path: "/advertisers",
      advertisers,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAgencies = async (req, res, next) => {
  try {
    const agencies = await Agency.findAll({ order: [["name", "ASC"]] });

    res.render("info/agencies", {
      pageTitle: "Agencies",
      menuTitle: "대행사 조회",
      path: "/agencies",
      agencies,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const mains = await AdMainCategory.findAll({ order: [["id", "ASC"]] });
    const subs = await AdSubCategory.findAll({
      order: [
        ["adMainCategoryId", "ASC"],
        ["name", "ASC"],
      ],
    });
    subs.forEach((sub) => {
      sub.mainName = mains.find(
        (main) => +main.id === +sub.adMainCategoryId
      ).name;
    });

    res.render("info/categories", {
      pageTitle: "Categories",
      menuTitle: "업종 조회",
      path: "/categories",
      mains,
      subs,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getMedia = async (req, res, next) => {
  try {
    const media = await Medium.findAll({ order: [["name", "ASC"]] });

    res.render("info/media", {
      pageTitle: "Media",
      menuTitle: "매체 조회",
      path: "/media",
      media,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getUsers = async (req, res, next) => {
  const teams = await Team.findAll({
    include: [
      {
        model: User,
      },
    ],
    order: [
      ["name", "ASC"],
      [User, "leader", "DESC"],
      [User, "name", "ASC"],
    ],
  });
  
  const memberMax = teams.reduce((maxValue, team) => {
    return Math.max(maxValue, team.users.length);
  }, 0);

  res.render("info/users", {
    pageTitle: "Users",
    menuTitle: "사용자 조회",
    path: "/users",
    teams,
    memberMax,
  });
};
