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

  const agency_start = req.query.agency_start || `${thisYear}-01`;
  const agency_end = req.query.agency_end || `${thisYear}-12`;
  const media_start = req.query.media_start || `${thisYear}-01`;
  const media_end = req.query.media_end || `${thisYear}-12`;

  try {
    const mediaItems = await MediaItem.findAll({
      where: {
        attribution_time: {
          [Op.between]: [Date.parse(agency_start), Date.parse(agency_end)],
        },
        issue_date: {
          [Op.between]: [Date.parse(media_start), Date.parse(media_end)],
        },
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
      sortInfo: {
        agency_start,
        agency_end,
        media_start,
        media_end,
      },
      mediaItems,
    });
  } catch (err) {
    console.log(err);
  }
};
