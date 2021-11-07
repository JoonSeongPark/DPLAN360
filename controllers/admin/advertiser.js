const Advertiser = require("../../models/advertiser");
const AdMainCategory = require("../../models/ad-main-category");
const AdSubCategory = require("../../models/ad-sub-category");

exports.getAddAdvertiser = async (req, res, next) => {
  try {
    const mains = await AdMainCategory.findAll();
    const subs = await AdSubCategory.findAll();

    res.render("admin/edit-advertiser", {
      pageTitle: "Add Advertiser",
      menuTitle: "광고주 등록",
      path: "/admin/add-advertiser",
      mains,
      subs,
      editing: false,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postAddAdvertiser = async (req, res, next) => {
  const name = req.body.name;
  const subId = req.body.sub_category;
  try {
    const sub = await AdSubCategory.findByPk(subId);

    await sub.createAdvertiser({
      name,
    });

    res.redirect("/advertisers");
  } catch (err) {
    console.log(err);
  }
};

exports.getEditAdvertiser = async (req, res, next) => {
  try {
    const advertiserId = req.params.advertiserId;

    const mains = await AdMainCategory.findAll();
    const subs = await AdSubCategory.findAll();
    const advertiser = await Advertiser.findByPk(advertiserId, {
      include: [
        {
          model: AdSubCategory,
        },
      ],
    });

    res.render("admin/edit-advertiser", {
      pageTitle: "Edit Advertiser",
      menuTitle: "광고주 수정",
      path: "/advertisers",
      advertiser,
      mains,
      subs,
      editing: req.query.edit,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditAdvertiser = async (req, res, next) => {
  const advertiserId = req.body.advertiserId;
  const updated_name = req.body.name;
  const updated_sub_id = req.body.sub_category;

  try {
    const advertiser = await Advertiser.findByPk(advertiserId);

    advertiser.name = updated_name;
    advertiser.adSubCategoryId = updated_sub_id;

    await advertiser.save();

    res.redirect("/advertisers");
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteAdvertiser = async (req, res, next) => {
  const advertiserId = req.body.advertiserId;

  try {
    const firstCampaign = await Campaign.findOne({ where: { advertiserId } });

    if (firstCampaign !== null) {
      res.redirect("/advertisers");
      return;
    }

    const advertiser = await Advertiser.findByPk(advertiserId);

    await advertiser.destroy();

    res.redirect("/advertisers");
  } catch (err) {
    console.log(err);
  }
};
