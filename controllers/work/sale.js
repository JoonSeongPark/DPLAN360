const Team = require("../../models/team");
const Agency = require("../../models/agency");
const Advertiser = require("../../models/advertiser");
const Medium = require("../../models/medium");
const MediaItem = require("../../models/media-item");
const Campaign = require("../../models/campaign");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getIndex = async (req, res, next) => {
  const thisYear = new Date().getFullYear();
  try {
    const campaigns = await Campaign.findAll();

    let mediaItems = await MediaItem.findAll({
      where: {
        // 귀속시기 기준 현재 년도 정보 추출
        attribution_time: {
          [Op.between]: [
            Date.parse(`${thisYear}-01`),
            Date.parse(`${thisYear}-12`),
          ],
        },
      },
    });

    mediaItems = mediaItems.map((mediaItem) => {
      return {
        ...mediaItem,
        teamId: campaigns.find(
          (campaign) => campaign.id === mediaItem.campaignId
        ).teamId,
      };
    });

    const teams = await Team.findAll();

    teams.forEach((team) => {
      team.month = new Array();

      // 월별 계산
      new Array(12).fill(0).forEach((v, i) => {
        const filteredMediaItems = mediaItems
          .filter((mediaItem) => {
            return (
              +mediaItem.dataValues.attribution_time.getMonth() === +i &&
              +mediaItem.teamId === +team.id
            );
          })
          .map((mediaItem) => {
            return {
              adFee: mediaItem.dataValues.ad_fee,
              dplanFee: mediaItem.dataValues.dplan_fee,
            };
          });

        const adSum = filteredMediaItems.reduce((acc, cur, i) => {
          return acc + cur.adFee;
        }, 0);
        const dplanSum = filteredMediaItems.reduce((acc, cur, i) => {
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
      attribution_time: {
        [Op.between]: [Date.parse(start_month), Date.parse(end_month)],
      },
    },
  };

  try {
    const teams = await Team.findAll();

    const agencies = await Agency.findAll({ order: [["name", "ASC"]] });

    const advertisers = await Advertiser.findAll({ order: [["name", "ASC"]] });

    let campaigns = await Campaign.findAll();

    if (team !== "") {
      campaigns = campaigns.filter((campaign) => {
        return +campaign.teamId === +team;
      });
    }
    if (agency !== "") {
      campaigns = campaigns.filter((campaign) => {
        return +campaign.agencyId === +agency;
      });
    }
    if (advertiser !== "") {
      campaigns = campaigns.filter((campaign) => {
        return +campaign.advertiserId === +advertiser;
      });
    }
    const targetCampaignIds = campaigns.map((campaign) => {
      return campaign.id;
    });
    whereCondition.where.campaignId = targetCampaignIds;

    let mediaItems = await MediaItem.findAll(whereCondition);

    mediaItems = mediaItems.map((mediaItem) => {
      return {
        ...mediaItem,
        campaign: campaigns.find(
          (campaign) => +campaign.id === +mediaItem.campaignId
        ),
      };
    });
    mediaItems = mediaItems.map((mediaItem) => {
      return {
        ...mediaItem,
        team: teams.find((team) => +team.id === +mediaItem.campaign.teamId),
      };
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
      mediaItems,
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
    const teams = await Team.findAll();

    const advertisers = await Advertiser.findAll();

    const campaigns = await Campaign.findAll();

    const agencies = await Agency.findAll();

    const media = await Medium.findAll();

    let mediaItems = await MediaItem.findAll(whereCondition);

    // 캠페인 Object, 매체명 추가
    mediaItems = mediaItems.map((mediaItem) => {
      return {
        ...mediaItem,
        campaign: campaigns.find(
          (campaign) => +campaign.id === +mediaItem.campaignId
        ),
        mediaName: media.find((medium) => +medium.id === +mediaItem.mediumId)
          .name,
      };
    });

    // 팀, 광고주, 대행사 이름 추가
    mediaItems = mediaItems.map((mediaItem) => {
      return {
        ...mediaItem,
        teamName: teams.find((team) => +team.id === +mediaItem.campaign.teamId)
          .name,
        advertiserName: advertisers.find(
          (advertiser) => +advertiser.id === +mediaItem.campaign.advertiserId
        ).name,
        agencyName: agencies.find(
          (agency) => +agency.id === +mediaItem.campaign.agencyId
        ).name,
      };
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
