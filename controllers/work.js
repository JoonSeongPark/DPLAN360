const Campaign = require("../models/campaign");
const Team = require("../models/team");
const Advertiser = require("../models/advertiser");
const AdMainCategory = require("../models/ad-main-category");
const AdSubCategory = require("../models/ad-sub-category");
const Agency = require("../models/agency");
const Medium = require("../models/medium");

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
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
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

exports.getAddCampaign = (req, res, next) => {
  const user = req.user;
  AdMainCategory.findAll()
    .then((mains) => {
      AdSubCategory.findAll()
        .then((subs) => {
          Agency.findAll()
            .then((agencies) => {
              Medium.findAll()
                .then((media) => {
                  Advertiser.findAll()
                    .then((advertisers) => {
                      Team.findByPk(user.teamId)
                        .then((team) => {
                          const t_name = team ? team.name : null;
                          res.render("work/add-campaign", {
                            pageTitle: "Add Campaign",
                            menuTitle: "캠페인 등록",
                            path: "/add-campaign",
                            teamName: t_name,
                            userName: user.name,
                            advertisers: advertisers,
                            agencies: agencies,
                            media: media,
                            mains: mains,
                            subs: subs,
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
                  console.log(err);
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

exports.postAddCampaign = (req, res, next) => {
  const {
    // 캠페인 정보
    cam_type,
    user_name,
    cam_advertiser_id,
    cam_title,
    cam_agency,
    cam_start_date,
    cam_end_date,
    cam_ad_total,
    cam_agency_fee_rate,
    cam_agency_fee,
    cam_tax_month,
    media_issue_type,
    // 매체 정보
    media_name,
    media_start,
    media_end,
    lower_inter_type,
    lower_inter_name,
    lower_issue_type,
    lower_agency_fee_rate,
    lower_media_fee_rate,
    lower_dplan_fee_rate,
    lower_inter_fee_rate,
    lower_ad_fee,
    lower_agency_fee,
    lower_media_fee,
    lower_dplan_fee,
    lower_inter_fee,
    google_cid,
    lower_memo,
    _csrf,
    media_count,
  } = req.body;
  Team.findByPk(req.user.teamId)
    .then((team) => {
      team.createCampaign({
        type: cam_type,
        pic: user_name,
        title: cam_title,
        agency: cam_agency,
        period_begin: cam_start_date,
        period_end: cam_end_date,
        ad_fee: cam_ad_total,
        agency_fee_rate: cam_agency_fee_rate,
        agency_fee: cam_agency_fee,
        tax_date: cam_tax_month,
        issue_type: media_issue_type,
        advertiserId: cam_advertiser_id,
      });
    })
    .catch((err) => {
      return console.log(err);
    });
  res.redirect("/");
};
