const Advertiser = require("../../models/advertiser");
const AdMainCategory = require("../../models/ad-main-category");
const AdSubCategory = require("../../models/ad-sub-category");

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
      AdMainCategory.findByPk(sub.adMainCategoryId)
        .then((main) => {
          Advertiser.create({
            name: name,
            main_category: main.id,
            sub_category: sub.id,
          })
            .then((advertiser) => {
              console.log("Advertiser Add!");
              res.redirect("/advertisers");
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
  AdMainCategory.findAll()
    .then((mains) => {
      AdSubCategory.findAll()
        .then((subs) => {
          Advertiser.findByPk(advertiserId)
            .then((advertiser) => {
              res.render("admin/edit-advertiser", {
                pageTitle: "Edit Advertiser",
                menuTitle: "광고주 수정",
                path: "/advertisers",
                advertiser: advertiser,
                mains: mains,
                subs: subs,
                editing: req.query.edit,
                isLoggedIn: req.session.isLoggedIn,
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
      res.redirect("/advertisers");
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
      res.redirect("/advertisers");
    })
    .catch((err) => {
      return console.log(err);
    });
};
