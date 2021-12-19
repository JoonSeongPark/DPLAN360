const Team = require("../../models/team");
const Agency = require("../../models/agency");
const Advertiser = require("../../models/advertiser");
const Medium = require("../../models/medium");
const MediaItem = require("../../models/media-item");
const Campaign = require("../../models/campaign");
const AdMainCategory = require("../../models/ad-main-category");
const AdSubCategory = require("../../models/ad-sub-category");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getIndex = async (req, res, next) => {
  const year = Object.keys(req.query).length
    ? +req.query.year
    : new Date().getFullYear();

  try {
    const mediaItems = await MediaItem.findAll({
      where: {
        attribution_time: {
          [Op.between]: [Date.parse(`${year}-01`), Date.parse(`${year}-12`)],
        },
      },
      include: [{ model: Campaign }],
    });

    const teams = await Team.findAll({ where: { normal: 1 } });

    teams.forEach((team) => {
      team.month = new Array();

      new Array(12).fill(0).forEach((v, i) => {
        const filteredMediaItems = mediaItems
          .filter((mediaItem) => {
            return (
              +mediaItem.attribution_time.getMonth() === +i &&
              +mediaItem.campaign.teamId === +team.id
            );
          })
          .map((mediaItem) => {
            return {
              adFee: mediaItem.ad_fee,
              dplanFee: mediaItem.dplan_fee,
            };
          });

        const sum = filteredMediaItems.reduce(
          (acc, cur) => {
            acc.adSum += cur.adFee;
            acc.dplanSum += cur.dplanFee;
            return acc;
          },
          { adSum: 0, dplanSum: 0 }
        );

        team.month.push(sum);
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
  let {
    type = "attribution",
    year = new Date().getFullYear(),
    team,
    period,
    advertiser,
    agency,
    medium,
  } = req.query;

  try {
    const teams = await Team.findAll({ where: { normal: 1 } });

    const teamCondition = {};
    if (team) teamCondition.teamId = team;

    const advertiserCondition = {};
    if (advertiser) advertiserCondition.advertiserId = advertiser;

    const agencyCondition = {};
    if (agency) agencyCondition.agencyId = agency;

    const mediumCondition = {};
    if (medium) mediumCondition.mediumId = medium;

    const periodCondition = {};

    const boundary = {
      start: "01",
      end: "12",
    };

    if (period) {
      const [periodType, periodNum] = period.split("-");

      switch (periodType) {
        case "quarter":
          const startNum = 3 * Number(periodNum) - 2;
          boundary.start = String(startNum).padStart(2, "0");
          boundary.end = String(startNum + 2).padStart(2, "0");
          break;
        case "month":
          boundary.start = periodNum.padStart(2, "0");
          boundary.end = periodNum.padStart(2, "0");
          break;
      }
    }

    switch (type) {
      case "attribution":
        Object.assign(periodCondition, {
          attribution_time: {
            [Op.between]: [
              Date.parse(`${year}-${boundary.start}`),
              Date.parse(`${year}-${boundary.end}`),
            ],
          },
        });
        break;
      case "taxdate":
        Object.assign(periodCondition, {
          tax_date: {
            [Op.between]: [
              Date.parse(`${year}-${boundary.start}`),
              Date.parse(`${year}-${boundary.end}`),
            ],
          },
        });
        break;
      case "issuedate":
        Object.assign(periodCondition, {
          issue_date: {
            [Op.between]: [
              Date.parse(`${year}-${boundary.start}`),
              Date.parse(`${year}-${boundary.end}`),
            ],
          },
        });
        break;
    }

    const mediaItems = await MediaItem.findAll({
      where: { ...periodCondition, ...mediumCondition },
      include: [
        {
          model: Campaign,
          include: [{ model: Team }, { model: Advertiser }, { model: Agency }],
          where: {
            ...teamCondition,
            ...advertiserCondition,
            ...agencyCondition,
          },
        },
        { model: Medium },
      ],
      order: [
        [Campaign, "teamId", "ASC"],
        [Campaign, "advertiserId", "ASC"],
        [Campaign, "title", "ASC"],
        ["ad_fee", "DESC"],
      ],
    });

    const total = mediaItems.reduce(
      (acc, cur) => {
        acc.adSum += cur.ad_fee;
        acc.agencySum += cur.agency_fee;
        acc.mediaSum += cur.media_fee;
        acc.dplanSum += cur.dplan_fee;
        acc.interSum += cur.inter_fee;
        return acc;
      },
      {
        adSum: 0,
        agencySum: 0,
        mediaSum: 0,
        dplanSum: 0,
        interSum: 0,
      }
    );

    res.render("work/sales", {
      pageTitle: "Sales",
      menuTitle: "전체 조회",
      path: "/sales",
      teams,
      mediaItems,
      total,
      sortInfo: {
        type,
        year,
        team,
        period,
        advertiser,
        agency,
        medium,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const totalSumFunction = (targets, type) => {
  const defaultArr = [];

  if (!targets[0]) {
    switch (type) {
      case "quarter":
        return new Array(5).fill({ adSum: 0, dplanSum: 0 });
      case "month":
        return new Array(13).fill({ adSum: 0, dplanSum: 0 });
    }
  }

  for (let i = 0; i < targets[0].period.length; i++) {
    defaultArr.push({ adSum: 0, dplanSum: 0 });
  }

  const total = targets.reduce((acc, target) => {
    target.period.forEach((term, idx) => {
      acc[idx].adSum += term.adSum;
      acc[idx].dplanSum += term.dplanSum;
    });

    return acc;
  }, defaultArr);

  return total;
};

exports.getAdvertiserSales = async (req, res, next) => {
  const {
    type = "attribution",
    year = new Date().getFullYear(),
    team,
    period = "quarter",
    main,
    sub,
  } = req.query;

  const mainCondition = {};
  if (main) {
    Object.assign(mainCondition, { adMainCategoryId: main });
  }
  const subCondition = {};

  if (sub) {
    Object.assign(subCondition, { adSubCategoryId: sub });
  }

  try {
    const teams = await Team.findAll({ where: { normal: 1 } });

    const mains = await AdMainCategory.findAll();
    const subs = await AdSubCategory.findAll();

    let advertisers;
    if (sub) {
      advertisers = await Advertiser.findAll({
        where: { ...subCondition },
      });
    } else {
      advertisers = await Advertiser.findAll({
        include: [{ model: AdSubCategory, where: { ...mainCondition } }],
      });
    }

    const teamCondition = {};
    if (team) {
      Object.assign(teamCondition, { teamId: team });
    }

    if (type === "attribution") {
      const mediaItems = await MediaItem.findAll({
        where: {
          attribution_time: {
            [Op.between]: [Date.parse(`${year}-01`), Date.parse(`${year}-12`)],
          },
        },
        include: [
          {
            model: Campaign,
            where: { ...teamCondition },
          },
        ],
      });

      advertisers.forEach((advertiser) => {
        advertiser.period = new Array();

        if (period === "quarter") {
          [-1, 0, 3, 6, 9].forEach((v) => {
            const filteredMediaItems = mediaItems
              .filter((mediaItem) => {
                return v < 0
                  ? Number(mediaItem.campaign.advertiserId) ===
                      Number(advertiser.id)
                  : Number(mediaItem.campaign.advertiserId) ===
                      Number(advertiser.id) &&
                      (Number(mediaItem.tax_date.getMonth()) === Number(v) ||
                        Number(mediaItem.tax_date.getMonth()) ===
                          Number(v) + 1 ||
                        Number(mediaItem.tax_date.getMonth()) ===
                          Number(v) + 2);
              })
              .map((mediaItem) => {
                return {
                  adFee: mediaItem.ad_fee,
                  dplanFee: mediaItem.dplan_fee,
                };
              });

            const sum = filteredMediaItems.reduce(
              (acc, cur) => {
                acc.adSum += cur.adFee;
                acc.dplanSum += cur.dplanFee;
                return acc;
              },
              { adSum: 0, dplanSum: 0 }
            );

            advertiser.period.push(sum);
          });
        } else if (period === "month") {
          new Array(13).fill(0).forEach((v, i) => {
            const filteredMediaItems = mediaItems
              .filter((mediaItem) => {
                return i === 0
                  ? Number(mediaItem.campaign.advertiserId) ===
                      Number(advertiser.id)
                  : Number(mediaItem.campaign.advertiserId) ===
                      Number(advertiser.id) &&
                      Number(mediaItem.tax_date.getMonth()) === i - 1;
              })
              .map((mediaItem) => {
                return {
                  adFee: mediaItem.ad_fee,
                  dplanFee: mediaItem.dplan_fee,
                };
              });

            const sum = filteredMediaItems.reduce(
              (acc, cur) => {
                acc.adSum += cur.adFee;
                acc.dplanSum += cur.dplanFee;
                return acc;
              },
              { adSum: 0, dplanSum: 0 }
            );

            advertiser.period.push(sum);
          });
        }
      });
    } else {
      const campaigns = await Campaign.findAll({
        where: {
          tax_date: {
            [Op.between]: [Date.parse(`${year}-01`), Date.parse(`${year}-12`)],
          },
          ...teamCondition,
        },
      });

      if (period === "quarter") {
        advertisers.forEach((advertiser) => {
          advertiser.period = new Array();

          [-1, 0, 3, 6, 9].forEach((v) => {
            const filteredCampaigns = campaigns
              .filter((campaign) => {
                return v < 0
                  ? Number(campaign.advertiserId) === Number(advertiser.id)
                  : Number(campaign.advertiserId) === Number(advertiser.id) &&
                      (Number(campaign.tax_date.getMonth()) === Number(v) ||
                        Number(campaign.tax_date.getMonth()) ===
                          Number(v) + 1 ||
                        Number(campaign.tax_date.getMonth()) === Number(v) + 2);
              })
              .map((campaign) => {
                return {
                  adFee: campaign.ad_fee,
                  dplanFee: campaign.dplan_fee,
                };
              });

            const sum = filteredCampaigns.reduce(
              (acc, cur) => {
                acc.adSum += cur.adFee;
                acc.dplanSum += cur.dplanFee;
                return acc;
              },
              { adSum: 0, dplanSum: 0 }
            );

            advertiser.period.push(sum);
          });
        });
      } else if (period === "month") {
        advertisers.forEach((advertiser) => {
          advertiser.period = new Array();
          new Array(13).fill(0).forEach((v, i) => {
            const filteredCampaigns = campaigns
              .filter((campaign) => {
                return i === 0
                  ? Number(campaign.advertiserId) === Number(advertiser.id)
                  : Number(campaign.advertiserId) === Number(advertiser.id) &&
                      Number(campaign.tax_date.getMonth()) === i - 1;
              })
              .map((campaign) => {
                return {
                  adFee: campaign.ad_fee,
                  dplanFee: campaign.dplan_fee,
                };
              });

            const sum = filteredCampaigns.reduce(
              (acc, cur) => {
                acc.adSum += cur.adFee;
                acc.dplanSum += cur.dplanFee;
                return acc;
              },
              { adSum: 0, dplanSum: 0 }
            );

            advertiser.period.push(sum);
          });
        });
      }
    }

    const filteredAdvertisers = advertisers
      .filter((advertiser) => {
        return (
          advertiser.period[0].adSum !== 0 &&
          advertiser.period[0].dplanSum !== 0
        );
      })
      .sort((a, b) => b.period[0].adSum - a.period[0].adSum);

    res.render("work/advertiser-sales", {
      pageTitle: "Advertiser Sales",
      menuTitle: "광고주별 매출조회",
      path: "/advertiser-sales",
      teams,
      mains,
      subs,
      advertisers: filteredAdvertisers,
      total: totalSumFunction(advertisers, period),
      sortInfo: {
        type,
        year,
        team,
        period,
        main,
        sub,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAgencySales = async (req, res, next) => {
  const {
    type = "attribution",
    year = new Date().getFullYear(),
    team,
    period = "quarter",
  } = req.query;

  try {
    const teams = await Team.findAll({ where: { normal: 1 } });

    const agencies = await Agency.findAll();

    const teamCondition = {};
    if (team) {
      Object.assign(teamCondition, { teamId: team });
    }

    if (type === "attribution") {
      const mediaItems = await MediaItem.findAll({
        where: {
          attribution_time: {
            [Op.between]: [Date.parse(`${year}-01`), Date.parse(`${year}-12`)],
          },
        },
        include: [
          {
            model: Campaign,
            where: { ...teamCondition },
          },
        ],
      });

      agencies.forEach((agency) => {
        agency.period = new Array();

        if (period === "quarter") {
          [-1, 0, 3, 6, 9].forEach((v) => {
            const filteredMediaItems = mediaItems
              .filter((mediaItem) => {
                return v < 0
                  ? Number(mediaItem.campaign.agencyId) === Number(agency.id)
                  : Number(mediaItem.campaign.agencyId) === Number(agency.id) &&
                      (Number(mediaItem.tax_date.getMonth()) === Number(v) ||
                        Number(mediaItem.tax_date.getMonth()) ===
                          Number(v) + 1 ||
                        Number(mediaItem.tax_date.getMonth()) ===
                          Number(v) + 2);
              })
              .map((mediaItem) => {
                return {
                  adFee: mediaItem.ad_fee,
                  dplanFee: mediaItem.dplan_fee,
                };
              });

            const sum = filteredMediaItems.reduce(
              (acc, cur) => {
                acc.adSum += cur.adFee;
                acc.dplanSum += cur.dplanFee;
                return acc;
              },
              { adSum: 0, dplanSum: 0 }
            );

            agency.period.push(sum);
          });
        } else if (period === "month") {
          new Array(13).fill(0).forEach((v, i) => {
            const filteredMediaItems = mediaItems
              .filter((mediaItem) => {
                return i === 0
                  ? Number(mediaItem.campaign.agencyId) === Number(agency.id)
                  : Number(mediaItem.campaign.agencyId) === Number(agency.id) &&
                      Number(mediaItem.tax_date.getMonth()) === i - 1;
              })
              .map((mediaItem) => {
                return {
                  adFee: mediaItem.ad_fee,
                  dplanFee: mediaItem.dplan_fee,
                };
              });

            const sum = filteredMediaItems.reduce(
              (acc, cur) => {
                acc.adSum += cur.adFee;
                acc.dplanSum += cur.dplanFee;
                return acc;
              },
              { adSum: 0, dplanSum: 0 }
            );

            agency.period.push(sum);
          });
        }
      });
    } else {
      const campaigns = await Campaign.findAll({
        where: {
          tax_date: {
            [Op.between]: [Date.parse(`${year}-01`), Date.parse(`${year}-12`)],
          },
          ...teamCondition,
        },
      });

      if (period === "quarter") {
        agencies.forEach((agency) => {
          agency.period = new Array();

          [-1, 0, 3, 6, 9].forEach((v) => {
            const filteredCampaigns = campaigns
              .filter((campaign) => {
                return v < 0
                  ? Number(campaign.agencyId) === Number(agency.id)
                  : Number(campaign.agencyId) === Number(agency.id) &&
                      (Number(campaign.tax_date.getMonth()) === Number(v) ||
                        Number(campaign.tax_date.getMonth()) ===
                          Number(v) + 1 ||
                        Number(campaign.tax_date.getMonth()) === Number(v) + 2);
              })
              .map((campaign) => {
                return {
                  adFee: campaign.ad_fee,
                  dplanFee: campaign.dplan_fee,
                };
              });

            const sum = filteredCampaigns.reduce(
              (acc, cur) => {
                acc.adSum += cur.adFee;
                acc.dplanSum += cur.dplanFee;
                return acc;
              },
              { adSum: 0, dplanSum: 0 }
            );

            agency.period.push(sum);
          });
        });
      } else if (period === "month") {
        agencies.forEach((agency) => {
          agency.period = new Array();
          new Array(13).fill(0).forEach((v, i) => {
            const filteredCampaigns = campaigns
              .filter((campaign) => {
                return i === 0
                  ? Number(campaign.agencyId) === Number(agency.id)
                  : Number(campaign.agencyId) === Number(agency.id) &&
                      Number(campaign.tax_date.getMonth()) === i - 1;
              })
              .map((campaign) => {
                return {
                  adFee: campaign.ad_fee,
                  dplanFee: campaign.dplan_fee,
                };
              });

            const sum = filteredCampaigns.reduce(
              (acc, cur) => {
                acc.adSum += cur.adFee;
                acc.dplanSum += cur.dplanFee;
                return acc;
              },
              { adSum: 0, dplanSum: 0 }
            );

            agency.period.push(sum);
          });
        });
      }
    }

    const filteredAgencies = agencies
      .filter((ageincy) => {
        return (
          ageincy.period[0].adSum !== 0 && ageincy.period[0].dplanSum !== 0
        );
      })
      .sort((a, b) => b.period[0].adSum - a.period[0].adSum);

    res.render("work/agency-sales", {
      pageTitle: "Agency Sales",
      menuTitle: "대행사별 매출조회",
      path: "/agency-sales",
      teams,
      agencies: filteredAgencies,
      total: totalSumFunction(agencies, period),
      sortInfo: {
        type,
        year,
        team,
        period,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getMediaItemSales = async (req, res, next) => {
  const {
    type = "attribution",
    year = new Date().getFullYear(),
    team,
    period = "quarter",
  } = req.query;

  try {
    const teams = await Team.findAll({ where: { normal: 1 } });

    const media = await Medium.findAll();

    const teamCondition = {};
    if (team) teamCondition.teamId = team;

    const typeCondition = {};
    if (type === "attribution") {
      Object.assign(typeCondition, {
        attribution_time: {
          [Op.between]: [Date.parse(`${year}-01`), Date.parse(`${year}-12`)],
        },
      });
    } else {
      Object.assign(typeCondition, {
        issue_date: {
          [Op.between]: [Date.parse(`${year}-01`), Date.parse(`${year}-12`)],
        },
      });
    }

    const mediaItems = await MediaItem.findAll({
      where: { ...typeCondition },
      include: [
        {
          model: Campaign,
          where: { ...teamCondition },
        },
      ],
    });

    media.forEach((medium) => {
      medium.period = new Array();

      if (period === "quarter") {
        [-1, 0, 3, 6, 9].forEach((v) => {
          const filteredMediaItems = mediaItems
            .filter((mediaItem) => {
              return v < 0
                ? Number(mediaItem.mediumId) === Number(medium.id)
                : Number(mediaItem.mediumId) === Number(medium.id) &&
                    (Number(mediaItem.tax_date.getMonth()) === Number(v) ||
                      Number(mediaItem.tax_date.getMonth()) === Number(v) + 1 ||
                      Number(mediaItem.tax_date.getMonth()) === Number(v) + 2);
            })
            .map((mediaItem) => {
              return {
                adFee: mediaItem.ad_fee,
                dplanFee: mediaItem.dplan_fee,
              };
            });

          const sum = filteredMediaItems.reduce(
            (acc, cur) => {
              acc.adSum += cur.adFee;
              acc.dplanSum += cur.dplanFee;
              return acc;
            },
            { adSum: 0, dplanSum: 0 }
          );

          medium.period.push(sum);
        });
      } else if (period === "month") {
        new Array(13).fill(0).forEach((v, i) => {
          const filteredMediaItems = mediaItems
            .filter((mediaItem) => {
              return i === 0
                ? Number(mediaItem.mediumId) === Number(medium.id)
                : Number(mediaItem.mediumId) === Number(medium.id) &&
                    Number(mediaItem.tax_date.getMonth()) === i - 1;
            })
            .map((mediaItem) => {
              return {
                adFee: mediaItem.ad_fee,
                dplanFee: mediaItem.dplan_fee,
              };
            });

          const sum = filteredMediaItems.reduce(
            (acc, cur) => {
              acc.adSum += cur.adFee;
              acc.dplanSum += cur.dplanFee;
              return acc;
            },
            { adSum: 0, dplanSum: 0 }
          );

          medium.period.push(sum);
        });
      }
    });

    const filteredMedia = media
      .filter((medium) => {
        return medium.period[0].adSum !== 0 && medium.period[0].dplanSum !== 0;
      })
      .sort((a, b) => b.period[0].adSum - a.period[0].adSum);

    res.render("work/medium-sales", {
      pageTitle: "Media Sales",
      menuTitle: "매체별 매출조회",
      path: "/medium-sales",
      teams,
      media: filteredMedia,
      total: totalSumFunction(media, period),
      sortInfo: {
        type,
        year,
        team,
        period,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
