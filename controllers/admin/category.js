const AdMainCategory = require("../../models/ad-main-category");
const AdSubCategory = require("../../models/ad-sub-category");

exports.getAddCategory = (req, res, next) => {
  AdMainCategory.findAll().then((mainCategories) => {
    res.render("admin/edit-category", {
      pageTitle: "Add Category",
      menuTitle: "업종 추가",
      path: "/admin/add-category",
      mains: mainCategories,
      editing: false,
      isLoggedIn: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
    });
  });
};

exports.postAddMain = (req, res, next) => {
  const name = req.body.name;

  AdMainCategory.create({
    name: name,
  })
    .then((main) => {
      res.redirect("/admin/categories");
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.getEditMain = (req, res, next) => {
  const mainId = req.params.mainId;

  AdMainCategory.findByPk(mainId).then((main) => {
    res.render("admin/edit-category", {
      pageTitle: "Edit Main Category",
      menuTitle: "업종(대분류) 수정",
      path: "/admin/categories",
      main: main,
      editTarget: "main",
      editing: req.query.edit,
      isLoggedIn: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
    });
  });
};

exports.postEditMain = (req, res, next) => {
  const mainId = req.body.mainId;
  const updated_name = req.body.name;

  AdMainCategory.findByPk(mainId)
    .then((main) => {
      main.name = updated_name;

      return main.save();
    })
    .then(() => {
      console.log("Main-Category Updated!");
      res.redirect("/admin/categories");
    });
};

exports.postDeleteMain = (req, res, next) => {
  const mainId = req.body.mainId;

  AdMainCategory.findByPk(mainId)
    .then((main) => {
      return main.destroy();
    })
    .then(() => {
      console.log("Main-Category Destroyed!");
      res.redirect("/admin/categories");
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.postAddSub = (req, res, next) => {
  const mainId = req.body.mainId;
  const name = req.body.name;

  AdMainCategory.findByPk(mainId)
    .then((main) => {
      main.createAdSubCategory({
        name: name,
      });
      res.redirect("/admin/categories");
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.getEditSub = (req, res, next) => {
  const subId = req.params.subId;

  AdMainCategory.findAll()
    .then((mains) => {
      AdSubCategory.findByPk(subId).then((sub) => {
        res.render("admin/edit-category", {
          pageTitle: "Edit Sub Category",
          menuTitle: "업(소분류) 수정",
          path: "/admin/categories",
          mains: mains,
          sub: sub,
          editTarget: "sub",
          editing: req.query.edit,
          isLoggedIn: req.session.isLoggedIn,
          isAdmin: req.session.isAdmin,
        });
      });
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.postEditSub = (req, res, next) => {
  const subId = req.body.subId;
  const updated_name = req.body.name;
  const updated_mainId = req.body.mainId;

  AdSubCategory.findByPk(subId)
    .then((sub) => {
      sub.name = updated_name;
      sub.adMainCategoryId = updated_mainId;

      return sub.save();
    })
    .then(() => {
      console.log("Sub-Category Updated!");
      res.redirect("/admin/categories");
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.postDeleteSub = (req, res, next) => {
  const subId = req.body.subId;

  AdSubCategory.findByPk(subId)
    .then((sub) => {
      return sub.destroy();
    })
    .then(() => {
      console.log("Sub-Category Destroyed!");
      res.redirect("/admin/categories");
    })
    .catch((err) => {
      return console.log(err);
    });
};
