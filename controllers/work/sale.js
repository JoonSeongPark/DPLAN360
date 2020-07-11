const Team = require("../../models/team");
const Agency = require("../../models/agency");
const Advertiser = require("../../models/advertiser");
const Medium = require("../../models/medium");
const MediaItem = require("../../models/media-item");
const Campaign = require("../../models/campaign");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getIndex = (req, res, next) => {
  res.render("work/index", {
    pageTitle: "Home",
    menuTitle: "Home",
    path: "/",
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};

exports.getSales = (req, res, next) => {
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

  if (team !== "") whereCondition.where.teamId = team;
  if (agency !== "") whereCondition.where.agencyId = agency;
  if (advertiser !== "") whereCondition.where.advertiserId = advertiser;

  Team.findAll()
    .then((teams) => {
      Agency.findAll({ order: [["name", "ASC"]] })
        .then((agencies) => {
          Advertiser.findAll({ order: [["name", "ASC"]] })
            .then((advertisers) => {
              Campaign.findAll(whereCondition)
                .then((campaigns) => {
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
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.getMediaSales = (req, res, next) => {
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

  Team.findAll()
    .then((teams) => {
      Advertiser.findAll()
        .then((advertisers) => {
          Campaign.findAll()
            .then((campaigns) => {
              Agency.findAll()
                .then((agencies) => {
                  Medium.findAll()
                    .then((media) => {
                      MediaItem.findAll()
                        .then((mediaItemAll) => {
                          MediaItem.findAll(whereCondition)
                            .then((mediaItems) => {
                              // 존재하는 대행사만 넘기기 (select tag)
                              mediaItemsArr = [
                                ...new Set(
                                  mediaItemAll.map(
                                    (mediaItem) => mediaItem.dataValues.mediumId
                                  )
                                ),
                              ];
                              media = media.filter((medium) =>
                                mediaItemsArr.includes(medium.id)
                              );

                              // 캠페인 Object, 매체명 추가
                              mediaItems = mediaItems.map((mediaItem) => {
                                return {
                                  ...mediaItem,
                                  campaign: campaigns.find(
                                    (campaign) =>
                                      +campaign.id === +mediaItem.campaignId
                                  ),
                                  mediaName: media.find(
                                    (medium) =>
                                      +medium.id === +mediaItem.mediumId
                                  ).name,
                                };
                              });

                              // 팀, 광고주, 대행사 이름 추가
                              mediaItems = mediaItems.map((mediaItem) => {
                                return {
                                  ...mediaItem,
                                  teamName: teams.find(
                                    (team) =>
                                      +team.id === +mediaItem.campaign.teamId
                                  ).name,
                                  advertiserName: advertisers.find(
                                    (advertiser) =>
                                      +advertiser.id ===
                                      +mediaItem.campaign.advertiserId
                                  ).name,
                                  agencyName: agencies.find(
                                    (agency) =>
                                      +agency.id ===
                                      +mediaItem.campaign.agencyId
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
    })
    .catch((err) => {
      return console.log(err);
    });
};
