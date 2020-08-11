const AdMainCategory = require("../../models/ad-main-category");
const AdSubCategory = require("../../models/ad-sub-category");

exports.getAddCategory = async (req, res, next) => {
  try {
    const mainCategories = await AdMainCategory.findAll();

    res.render("admin/edit-category", {
      pageTitle: "Add Category",
      menuTitle: "업종 등록",
      path: "/admin/add-category",
      mains: mainCategories,
      editing: false,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postAddMain = async (req, res, next) => {
  const name = req.body.name;

  try {
    await AdMainCategory.create({
      name: name,
    });

    res.redirect("/categories");
  } catch (err) {
    console.log(err);
  }
};

exports.getEditMain = async (req, res, next) => {
  const mainId = req.params.mainId;

  try {
    const main = await AdMainCategory.findByPk(mainId);
    res.render("admin/edit-category", {
      pageTitle: "Edit Main Category",
      menuTitle: "업종(대분류) 수정",
      path: "/categories",
      main: main,
      editTarget: "main",
      editing: req.query.edit,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditMain = async (req, res, next) => {
  const mainId = req.body.mainId;
  const updated_name = req.body.name;

  try {
    const main = await AdMainCategory.findByPk(mainId);

    main.name = updated_name;

    await main.save();

    console.log("Main-Category Updated!");
    res.redirect("/categories");
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteMain = async (req, res, next) => {
  const mainId = req.body.mainId;

  try {
    const main = await AdMainCategory.findByPk(mainId);

    await main.destroy();

    console.log("Main-Category Destroyed!");
    res.redirect("/categories");
  } catch (err) {
    console.log(err);
  }
};

exports.postAddSub = async (req, res, next) => {
  const mainId = req.body.mainId;
  const name = req.body.name;

  try {
    const main = await AdMainCategory.findByPk(mainId);

    await main.createAdSubCategory({
      name: name,
    });
    res.redirect("/categories");
  } catch (err) {
    console.log(err);
  }
};

exports.getEditSub = async (req, res, next) => {
  const subId = req.params.subId;

  try {
    const mains = await AdMainCategory.findAll();

    const sub = await AdSubCategory.findByPk(subId);
    res.render("admin/edit-category", {
      pageTitle: "Edit Sub Category",
      menuTitle: "업(소분류) 수정",
      path: "/categories",
      mains: mains,
      sub: sub,
      editTarget: "sub",
      editing: req.query.edit,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditSub = async (req, res, next) => {
  const subId = req.body.subId;
  const updated_name = req.body.name;
  const updated_mainId = req.body.mainId;

  try {
    const sub = await AdSubCategory.findByPk(subId);

    sub.name = updated_name;
    sub.adMainCategoryId = updated_mainId;

    await sub.save();

    console.log("Sub-Category Updated!");
    res.redirect("/categories");
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteSub = async (req, res, next) => {
  const subId = req.body.subId;

  try {
    const sub = await AdSubCategory.findByPk(subId);

    await sub.destroy();

    console.log("Sub-Category Destroyed!");
    res.redirect("/categories");
  } catch (err) {
    console.log(err);
  }
};
