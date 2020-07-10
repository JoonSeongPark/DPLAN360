const Team = require("../models/team");
const Agency = require("../models/agency");
const Advertiser = require("../models/advertiser");
const MediaItem = require("../models/media-item");
const Campaign = require("../models/campaign");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getIndex = (req, res, next) => {
  res.render("work/index", {
    pageTitle: "Home",
    menuTitle: "Home",
    path: "/",
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};

exports.getSales = (req, res, next) => {
  const { team, agency, advertiser } = req.query;
  let { start_month, end_month } = req.query;
  const thisYear = new Date().getFullYear();

  if (start_month === "") {
    start_month = `${thisYear}-01`;
  }
  if (end_month === "") {
    end_month = `${thisYear}-12`;
  }
  
  const whereCondition = {
    where: {
      tax_date: {
        [Op.between]: [Date.parse(start_month), Date.parse(end_month)],
      },
    },
  };

  if (team !== "") whereCondition.where.teamId = team;
  if (agency !== "") whereCondition.where.agencyId = agency;
  if (advertiser !== "") whereCondition.where.advertiserId = advertiser;

  Team.findAll()
    .then((teams) => {
      Agency.findAll({ order: [["name", "ASC"]] })
        .then((agencies) => {
          Advertiser.findAll({ order: [["name", "ASC"]] })
            .then((advertisers) => {
              Campaign.findAll(whereCondition)
                .then((campaigns) => {
                  res.render("work/sales", {
                    pageTitle: "Sales",
                    menuTitle: "전체 매출조회",
                    path: "/sales",
                    sortInfo: {
                      team,
                      start_month,
                      end_month,
                      agency,
                      advertiser,
                    },
                    teams,
                    agencies,
                    advertisers,
                    campaigns,
                    isLoggedIn: req.session.isLoggedIn,
                    isAdmin: req.session.isAdmin,
                  });
                })
                .catch((err) => {
                  return console.log(err);
                });
            })
            .catch((err) => {
              return console.log(err);
            });
        })
        .catch((err) => {
          return console.log(err);
        });
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.getMediaSales = (req, res, next) => {
  const { media } = req.query;
  let { start_month, end_month } = req.query;
  const thisYear = new Date().getFullYear();
  const thisMonth =
    new Date().getMonth() < 10
      ? `0${new Date().getMonth()}`
      : new Date().getMonth();

  if (start_month === "") {
    start_month = `${thisYear}-01`;
  }
  if (end_month === "") {
    end_month = `${thisYear}-${thisMonth}`;
  }

  res.render("work/media-sales", {
    pageTitle: "Media Sales",
    menuTitle: "매체별 매출조회",
    path: "/media-sales",
    sortInfo: {
      media,
      start_month,
      end_month,
    },
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};
