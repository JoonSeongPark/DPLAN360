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
    const campaign = await Campaign.findByPk(campaignId);
    const team = await Team.findByPk(campaign.teamId);
    const advertiser = await Advertiser.findByPk(campaign.advertiserId);
    const main = await AdMainCategory.findByPk(advertiser.main_category);
    const sub = await AdSubCategory.findByPk(advertiser.sub_category);
    const media = await Medium.findAll();
    const agency = await Agency.findByPk(campaign.agencyId);
    const mediaItems = await MediaItem.findAll({
      where: { campaignId: campaign.id },
    });

    res.render("work/campaign", {
      pageTitle: "Campaign",
      menuTitle: "캠페인 상세보기",
      path: "/campaign",
      campaign,
      team,
      advertiser,
      main,
      sub,
      media,
      agency,
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
    _csrf,
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
    lower_attribution_time,
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
    lower_attribution_time = [lower_attribution_time];
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
        attribution_time: lower_attribution_time[i],
        ad_fee: lower_ad_fee[i],
        agency_fee: lower_agency_fee[i],
        media_fee: lower_media_fee[i],
        dplan_fee: lower_dplan_fee[i],
        inter_fee: lower_inter_fee[i],
        google_cid: google_cid[i] === "" ? null : google_cid[i],
        memo: lower_memo[i],
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

  let blockCondition;

  if (new Date().getDate() < 10) {
    blockCondition = Date.parse(
      new Date(new Date().getFullYear(), new Date().getMonth() - 1)
    );
  } else {
    blockCondition = Date.parse(
      new Date(new Date().getFullYear(), new Date().getMonth())
    );
  }

  try {
    const campaign = await Campaign.findByPk(campaignId);
    const team = await Team.findByPk(campaign.teamId);
    const advertiser = await Advertiser.findByPk(campaign.advertiserId);
    const main = await AdMainCategory.findByPk(advertiser.main_category);
    const sub = await AdSubCategory.findByPk(advertiser.sub_category);
    const agency = await Agency.findByPk(campaign.agencyId);
    const media = await Medium.findAll();
    const mediaItems = await MediaItem.findAll({
      where: { campaignId: campaign.id },
    });

    res.render("work/edit-campaign", {
      pageTitle: "Edit Campaign",
      menuTitle: "캠페인 수정",
      path: "/edit-campaign",
      user,
      campaign,
      team,
      advertiser,
      agency,
      media,
      main,
      sub,
      mediaItems,
      blockCondition,
      editing: edit,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditCampaign = async (req, res, next) => {
  const user = req.user;

  // 캠페인 정보
  const { campaign_id, mediaItem_id, updated_mediaItem_id, _csrf } = req.body;

  const updated_cam_type = req.body.cam_type,
    updated_cam_title = req.body.cam_title,
    updated_cam_start_date = req.body.cam_start_date,
    updated_cam_end_date = req.body.cam_end_date,
    updated_cam_ad_total = req.body.cam_ad_total,
    updated_cam_agency_fee = req.body.cam_agency_fee,
    updated_cam_media_fee = req.body.cam_media_fee,
    updated_cam_dplan_fee = req.body.cam_dplan_fee,
    updated_cam_inter_fee = req.body.cam_inter_fee,
    updated_cam_tax_month = req.body.cam_tax_month,
    updated_media_issue_type = req.body.media_issue_type,
    updated_media_count = req.body.media_count;

  // 매체 정보
  let updated_media_id = req.body.media_id,
    updated_media_start = req.body.media_start,
    updated_media_end = req.body.media_end,
    updated_lower_inter_type = req.body.lower_inter_type,
    updated_lower_inter_name = req.body.lower_inter_name,
    updated_lower_issue_date = req.body.lower_issue_date,
    updated_lower_issue_type = req.body.lower_issue_type,
    updated_lower_attribution_time = req.body.lower_attribution_time,
    updated_lower_ad_fee = req.body.lower_ad_fee,
    updated_lower_agency_fee = req.body.lower_agency_fee,
    updated_lower_media_fee = req.body.lower_media_fee,
    updated_lower_dplan_fee = req.body.lower_dplan_fee,
    updated_lower_inter_fee = req.body.lower_inter_fee,
    updated_google_cid = req.body.google_cid,
    updated_lower_memo = req.body.lower_memo;

  // for loop 위해서 array화 시키기
  if (updated_media_count < 2) {
    updated_media_id = [updated_media_id];
    updated_media_start = [updated_media_start];
    updated_media_end = [updated_media_end];
    updated_lower_inter_type = [updated_lower_inter_type];
    updated_lower_inter_name = [updated_lower_inter_name];
    updated_lower_issue_date = [updated_lower_issue_date];
    updated_lower_issue_type = [updated_lower_issue_type];
    updated_lower_attribution_time = [updated_lower_attribution_time];
    updated_lower_ad_fee = [updated_lower_ad_fee];
    updated_lower_agency_fee = [updated_lower_agency_fee];
    updated_lower_media_fee = [updated_lower_media_fee];
    updated_lower_dplan_fee = [updated_lower_dplan_fee];
    updated_lower_inter_fee = [updated_lower_inter_fee];
    updated_google_cid = [updated_google_cid];
    updated_lower_memo = [updated_lower_memo];
  }

  // 삭제 Item DB Update
  try {
    for (let itemId of mediaItem_id) {
      if (!updated_mediaItem_id.includes(itemId)) {
        const item = await MediaItem.findByPk(itemId);

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
      if (!mediaItem_id.includes(updated_mediaItem_id[i])) {
        await updatedCampaign.createMediaItem({
          mediumId: updated_media_id[i],
          media_start: updated_media_start[i],
          media_end: updated_media_end[i],
          inter_type: updated_lower_inter_type[i],
          inter_name: updated_lower_inter_name[i],
          issue_date: updated_lower_issue_date[i],
          issue_type: updated_lower_issue_type[i],
          attribution_time: updated_lower_attribution_time[i],
          ad_fee: updated_lower_ad_fee[i],
          agency_fee: updated_lower_agency_fee[i],
          media_fee: updated_lower_media_fee[i],
          dplan_fee: updated_lower_dplan_fee[i],
          inter_fee: updated_lower_inter_fee[i],
          google_cid:
            updated_google_cid[i] === "" ? null : updated_google_cid[i],
          memo: updated_lower_memo[i],
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
        item.attribution_time = updated_lower_attribution_time[i];
        item.ad_fee = updated_lower_ad_fee[i];
        item.agency_fee = updated_lower_agency_fee[i];
        item.media_fee = updated_lower_media_fee[i];
        item.dplan_fee = updated_lower_dplan_fee[i];
        item.inter_fee = updated_lower_inter_fee[i];
        item.google_cid =
          updated_google_cid[i] === "" ? null : updated_google_cid[i];
        item.memo = updated_lower_memo[i];

        await item.save();
      }
    }

    res.redirect(`/campaign/${campaign_id}`);
  } catch (err) {
    console.log(err);
  }
};
