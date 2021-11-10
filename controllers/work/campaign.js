const Campaign = require("../../models/campaign");
const Team = require("../../models/team");
const Advertiser = require("../../models/advertiser");
const AdMainCategory = require("../../models/ad-main-category");
const AdSubCategory = require("../../models/ad-sub-category");
const Agency = require("../../models/agency");
const Medium = require("../../models/medium");
const MediaItem = require("../../models/media-item");

exports.getCampaign = async (req, res, next) => {
  const campaignId = req.params.campaignId;

  try {
    const campaign = await Campaign.findByPk(campaignId, {
      include: [
        {
          model: Team,
        },
        {
          model: Advertiser,
          include: [
            { model: AdSubCategory, include: { model: AdMainCategory } },
          ],
        },
        {
          model: Agency,
        },
      ],
    });

    if (campaign === null) {
      res.status(404).render("404", {
        pageTitle: "Page Not Found",
        menuTitle: "페이지를 찾을 수 없습니다.",
        path: "/404",
        isLoggedIn: false,
      });
    }

    const mediaItems = await MediaItem.findAll({
      where: { campaignId: campaign.id },
      order: [
        ["mediumId", "ASC"],
        ["issue_date", "ASC"],
      ],
      include: { model: Medium },
    });

    res.render("work/campaign", {
      pageTitle: "Campaign",
      menuTitle: "캠페인 상세보기",
      path: "/campaign",
      campaign,
      mediaItems,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAddCampaign = async (req, res, next) => {
  const user = req.user;
  try {
    const mains = await AdMainCategory.findAll();
    const subs = await AdSubCategory.findAll();
    const agencies = await Agency.findAll();
    const media = await Medium.findAll();
    const advertisers = await Advertiser.findAll();
    const team = await Team.findByPk(user.teamId);

    res.render("work/edit-campaign", {
      pageTitle: "Add Campaign",
      menuTitle: "캠페인 등록",
      path: "/add-campaign",
      team,
      user,
      advertisers,
      agencies,
      media,
      mains,
      subs,
      editing: false,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postAddCampaign = async (req, res, next) => {
  const user = req.user;
  const {
    // 캠페인 정보
    cam_type,
    user_name,
    cam_advertiser_id,
    cam_title,
    cam_agency_id,
    cam_start_date,
    cam_end_date,
    cam_ad_total,
    cam_agency_fee,
    cam_media_fee,
    cam_dplan_fee,
    cam_inter_fee,
    cam_tax_month,
    media_issue_type,
    media_count,
  } = req.body;
  // 매체 정보
  let {
    media_id,
    media_start,
    media_end,
    lower_inter_type,
    lower_inter_name,
    lower_issue_date,
    lower_issue_type,
    media_deposit_date,
    agency_deposit_date,
    lower_ad_fee,
    lower_agency_fee,
    lower_media_fee,
    lower_dplan_fee,
    lower_inter_fee,
    google_cid,
    lower_memo,
  } = req.body;

  // for loop 위해서 array화 시키기
  if (media_count < 2) {
    media_id = [media_id];
    media_start = [media_start];
    media_end = [media_end];
    lower_inter_type = [lower_inter_type];
    lower_inter_name = [lower_inter_name];
    lower_issue_date = [lower_issue_date];
    lower_issue_type = [lower_issue_type];
    media_deposit_date = [media_deposit_date];
    agency_deposit_date = [agency_deposit_date];
    lower_ad_fee = [lower_ad_fee];
    lower_agency_fee = [lower_agency_fee];
    lower_media_fee = [lower_media_fee];
    lower_dplan_fee = [lower_dplan_fee];
    lower_inter_fee = [lower_inter_fee];
    google_cid = [google_cid];
    lower_memo = [lower_memo];
  }

  try {
    const team = await Team.findByPk(req.user.teamId);

    const cam = await team.createCampaign({
      type: cam_type,
      pic: user_name,
      title: cam_title,
      period_begin: cam_start_date,
      period_end: cam_end_date,
      ad_fee: cam_ad_total,
      agency_fee: cam_agency_fee,
      media_fee: cam_media_fee,
      dplan_fee: cam_dplan_fee,
      inter_fee: cam_inter_fee,
      tax_date: cam_tax_month,
      issue_type: media_issue_type,
      writer: user.name,
      advertiserId: cam_advertiser_id,
      agencyId: cam_agency_id,
    });

    for (let i = 0; i < media_count; i++) {
      await cam.createMediaItem({
        mediumId: media_id[i],
        media_start: media_start[i],
        media_end: media_end[i],
        inter_type: lower_inter_type[i],
        inter_name: lower_inter_name[i],
        issue_date: lower_issue_date[i],
        issue_type: lower_issue_type[i],
        media_deposit_date: media_deposit_date[i],
        attribution_time: new Date(
          Math.min(Date.parse(cam_tax_month), Date.parse(lower_issue_date[i]))
        ),
        tax_date: cam_tax_month,
        agency_deposit_date: agency_deposit_date[i],
        ad_fee: lower_ad_fee[i],
        agency_fee: lower_agency_fee[i],
        media_fee: lower_media_fee[i],
        dplan_fee: lower_dplan_fee[i],
        inter_fee: lower_inter_fee[i],
        google_cid: google_cid[i] === "" ? null : google_cid[i],
        memo: lower_memo[i],
        closed: false,
      });
    }

    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

exports.getEditCampaign = async (req, res, next) => {
  const user = req.user;
  const campaignId = req.params.campaignId;
  const edit = req.query.edit;

  try {
    const campaign = await Campaign.findByPk(campaignId, {
      include: [
        {
          model: Team,
        },
        {
          model: Advertiser,
          include: [
            { model: AdSubCategory, include: { model: AdMainCategory } },
          ],
        },
        {
          model: Agency,
        },
      ],
    });
    const mediaItems = await MediaItem.findAll({
      where: { campaignId: campaign.id },
      order: [
        ["mediumId", "ASC"],
        ["issue_date", "ASC"],
      ],
      include: { model: Medium },
    });

    const media = await Medium.findAll();

    res.render("work/edit-campaign", {
      pageTitle: "Edit Campaign",
      menuTitle: "캠페인 수정",
      path: "/edit-campaign",
      user,
      campaign,
      mediaItems,
      mediaItemIds: mediaItems.map((mediaItem) => mediaItem.id),
      media,
      editing: edit,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditCampaign = async (req, res, next) => {
  const user = req.user;

  // 캠페인 정보
  const { campaign_id, mediaItem_id, prior_mediaItem_count } = req.body;
  let { prior_mediaItem_id } = req.body;
  prior_mediaItem_id =
    prior_mediaItem_count < 2 ? [prior_mediaItem_id] : prior_mediaItem_id;

  const {
    cam_type,
    cam_title,
    cam_start_date,
    cam_end_date,
    cam_ad_total,
    cam_agency_fee,
    cam_media_fee,
    cam_dplan_fee,
    cam_inter_fee,
    cam_tax_month,
    media_issue_type,
    media_count,
    media_id,
    media_start,
    media_end,
    lower_inter_type,
    lower_inter_name,
    lower_issue_date,
    lower_issue_type,
    media_deposit_date,
    agency_deposit_date,
    lower_ad_fee,
    lower_agency_fee,
    lower_media_fee,
    lower_dplan_fee,
    lower_inter_fee,
    google_cid,
    lower_memo,
    lower_closed,
  } = req.body;

  const updated_cam_type = cam_type,
    updated_cam_title = cam_title,
    updated_cam_start_date = cam_start_date,
    updated_cam_end_date = cam_end_date,
    updated_cam_ad_total = cam_ad_total,
    updated_cam_agency_fee = cam_agency_fee,
    updated_cam_media_fee = cam_media_fee,
    updated_cam_dplan_fee = cam_dplan_fee,
    updated_cam_inter_fee = cam_inter_fee,
    updated_cam_tax_month = cam_tax_month,
    updated_media_issue_type = media_issue_type,
    updated_media_count = media_count;

  // 매체 정보
  let updated_media_id = updated_media_count < 2 ? [media_id] : media_id,
    updated_mediaItem_id =
      updated_media_count < 2 ? [mediaItem_id] : mediaItem_id,
    updated_media_start = updated_media_count < 2 ? [media_start] : media_start,
    updated_media_end = updated_media_count < 2 ? [media_end] : media_end,
    updated_lower_inter_type =
      updated_media_count < 2 ? [lower_inter_type] : lower_inter_type,
    updated_lower_inter_name =
      updated_media_count < 2 ? [lower_inter_name] : lower_inter_name,
    updated_lower_issue_date =
      updated_media_count < 2 ? [lower_issue_date] : lower_issue_date,
    updated_lower_issue_type =
      updated_media_count < 2 ? [lower_issue_type] : lower_issue_type,
    updated_media_deposit_date =
      updated_media_count < 2 ? [media_deposit_date] : media_deposit_date,
    updated_agency_deposit_date =
      updated_media_count < 2 ? [agency_deposit_date] : agency_deposit_date,
    updated_lower_ad_fee =
      updated_media_count < 2 ? [lower_ad_fee] : lower_ad_fee,
    updated_lower_agency_fee =
      updated_media_count < 2 ? [lower_agency_fee] : lower_agency_fee,
    updated_lower_media_fee =
      updated_media_count < 2 ? [lower_media_fee] : lower_media_fee,
    updated_lower_dplan_fee =
      updated_media_count < 2 ? [lower_dplan_fee] : lower_dplan_fee,
    updated_lower_inter_fee =
      updated_media_count < 2 ? [lower_inter_fee] : lower_inter_fee,
    updated_google_cid = updated_media_count < 2 ? [google_cid] : google_cid,
    updated_lower_memo = updated_media_count < 2 ? [lower_memo] : lower_memo,
    updated_lower_closed =
      updated_media_count < 2 ? [lower_closed] : lower_closed;

  // 삭제 Item DB Update
  try {
    for (let priorId of prior_mediaItem_id) {
      if (!updated_mediaItem_id.includes(priorId)) {
        const item = await MediaItem.findByPk(priorId);

        await item.destroy();
      }
    }

    const campaign = await Campaign.findByPk(campaign_id);

    campaign.type = updated_cam_type;
    campaign.title = updated_cam_title;
    campaign.period_begin = updated_cam_start_date;
    campaign.period_end = updated_cam_end_date;
    campaign.ad_fee = updated_cam_ad_total;
    campaign.agency_fee = updated_cam_agency_fee;
    campaign.media_fee = updated_cam_media_fee;
    campaign.dplan_fee = updated_cam_dplan_fee;
    campaign.inter_fee = updated_cam_inter_fee;
    campaign.tax_date = updated_cam_tax_month;
    campaign.issue_type = updated_media_issue_type;
    campaign.writer = user.name;

    const updatedCampaign = await campaign.save();

    for (let i = 0; i < updated_media_count; i++) {
      // 추가 Item DB Update
      if (!prior_mediaItem_id.includes(updated_mediaItem_id[i])) {
        await updatedCampaign.createMediaItem({
          mediumId: updated_media_id[i],
          media_start: updated_media_start[i],
          media_end: updated_media_end[i],
          inter_type: updated_lower_inter_type[i],
          inter_name: updated_lower_inter_name[i],
          issue_date: updated_lower_issue_date[i],
          issue_type: updated_lower_issue_type[i],
          media_deposit_date: updated_media_deposit_date[i],
          attribution_time: new Date(
            Math.min(
              Date.parse(updated_cam_tax_month),
              Date.parse(updated_lower_issue_date[i])
            )
          ),
          tax_date: updated_cam_tax_month,
          agency_deposit_date: updated_agency_deposit_date[i],
          ad_fee: updated_lower_ad_fee[i],
          agency_fee: updated_lower_agency_fee[i],
          media_fee: updated_lower_media_fee[i],
          dplan_fee: updated_lower_dplan_fee[i],
          inter_fee: updated_lower_inter_fee[i],
          google_cid:
            updated_google_cid[i] === "" ? null : updated_google_cid[i],
          memo: updated_lower_memo[i],
          closed: false,
        });
      } else {
        // 수정 Item DB Update
        const item = await MediaItem.findByPk(updated_mediaItem_id[i]);

        item.media_start = updated_media_start[i];
        item.media_end = updated_media_end[i];
        item.inter_type = updated_lower_inter_type[i];
        item.inter_name = updated_lower_inter_name[i];
        item.issue_date = updated_lower_issue_date[i];
        item.issue_type = updated_lower_issue_type[i];
        item.media_deposit_date = updated_media_deposit_date[i];
        item.attribution_time = new Date(
          Math.min(
            Date.parse(updated_cam_tax_month),
            Date.parse(updated_lower_issue_date[i])
          )
        );
        item.tax_date = updated_cam_tax_month;
        item.agency_deposit_date = updated_agency_deposit_date[i];
        item.ad_fee = updated_lower_ad_fee[i];
        item.agency_fee = updated_lower_agency_fee[i];
        item.media_fee = updated_lower_media_fee[i];
        item.dplan_fee = updated_lower_dplan_fee[i];
        item.inter_fee = updated_lower_inter_fee[i];
        item.google_cid =
          updated_google_cid[i] === "" ? null : updated_google_cid[i];
        item.memo = updated_lower_memo[i];
        item.closed = updated_lower_closed[i];

        await item.save();
      }
    }

    res.redirect(`/campaign/${campaign_id}`);
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteCampaign = async (req, res, next) => {
  const { campaignId } = req.params;

  const campaign = await Campaign.findByPk(campaignId);

  const mediaItems = await campaign.getMediaItems();

  for (let mediaItem of mediaItems) {
    await mediaItem.destroy();
  }

  await campaign.destroy();

  res.redirect("/");
};
