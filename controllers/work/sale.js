const Team = require("../../models/team");
const Agency = require("../../models/agency");
const Advertiser = require("../../models/advertiser");
const Medium = require("../../models/medium");
const MediaItem = require("../../models/media-item");
const Campaign = require("../../models/campaign");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getIndex = (req, res, next) => {
  const thisYear = new Date().getFullYear();
  Campaign.findAll()
    .then((campaigns) => {
      MediaItem.findAll({
        where: {
          // 귀속시기 기준 현재 년도 정보 추출
          attribution_time: {
            [Op.between]: [
              Date.parse(`${thisYear}-01`),
              Date.parse(`${thisYear}-12`),
            ],
          },
        },
      })
        .then((mediaItems) => {
          mediaItems = mediaItems.map((mediaItem) => {
            return {
              ...mediaItem,
              teamId: campaigns.find(
                (campaign) => campaign.id === mediaItem.campaignId
              ).teamId,
            };
          });
          Team.findAll()
            .then((teams) => {
              teams.forEach((team) => {
                team.month = new Array();

                // 월별 계산
                new Array(12).fill(0).forEach((v, i) => {
                  const filteredMediaItems = mediaItems
                    .filter((mediaItem) => {
                      return (
                        +mediaItem.dataValues.attribution_time.getMonth() ===
                          +i && +mediaItem.teamId === +team.id
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
      attribution_time: {
        [Op.between]: [Date.parse(start_month), Date.parse(end_month)],
      },
    },
  };

  Team.findAll()
    .then((teams) => {
      Agency.findAll({ order: [["name", "ASC"]] })
        .then((agencies) => {
          Advertiser.findAll({ order: [["name", "ASC"]] })
            .then((advertisers) => {
              Campaign.findAll()
                .then((campaigns) => {
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

                  MediaItem.findAll(whereCondition)
                    .then((mediaItems) => {
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
                          team: teams.find(
                            (team) => +team.id === +mediaItem.campaign.teamId
                          ),
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
                      MediaItem.findAll(whereCondition)
                        .then((mediaItems) => {
                          // 캠페인 Object, 매체명 추가
                          mediaItems = mediaItems.map((mediaItem) => {
                            return {
                              ...mediaItem,
                              campaign: campaigns.find(
                                (campaign) =>
                                  +campaign.id === +mediaItem.campaignId
                              ),
                              mediaName: media.find(
                                (medium) => +medium.id === +mediaItem.mediumId
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
                                  +agency.id === +mediaItem.campaign.agencyId
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
};
