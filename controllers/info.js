const Advertiser = require("../models/advertiser");
const AdMainCategory = require("../models/ad-main-category");
const AdSubCategory = require("../models/ad-sub-category");
const Agency = require("../models/agency");
const Medium = require("../models/medium");

exports.getAdvertisers = (req, res, next) => {
  AdMainCategory.findAll()
    .then((mains) => {
      AdSubCategory.findAll()
        .then((subs) => {
          Advertiser.findAll().then((advertisers) => {
            advertisers.map((ad) => {
              ad.mainName = mains.find(
                (main) => main.id === ad.main_category
              ).name;
              ad.subName = subs.find((sub) => sub.id === ad.sub_category).name;
            });

            res.render("info/advertisers", {
              pageTitle: "Advertisers",
              menuTitle: "광고주 조회",
              path: "/advertisers",
              advertisers: advertisers,
              isLoggedIn: req.session.isLoggedIn,
              isAdmin: req.session.isAdmin,
            });
          });
        })
        .catch((err) => {
          return console.log(err);
        })
        .catch((err) => {
          return console.log(err);
        });
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.getAgencies = (req, res, next) => {
  Agency.findAll()
    .then((agencies) => {
      res.render("info/agencies", {
        pageTitle: "Agencies",
        menuTitle: "대행사 조회",
        path: "/agencies",
        agencies: agencies.reverse(),
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
      });
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.getCategories = (req, res, next) => {
  AdMainCategory.findAll().then((mains) => {
    AdSubCategory.findAll().then((subs) => {
      subs.map((sub) => {
        sub.mainName = mains.find(
          (main) => main.id === sub.adMainCategoryId
        ).name;
      });

      res.render("info/categories", {
        pageTitle: "Categories",
        menuTitle: "업종 조회",
        path: "/categories",
        mains: mains,
        subs: subs,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
      });
    });
  });
};

exports.getMedia = (req, res, next) => {
  Medium.findAll()
    .then((media) => {
      res.render("info/media", {
        pageTitle: "Media",
        menuTitle: "매체 조회",
        path: "/media",
        media: media.reverse(),
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
      });
    })
    .catch((err) => {
      return console.log(err);
    });
};