const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const MediaItem = require("../../models/media-item");
const Campaign = require("../../models/campaign");
const Medium = require("../../models/medium");
const Agency = require("../../models/agency");
const Team = require("../../models/team");
const Advertiser = require("../../models/advertiser");

exports.getTaxBill = async (req, res, next) => {
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();

  const targetMonth =
    req.query.target_month ||
    `${thisYear}-${("" + (thisMonth + 1)).padStart(2, "0")}`;

  const page_type = req.query.page_type || "close";

  const closedCondition = {};

  if (page_type === "open") {
    closedCondition.closed = true;
  }

  try {
    const mediaItems = await MediaItem.findAll({
      where: {
        [Op.or]: [
          {
            tax_date: {
              [Op.between]: [Date.parse(targetMonth), Date.parse(targetMonth)],
            },
          },
          {
            issue_date: {
              [Op.between]: [Date.parse(targetMonth), Date.parse(targetMonth)],
            },
          },
        ],
        ...closedCondition,
      },
      include: [
        { model: Medium },
        {
          model: Campaign,
          include: [{ model: Agency }, { model: Advertiser }, { model: Team }],
        },
      ],
    });

    res.render("work/tax-bill", {
      pageTitle: "Tax Bill",
      menuTitle: "세금 계산서",
      path: "/tax-bill",
      targetMonth,
      page_type,
      mediaItems,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postCloseItem = async (req, res, next) => {
  let { closeItems } = req.body;
  if (!closeItems) return res.redirect("/tax-bill");

  if (typeof closeItems === "string") {
    closeItems = [closeItems];
  }
  try {
    for (let id of closeItems) {
      const mediaItem = await MediaItem.findByPk(id);
      mediaItem.closed = "1";
      await mediaItem.save();
    }

    res.redirect("/tax-bill");
  } catch (err) {
    console.log(err);
  }
};

exports.postOpenItem = async (req, res, next) => {
  let { closeItems } = req.body;
  if (!closeItems) return res.redirect("/tax-bill");

  if (typeof closeItems === "string") {
    closeItems = [closeItems];
  }
  try {
    for (let id of closeItems) {
      const mediaItem = await MediaItem.findByPk(id);
      mediaItem.closed = "0";
      await mediaItem.save();
    }

    res.redirect("/tax-bill");
  } catch (err) {
    console.log(err);
  }
};
