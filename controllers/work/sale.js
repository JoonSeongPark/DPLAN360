const User = require("../../models/user");
const Team = require("../../models/team");
const Agency = require("../../models/agency");
const Advertiser = require("../../models/advertiser");
const Medium = require("../../models/medium");
const MediaItem = require("../../models/media-item");
const Campaign = require("../../models/campaign");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getIndex = async (req, res, next) => {
  let year = new Date().getFullYear();

  if (Object.keys(req.query).length) year = +req.query.year;

  try {
    const campaigns = await Campaign.findAll({
      where: {
        tax_date: {
          [Op.between]: [Date.parse(`${year}-01`), Date.parse(`${year}-12`)],
        },
      },
    });
    const teams = await Team.findAll();

    teams.forEach((team) => {
      team.month = new Array();

      new Array(12).fill(0).forEach((v, i) => {
        const filteredCampaigns = campaigns
          .filter((campaign) => {
            return (
              +campaign.tax_date.getMonth() === +i &&
              +campaign.teamId === +team.id
            );
          })
          .map((campaign) => {
            return {
              adFee: campaign.ad_fee,
              dplanFee: campaign.dplan_fee,
            };
          });

        const adSum = filteredCampaigns.reduce((acc, cur, i) => {
          return acc + cur.adFee;
        }, 0);
        const dplanSum = filteredCampaigns.reduce((acc, cur, i) => {
          return acc + cur.dplanFee;
        }, 0);

        team.month.push({ adSum, dplanSum });
      });
    });

    res.render("work/index", {
      pageTitle: "Home",
      menuTitle: "Home",
      path: "/",
      teams,
      year,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getSales = async (req, res, next) => {
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

  if (team) whereCondition.where.teamId = team;
  if (agency) whereCondition.where.agencyId = agency;
  if (advertiser) whereCondition.where.advertiserId = advertiser;

  try {
    const teams = await Team.findAll();

    const agencies = await Agency.findAll({ order: [["name", "ASC"]] });

    const advertisers = await Advertiser.findAll({ order: [["name", "ASC"]] });

    const campaigns = await Campaign.findAll({
      ...whereCondition,
      order: [
        ["tax_date", "ASC"],
        ["advertiserId", "ASC"],
        ["title", "ASC"],
      ],
    });

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
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getMediaSales = async (req, res, next) => {
  const { medium } = req.query;
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
      issue_date: {
        [Op.between]: [Date.parse(start_month), Date.parse(end_month)],
      },
    },
  };

  if (medium !== "") whereCondition.where.mediumId = medium;

  try {
    const media = await Medium.findAll();

    let mediaItems = await MediaItem.findAll({
      ...whereCondition,
      include: [
        {
          model: Campaign,
          include: [{ model: Team }, { model: Advertiser }, { model: Agency }],
        },
        { model: Medium },
      ],
      order: [
        ["mediumId", "ASC"],
        ["campaignId", "ASC"],
      ],
    });

    res.render("work/media-sales", {
      pageTitle: "Media Sales",
      menuTitle: "매체별 매출조회",
      path: "/media-sales",
      sortInfo: {
        medium,
        start_month,
        end_month,
      },
      media,
      mediaItems,
    });
  } catch (err) {
    console.log(err);
  }
};
