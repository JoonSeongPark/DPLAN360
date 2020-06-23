const Advertiser = require("../../models/advertiser");
const AdMainCategory = require("../../models/ad-main-category");
const AdSubCategory = require("../../models/ad-sub-category");

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

            res.render("admin/advertisers", {
              pageTitle: "Advertisers",
              menuTitle: "광고주 조회",
              path: "/admin/advertisers",
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

exports.getAddAdvertiser = (req, res, next) => {
  AdMainCategory.findAll()
    .then((mains) => {
      AdSubCategory.findAll()
        .then((subs) => {
          res.render("admin/edit-advertiser", {
            pageTitle: "Add Advertiser",
            menuTitle: "광고주 추가",
            path: "/admin/add-advertiser",
            mains: mains,
            subs: subs,
            editing: false,
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
};

exports.postAddAdvertiser = (req, res, next) => {
  const name = req.body.name;
  const subId = req.body.sub_category;

  AdSubCategory.findByPk(subId)
    .then((sub) => {
      console.log(sub);
      AdMainCategory.findByPk(sub.adMainCategoryId)
        .then((main) => {
          Advertiser.create({
            name: name,
            main_category: main.id,
            sub_category: sub.id,
          })
            .then((advertiser) => {
              console.log("Advertiser Add!");
              res.redirect("/admin/advertisers");
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

exports.getEditAdvertiser = (req, res, next) => {
  const advertiserId = req.params.advertiserId;
  console.log(req.body);
  AdMainCategory.findAll()
    .then((mains) => {
      AdSubCategory.findAll()
        .then((subs) => {
          Advertiser.findByPk(advertiserId)
            .then((advertiser) => {
              res.render("admin/edit-advertiser", {
                pageTitle: "Edit Advertiser",
                menuTitle: "광고주 수정",
                path: "/admin/advertisers",
                advertiser: advertiser,
                mains: mains,
                subs: subs,
                editing: req.query.edit,
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
};

exports.postEditAdvertiser = (req, res, next) => {
  const advertiserId = req.body.advertiserId;
  const updated_name = req.body.name;
  const updated_main_id = req.body.main_category;
  const updated_sub_id = req.body.sub_category;

  Advertiser.findByPk(advertiserId)
    .then((advertiser) => {
      advertiser.name = updated_name;
      advertiser.main_category = updated_main_id;
      advertiser.sub_category = updated_sub_id;
      return advertiser.save();
    })
    .then(() => {
      console.log("Advertiser Updated!");
      res.redirect("/admin/advertisers");
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.postDeleteAdvertiser = (req, res, next) => {
  const advertiserId = req.body.advertiserId;

  Advertiser.findByPk(advertiserId)
    .then((advertiser) => {
      return advertiser.destroy();
    })
    .then(() => {
      console.log("Advertiser Destroyed!");
      res.redirect("/admin/advertisers");
    })
    .catch((err) => {
      return console.log(err);
    });
};
