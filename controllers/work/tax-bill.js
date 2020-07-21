const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const MediaItem = require("../../models/media-item");
const Campaign = require("../../models/campaign");
const Medium = require("../../models/medium");
const Agency = require("../../models/agency");
const Team = require("../../models/team");
const Advertiser = require("../../models/advertiser");

exports.getTaxBill = (req, res, next) => {
  const thisYear = new Date().getFullYear();

  for (let month in req.query) {
    if (req.query[month] === "") {
      if (`${month}`.includes("start")) {
        req.query[month] = `${thisYear}-01`;
      }
      if (`${month}`.includes("end")) {
        req.query[month] = `${thisYear}-12`;
      }
    }
  }

  const { agency_start, agency_end, media_start, media_end } = req.query;

  Team.findAll()
    .then((teams) => {
      Advertiser.findAll()
        .then((advertisers) => {
          Agency.findAll()
            .then((agencies) => {
              Medium.findAll()
                .then((media) => {
                  Campaign.findAll()
                    .then((campaigns) => {
                      MediaItem.findAll({
                        where: {
                          attribution_time: {
                            [Op.between]: [
                              Date.parse(agency_start),
                              Date.parse(agency_end),
                            ],
                          },
                          issue_date: {
                            [Op.between]: [
                              Date.parse(media_start),
                              Date.parse(media_end),
                            ],
                          },
                        },
                      })
                        .then((mediaItems) => {
                          // media, campaign 추가
                          mediaItems = mediaItems.map((mediaItem) => {
                            return {
                              ...mediaItem,
                              media: media.find((medium) => {
                                return +medium.id === +mediaItem.mediumId;
                              }),
                              campaign: campaigns.find((campaign) => {
                                return +campaign.id === +mediaItem.campaignId;
                              }),
                            };
                          });

                          // agency, advertiserName, teamName 추가
                          mediaItems = mediaItems.map((mediaItem) => {
                            return {
                              ...mediaItem,
                              agency: agencies.find((agency) => {
                                return (
                                  +agency.id === +mediaItem.campaign.agencyId
                                );
                              }),
                              advertiserName: advertisers.find((advertiser) => {
                                return (
                                  +advertiser.id ===
                                  +mediaItem.campaign.advertiserId
                                );
                              }).name,
                              teamName: teams.find((team) => {
                                return +team.id === +mediaItem.campaign.teamId;
                              }).name,
                            };
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
